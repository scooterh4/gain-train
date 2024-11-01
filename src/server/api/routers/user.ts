import { type AppUser } from "@prisma/client";
import { z } from "zod";
import { isBetterSet } from "~/lib/utils";
import { type WorkoutDisplayType } from "~/pages/history";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  helloUser: publicProcedure
    .query<AppUser | null>(async ({ ctx }) => {
      if (!ctx.authUser) {
        return null
      }
      
      const user= await ctx.prisma.appUser.findFirst({
        where: {
          auth_uid: ctx.authUser.id
          }
      })

      if (user) {
        return user
      }

      console.log("Creating user")
      // First time logging in, so save the user id to our database
      const name: string | undefined = ctx.authUser.user_metadata.name as string
      const email: string = ctx.authUser.email ?? ""
      const authUid = ctx.authUser.id

      const newUser = await ctx.prisma.appUser.create({
        data:{
          name: name, 
          email: email,
          auth_uid: authUid
        }
      })

      return newUser
    }),

  getLatest: publicProcedure.query<AppUser[] | null>(async ({ ctx }) => {
    const users: AppUser[] = await ctx.prisma.appUser.findMany({
      orderBy: { created_at: "desc" },
    });

    return users ?? null;
  }),

  logWorkout: protectedProcedure
    .input(
      z.object({
        started_at: z.number(),
        workout: z.array(
          z.object({
            exercise: z.object({ 
              id: z.string(),
              created_at: z.date(),
              updated_at: z.date(),
              user_id: z.string(),
              exercise_name: z.string(),
              addedAt: z.number(), 
              exercise_type_id: z.string()
            }),
            sets: z.array(
              z.object({
                prev_set: z.string(),
                set_num: z.number(),
                weight: z.number().nullable(),
                reps: z.number().nullable()
              })
            )
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
        where: {
          auth_uid: ctx.authUser?.id
        }
      })

      if (!user) {
        return
      }

      try {
        const workoutLog = await ctx.prisma.workoutLog.create({
          data: {
            AppUser: {
              connect: user
            },
            started_at: new Date(input.started_at).toISOString(),
            ended_at: new Date(Date.now()).toISOString(),
            workout_name: `Test workout ${Math.random() * 1000}`,
            notes: "Nothing new" 
          }
        })

        const exerciseTypes = await ctx.prisma.exerciseType.findMany()
        
        for (const exer of input.workout) {
          const exerciseLog = await ctx.prisma.exerciseLog.create({
            data: {
              user_id: user.id,     
              workoutLog_id: workoutLog.id,  
              exercise_id : exer.exercise.id,
              notes: ""
            }
          })

          const exerType = exerciseTypes.find(type => type.id === exer.exercise.exercise_type_id)
          if (!exerType) {
            console.log("No exercise type!")
            return
          }

          // TODO debug this because it still doesn't work for weighted_bodyweight exercises
          const definedSets = exer.sets.map((set) => {
            if (exerType.name === "Normal weighted") {
              if (set.weight && set.reps) {
                return {
                  exercise_id: exer.exercise.id,
                  exerciseLog_id: exerciseLog.id,
                  set_num: set.set_num,
                  weight: set.weight,
                  reps: set.reps,
                }
              }
            }

            if (exerType.name === "Weighted bodyweight") {
              if (set.reps) {
                return {
                  exercise_id: exer.exercise.id,
                  exerciseLog_id: exerciseLog.id,
                  set_num: set.set_num,
                  weight: set.weight ? set.weight : null,
                  reps: set.reps,
                }
              }
            }

            return null
          })
          .filter(set => !!set)

          // adjust set numbers
          const newSets = definedSets.map((set, index) => {
            return {
              ...set,
              set_num: index + 1 
            }
          }) 

          await ctx.prisma.setLog.createMany({
            data: newSets
          })
          
          const sets = await ctx.prisma.setLog.findMany({
            where: {
              exercise_id: exer.exercise.id
            }
          })
  
          let newDailyBest = null;
          let newAlltimeBest = null;
        
          for (const set of sets) {
            if (!newAlltimeBest) {
              newAlltimeBest = set;
            } else if (isBetterSet(set, newAlltimeBest)) {
              newAlltimeBest = set;
            }
        
            if (!newDailyBest) {
              newDailyBest = set;
            } else if (isBetterSet(set, newDailyBest)) {
              newDailyBest = set;
            }
          }
        
          const alltimeBest = await ctx.prisma.alltimePersonalBests.findFirst({
            where: {
              AppUser: {
                auth_uid: ctx.authUser.id
              },
              exercise_id: exer.exercise.id
            },
            include: {
              SetLog: true
            }
          })

          // Get today
          const today = new Date()
          const startOfDay = new Date(today.setHours(0, 0, 0, 0));
          const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
          const dailyBest = await ctx.prisma.dailyPersonalBests.findFirst({
            where: {
              AppUser: {
                auth_uid: ctx.authUser.id
              },
              exercise_id: exer.exercise.id, 
              created_at: {
                gte: startOfDay,
                lte: endOfDay
              }
            },
            include: {
              SetLog: true
            }
          })

          // Update the database with newAlltimeBest if they've changed
          if (!!newAlltimeBest && isBetterSet(newAlltimeBest, alltimeBest?.SetLog)) {
            if (alltimeBest) {
              // Update
              await ctx.prisma.alltimePersonalBests.update({
                where: { id: alltimeBest.id },
                data: { setLog_id: newAlltimeBest.id }
              });
            } else {
              // Create
              await ctx.prisma.alltimePersonalBests.create({
                data: {
                  user_id: user.id,
                  exercise_id: newAlltimeBest.exercise_id,
                  setLog_id: newAlltimeBest.id 
                }
              });
            }
          }
  
          // Update the database with newDailyBest if they've changed
          // TODO make this work
          if (!!newDailyBest && isBetterSet(newDailyBest, dailyBest?.SetLog)) {
            if (dailyBest) {
              // Update
              await ctx.prisma.dailyPersonalBests.update({
                where: { id: dailyBest.id },
                data: { setLog_id: newDailyBest.id }
              });
            } else {
              // Create
              await ctx.prisma.dailyPersonalBests.create({
                data: {
                  user_id: user.id,
                  exercise_id: newDailyBest.exercise_id,
                  setLog_id: newDailyBest.id 
                }
              });
            }
          }
        }
      } catch (error) {
        console.log("Error processing request", error);
      }
  }),

  getUserExerciseAllTimeBests: protectedProcedure
    .query(async({ ctx }) => {
      const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
        where: {
          auth_uid: ctx.authUser?.id
        }
      })

      if (!user) {
        return
      }

      return await ctx.prisma.alltimePersonalBests.findMany({
        include: { 
          Exercise: true,
          SetLog: true
        },
        where: {
          user_id: user.id
        }
      })
  }),

  getUserExerciseDailyBests: protectedProcedure
    .query(async({ ctx }) => {
      const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
        where: {
          auth_uid: ctx.authUser?.id
        }
      })

      if (!user) {
        return
      }

      return await ctx.prisma.dailyPersonalBests.findMany({
        include: { 
          Exercise: true,
          SetLog: true
        },
        where: {
          user_id: user.id
        }
      })
  }),

  // THIS ONLY WORKS FOR LOGGING, THIS WONT BATCH UPDATE ALL PREVIOUS DAILY BESTS
  updateDailyAndPersonalBests: protectedProcedure
    .input(
      z.object({
        exercise_ids: z.array(z.string())
      }))
    .mutation(async({ ctx, input }) => {
      const { exercise_ids } = input
      const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
        where: {
          auth_uid: ctx.authUser?.id
        }
      })

      if (!user) {
        return
      }
     
      for (const exercise_id of exercise_ids) {
        const alltimeBest = await ctx.prisma.alltimePersonalBests.findFirst({
          where: {
            AppUser: {
              auth_uid: ctx.authUser.id
            },
            exercise_id: exercise_id
          },
          include: {
            SetLog: true
          }
        })
        // Get today
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const dailyBest = await ctx.prisma.dailyPersonalBests.findFirst({
          where: {
            AppUser: {
              auth_uid: ctx.authUser.id
            },
            exercise_id: exercise_id,
            created_at: {
              gte: startOfDay,
              lte: endOfDay
            }
          },
          include: {
            SetLog: true
          }
        })

        const sets = await ctx.prisma.setLog.findMany({
          where: {
            exercise_id: exercise_id
          }
        })

        let newDailyBest = dailyBest?.SetLog ?? null;
        let newAlltimeBest = alltimeBest?.SetLog ?? null;
      
        for (const set of sets) {
          if (!newAlltimeBest) {
            newAlltimeBest = set;
          } else if (isBetterSet(set, newAlltimeBest)) {
            newAlltimeBest = set;
          }
      
          if (!newDailyBest) {
            newDailyBest = set;
          } else if (isBetterSet(set, newDailyBest)) {
            newDailyBest = set;
          }
        }
      
        // Update the database with newDailyBest and newAlltimeBest if they've changed
        if (!!newAlltimeBest) {
          const existingRecord = await ctx.prisma.alltimePersonalBests.findFirst({
            where: {
              user_id: user.id,
              exercise_id: newAlltimeBest.exercise_id
            }
          });
          
          if (existingRecord) {
            // Update
            await ctx.prisma.alltimePersonalBests.update({
              where: { id: existingRecord.id },
              data: { setLog_id: newAlltimeBest.id }
            });
          } else {
            // Create
            await ctx.prisma.alltimePersonalBests.create({
              data: {
                user_id: user.id,
                exercise_id: newAlltimeBest.exercise_id,
                setLog_id: newAlltimeBest.id 
              }
            });
          }
        }

        if (!!newDailyBest) {
          const existingRecord = await ctx.prisma.dailyPersonalBests.findFirst({
            where: {
              user_id: user.id,
              exercise_id: newDailyBest.exercise_id,
              created_at: {
                gte: startOfDay,
                lte: endOfDay
              }
            }
          });
          
          if (existingRecord) {
            // Update
            await ctx.prisma.dailyPersonalBests.update({
              where: { id: existingRecord.id },
              data: { setLog_id: newDailyBest.id }
            });
          } else {
            // Create
            await ctx.prisma.dailyPersonalBests.create({
              data: {
                user_id: user.id,
                exercise_id: newDailyBest.exercise_id,
                setLog_id: newDailyBest.id 
              }
            });
          }
        }
      }
    }),

  getUserWorkoutHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.appUser.findFirst({
        where: {
          auth_uid: ctx.authUser?.id
        }
      });

      if (!user) {
        return null;
      }

      return await ctx.prisma.workoutLog.findMany({
        where: {
          user_id: user.id
        },
        include: {
          ExerciseLog: {
            include: {
              Exercise: true,
              SetLog: true
            }
          },
        },
        orderBy: {
          created_at: 'desc'
        }
      });
    }),

    getUserWorkouts: protectedProcedure
    .input(
      z.object({ 
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor, skip } = input
      const user = await ctx.prisma.appUser.findFirst({
        where: {
          auth_uid: ctx.authUser?.id
        }
      });

      if (!user) {
        return null;
      }

      const workouts = await ctx.prisma.workoutLog.findMany({
        where: {
          user_id: user.id
        },
        include: {
          ExerciseLog: {
            include: {
              Exercise: true,
              SetLog: true
            }
          },
        },
        orderBy: {
          created_at: 'desc'
        },
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined
      });

      let nextCursor : typeof cursor | undefined = undefined
      if (workouts.length > limit) {
        const nextWorkout = workouts.pop()
        nextCursor = nextWorkout?.id
      }

      return { 
        workouts: [...workouts] as WorkoutDisplayType[] | undefined | null, 
        cursor: nextCursor
      }
    }),
}) 
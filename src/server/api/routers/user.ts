/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { type SetLog, type AppUser } from "@prisma/client";
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
                weight: z.number().nullable().transform(val => val === null || isNaN(val) ? null : val),
                reps: z.number().nullable(),
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
        throw Error("No user")
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
       
        // Get personal bests
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 59)
        const dailyPersonalBests = await ctx.prisma.dailyPersonalBests.findMany({
          where: {
            AppUser: user,
          },
          include: {
            SetLog: true
          }
        })

        console.log("dailyPersonalBests:", dailyPersonalBests)

        const alltimeBests = await ctx.prisma.alltimePersonalBests.findMany({
          where: {
            AppUser: user,
          },
          include: {
            SetLog: true
          }
        })

        console.log("alltimeBests:", alltimeBests)

        for (const exer of input.workout) {
          const exerciseId = exer.exercise.id
          const exerType = exerciseTypes.find(
            type => type.id === exer.exercise.exercise_type_id
          )
          if (!exerType) throw Error("did not find exercise type")

          const exerciseLog = await ctx.prisma.exerciseLog.create({
            data: {
              user_id: user.id,     
              workoutLog_id: workoutLog.id,  
              exercise_id : exerciseId,
              notes: ""
            }
          })
          
          const dailyBest = dailyPersonalBests.find(best => best.exercise_id === exer.exercise.id && best.day === startOfDay)
          const exerAlltimeBest = alltimeBests.find(best => best.exercise_id === exer.exercise.id) 

          const setsToCreate: {
            exercise_id: string;
            exerciseLog_id: string;
            set_num: number;
            weight?: number | null;
            reps: number;
          }[] = []

          for (const set of exer.sets) {
            if (
              (exerType.name === "Normal weighted" && (set.weight && set.reps))
              || (exerType.name === "Weighted bodyweight" && set.reps)
            ) {
              setsToCreate.push({
                set_num: set.set_num,
                weight: set.weight,
                reps: set.reps, 
                exercise_id: exerciseId, 
                exerciseLog_id: exerciseLog.id
              })
            }
          }

          // adjust set numbers
          const newSets = setsToCreate.map((set, index) => {
            return {
              ...set,
              set_num: index + 1 
            }
          }) 

          let newDailyBestSet: SetLog | undefined = dailyBest?.SetLog
          let newAlltimeBestSet: SetLog | undefined = exerAlltimeBest?.SetLog

          // need to ensure set logs are added before starting next step
          await ctx.prisma.setLog.createMany({
            data: newSets
          }).then(async () => {
            const createdSets = await ctx.prisma.setLog.findMany({
              where: {
                exerciseLog_id: exerciseLog.id
              }
            })
  
            for (const set of createdSets) {
              if (!newAlltimeBestSet || isBetterSet(set, newAlltimeBestSet)) {
                newAlltimeBestSet = set
              }
              if (!newDailyBestSet || isBetterSet(set, newDailyBestSet)) {
                newDailyBestSet = set
              }
            }

            // Update the database with newAlltimeBest if they've changed
            if (!!newAlltimeBestSet) {
              await ctx.prisma.alltimePersonalBests.upsert({
                where: { 
                  user_exercise_id: {
                    user_id: user.id,
                    exercise_id: exerciseId
                  }
                },
                update: { setLog_id: newAlltimeBestSet.id },
                create: {
                  user_id: user.id,
                  exercise_id: newAlltimeBestSet.exercise_id,
                  setLog_id: newAlltimeBestSet.id
                }
              });
            } 
    
            // Update the database with newDailyBest if they've changed
            if (!!newDailyBestSet) {
              await ctx.prisma.dailyPersonalBests.upsert({
                where: {
                  user_exercise_day_id: {
                    user_id: user.id,
                    exercise_id: exerciseId, 
                    day: startOfDay  
                  }
                },
                update: { setLog_id: newDailyBestSet.id },
                create: {
                  user_id: user.id,
                  exercise_id: newDailyBestSet.exercise_id,
                  setLog_id: newDailyBestSet.id
                }
              });
            } 
          })
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
  // updateDailyAndPersonalBests: protectedProcedure
  //   .input(
  //     z.object({
  //       exercise_ids: z.array(z.string())
  //     }))
  //   .mutation(async({ ctx, input }) => {
  //     const { exercise_ids } = input
  //     const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
  //       where: {
  //         auth_uid: ctx.authUser?.id
  //       }
  //     })

  //     if (!user) {
  //       return
  //     }
     
  //     for (const exercise_id of exercise_ids) {
  //       const alltimeBest = await ctx.prisma.alltimePersonalBests.findFirst({
  //         where: {
  //           AppUser: {
  //             auth_uid: ctx.authUser.id
  //           },
  //           exercise_id: exercise_id
  //         },
  //         include: {
  //           SetLog: true
  //         }
  //       })
  //       // Get today
  //       const today = new Date()
  //       const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  //       const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  //       const dailyBest = await ctx.prisma.dailyPersonalBests.findFirst({
  //         where: {
  //           AppUser: {
  //             auth_uid: ctx.authUser.id
  //           },
  //           exercise_id: exercise_id,
  //           created_at: {
  //             gte: startOfDay,
  //             lte: endOfDay
  //           }
  //         },
  //         include: {
  //           SetLog: true
  //         }
  //       })

  //       const sets = await ctx.prisma.setLog.findMany({
  //         where: {
  //           exercise_id: exercise_id
  //         }
  //       })

  //       let newDailyBest = dailyBest?.SetLog ?? null;
  //       let newAlltimeBest = alltimeBest?.SetLog ?? null;
      
  //       for (const set of sets) {
  //         if (!newAlltimeBest) {
  //           newAlltimeBest = set;
  //         } else if (isBetterSet(set, newAlltimeBest)) {
  //           newAlltimeBest = set;
  //         }
      
  //         if (!newDailyBest) {
  //           newDailyBest = set;
  //         } else if (isBetterSet(set, newDailyBest)) {
  //           newDailyBest = set;
  //         }
  //       }
      
  //       // Update the database with newDailyBest and newAlltimeBest if they've changed
  //       if (!!newAlltimeBest) {
  //         const existingRecord = await ctx.prisma.alltimePersonalBests.findFirst({
  //           where: {
  //             user_id: user.id,
  //             exercise_id: newAlltimeBest.exercise_id
  //           }
  //         });
          
  //         if (existingRecord) {
  //           // Update
  //           await ctx.prisma.alltimePersonalBests.update({
  //             where: { id: existingRecord.id },
  //             data: { setLog_id: newAlltimeBest.id }
  //           });
  //         } else {
  //           // Create
  //           await ctx.prisma.alltimePersonalBests.create({
  //             data: {
  //               user_id: user.id,
  //               exercise_id: newAlltimeBest.exercise_id,
  //               setLog_id: newAlltimeBest.id 
  //             }
  //           });
  //         }
  //       }

  //       if (!!newDailyBest) {
  //         const existingRecord = await ctx.prisma.dailyPersonalBests.findFirst({
  //           where: {
  //             user_id: user.id,
  //             exercise_id: newDailyBest.exercise_id,
  //             created_at: {
  //               gte: startOfDay,
  //               lte: endOfDay
  //             }
  //           }
  //         });
          
  //         if (existingRecord) {
  //           // Update
  //           await ctx.prisma.dailyPersonalBests.update({
  //             where: { id: existingRecord.id },
  //             data: { setLog_id: newDailyBest.id }
  //           });
  //         } else {
  //           // Create
  //           await ctx.prisma.dailyPersonalBests.create({
  //             data: {
  //               user_id: user.id,
  //               exercise_id: newDailyBest.exercise_id,
  //               setLog_id: newDailyBest.id 
  //             }
  //           });
  //         }
  //       }
  //     }
  //   }),

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
import { type AppUser } from "@prisma/client";
import { z } from "zod";
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
          const sets = definedSets.map((set, index) => {
            return {
              ...set,
              set_num: index + 1 
            }
          }) 

          await ctx.prisma.setLog.createMany({
            data: sets
          })
        }
      } catch (error) {
        console.log("Error processing request", error);
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
    })
});

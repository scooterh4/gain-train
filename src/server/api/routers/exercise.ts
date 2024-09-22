import { type AppUser } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const exerciseRouter = createTRPCRouter({
  createExercise: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
        where: {
          auth_uid: ctx.authUser?.id
        }
      })

      await ctx.prisma.exercises.create({
        data: {
          exercise_name: input.name,
          AppUser: {
            connect: user
          }
        },
      });
      
      return
  }),

  getUserExercises: protectedProcedure
    .query(async ({ ctx }) => {
      const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
        where: {
          auth_uid: ctx.authUser?.id
        }
      })

      return await ctx.prisma.exercises.findMany({
        where: {
          user_id: user.id
        }
      })
    }),

  getPreviousSetsForExercise: protectedProcedure
    .input(z.object({ exerciseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
        where: {
          auth_uid: ctx.authUser?.id
        }
      })

      const prevExercise = await ctx.prisma.exerciseLog.findFirst({
        where: {
          AND: [
            { AppUser: user },
            { exercise_id: input.exerciseId }
          ]
        },
        orderBy: {
          created_at: "desc"
        }
      })

      if (!prevExercise) {
        console.log("No previous exercise")
        return
      }

      return await ctx.prisma.setLog.findMany({
        where: {
          exerciseLog_id: prevExercise.id
        },
        orderBy: {
          set_num: "asc"
        }
      })
    })
})
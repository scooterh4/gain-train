import { type AppUser } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

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
    })
})
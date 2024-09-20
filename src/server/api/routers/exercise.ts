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

      const newExercise = await ctx.prisma.exercises.create({
        data: {
          exercise_name: input.name,
          AppUser: {
            connect: user
          }
        },
      });
      
      return newExercise
  }),
})
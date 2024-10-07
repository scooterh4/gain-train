import { type AppUser } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const workoutRouter = createTRPCRouter({
  // logWorkout: protectedProcedure
  //   .input(z.object({ exercises }))
  //   .mutation(async ({ ctx, input }) => {
  //     const user: AppUser = await ctx.prisma.appUser.findFirstOrThrow({
  //       where: {
  //         auth_uid: ctx.authUser?.id
  //       }
  //     })

  //     await ctx.prisma.exercises.create({
  //       data: {
  //         exercise_name: input.name,
  //         AppUser: {
  //           connect: user
  //         }
  //       },
  //     });
      
  //     return
  // }),
})
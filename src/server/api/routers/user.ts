import { type AppUser } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1), email: z.string().email() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const user: User = await ctx.prisma.user.create({
  //       data: {
  //         name: input.name,
  //         email: input.email,
  //       },
  //     });
      
  //     return user
  //   }),

  getLatest: publicProcedure.query<AppUser[] | null>(async ({ ctx }) => {
    const users: AppUser[] = await ctx.prisma.appUser.findMany({
      orderBy: { created_at: "desc" },
    });

    return users ?? null;
  }),
});

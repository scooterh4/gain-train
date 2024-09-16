import { type User } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user: User = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });
      
      return user
    }),

  getLatest: publicProcedure.query<User[] | null>(async ({ ctx }) => {
    const users: User[] = await ctx.prisma.user.findMany({
      orderBy: { created_at: "desc" },
    });

    return users ?? null;
  }),
});

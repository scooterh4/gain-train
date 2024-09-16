import { Prisma, PrismaClient } from "@prisma/client";

const prisma =
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// const globalForPrisma = globalThis as unknown as {
//   prisma: ReturnType<typeof createPrismaClient> | undefined;
// };

export { prisma, Prisma };
// export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// APPA CODE

// import { Prisma, PrismaClient } from "@prisma/client";

// // const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// const prisma = new PrismaClient({
//   log:
//     process.env.NODE_ENV === "development"
//       ? ["query", "error", "warn"]
//       : ["error"],
// });
// prisma.$extends({
//   result: {
//     teen: {
//       recent_status: {
//         async compute(teen) {
//           return await prisma.curriculumStatus.findFirst({
//             where: {
//               teen_id: teen.id,
//             },
//             orderBy: {
//               created_at: "desc",
//             },
//           });
//         },
//       },
//     },
//   },
// });

// export { prisma, Prisma };

// // if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// // export * from "@prisma/client";

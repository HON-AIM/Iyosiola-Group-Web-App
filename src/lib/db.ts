import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

// Only reuse Prisma instance in development to prevent memory leaks
if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma;
}

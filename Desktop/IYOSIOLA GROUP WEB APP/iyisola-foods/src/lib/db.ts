import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Only reuse Prisma instance in development to prevent memory leaks
if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof window === "undefined") {
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, disconnecting Prisma...");
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT received, disconnecting Prisma...");
  });
}

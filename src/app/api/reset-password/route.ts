import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { type NextRequest } from "next/server";

const ResetPasswordSchema = z
  .object({
    token: z.string().min(64).max(64),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const resetAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_RESET_ATTEMPTS = 5;
const RESET_ATTEMPT_WINDOW = 15 * 60 * 1000;
const TOKEN_EXPIRY = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST") {
      return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Bad Request: Invalid request body" }, { status: 400 });
    }

    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    const now = Date.now();
    const attemptData = resetAttempts.get(clientIp);

    if (attemptData) {
      if (now < attemptData.resetAt) {
        if (attemptData.count >= MAX_RESET_ATTEMPTS) {
          console.warn("[WARN] Too many password reset attempts:", { ip: clientIp, attempts: attemptData.count, timestamp: new Date().toISOString() });
          return NextResponse.json({ message: "Too many reset attempts. Please try again later." }, { status: 429 });
        }
        attemptData.count++;
      } else {
        resetAttempts.set(clientIp, { count: 1, resetAt: now + RESET_ATTEMPT_WINDOW });
      }
    } else {
      resetAttempts.set(clientIp, { count: 1, resetAt: now + RESET_ATTEMPT_WINDOW });
    }

    const startTime = Date.now();

    const parseResult = ResetPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const { token, email, password } = parseResult.data;

    while (Date.now() - startTime < 300) {}

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    let resetResult;
    try {
      resetResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
          where: {
            email,
            resetToken: tokenHash,
            resetTokenExpiry: { gt: new Date() },
            isActive: true,
          },
          select: { id: true, email: true, name: true },
        });

        if (!user) {
          throw new Error("INVALID_TOKEN");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
          select: { id: true, email: true },
        });

        try {
          await tx.session.deleteMany({ where: { userId: user.id } });
        } catch (sessionError) {
          console.warn("[WARN] Failed to invalidate sessions:", { userId: user.id, error: sessionError instanceof Error ? sessionError.message : String(sessionError) });
        }

        return updatedUser;
      }, { timeout: 10000 });
    } catch (txError) {
      if (txError instanceof Error && txError.message === "INVALID_TOKEN") {
        console.warn("[WARN] Invalid password reset attempt:", { email, ip: clientIp, timestamp: new Date().toISOString() });
        return NextResponse.json({ message: "Invalid or expired reset link. Please request a new password reset." }, { status: 400 });
      }
      throw txError;
    }

    console.info("[AUDIT] Password reset completed:", { userId: resetResult.id, email, ip: clientIp, timestamp: new Date().toISOString() });

    const response = NextResponse.json(
      { message: "Password reset successfully. Please log in with your new password." },
      { status: 200 }
    );
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("X-Content-Type-Options", "nosniff");

    return response;
  } catch (error) {
    console.error("[ERROR] Password reset failed:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: "An error occurred while resetting the password. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

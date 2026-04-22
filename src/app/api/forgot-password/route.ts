import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { z } from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
});

const resetAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_RESET_ATTEMPTS = 5;
const RESET_WINDOW = 15 * 60 * 1000;
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

    const parseResult = ForgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const { email } = parseResult.data;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    const now = Date.now();
    const attemptData = resetAttempts.get(clientIp);

    if (attemptData) {
      if (now < attemptData.resetAt) {
        if (attemptData.count >= MAX_RESET_ATTEMPTS) {
          console.warn("[WARN] Too many password reset attempts:", { email, ip: clientIp, attempts: attemptData.count, timestamp: new Date().toISOString() });
          return NextResponse.json({ message: "Too many reset attempts. Please try again later." }, { status: 429 });
        }
        attemptData.count++;
      } else {
        resetAttempts.set(clientIp, { count: 1, resetAt: now + RESET_WINDOW });
      }
    } else {
      resetAttempts.set(clientIp, { count: 1, resetAt: now + RESET_WINDOW });
    }

    const startTime = Date.now();
    while (Date.now() - startTime < 300) {}

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, isActive: true },
    });

    if (!user || !user.isActive) {
      console.info("[LOG] Password reset requested for non-existent/inactive user:", { email, ip: clientIp, timestamp: new Date().toISOString() });
      return NextResponse.json(
        { message: "If that email is registered with us, a password reset link has been sent." },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(64).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiry = new Date(Date.now() + TOKEN_EXPIRY);

    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { resetToken: resetTokenHash, resetTokenExpiry },
        });

        try {
          await tx.passwordResetLog.create({
            data: {
              userId: user.id,
              email,
              ipAddress: clientIp,
              userAgent: request.headers.get("user-agent") || "unknown",
            },
          });
        } catch (auditError) {
          console.warn("[WARN] Failed to log password reset request:", { userId: user.id, error: auditError instanceof Error ? auditError.message : String(auditError) });
        }
      }, { timeout: 10000 });

      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      await sendPasswordResetEmail(user.email!, user.name || "User", resetUrl);

      console.info("[AUDIT] Password reset email sent:", { userId: user.id, email, ip: clientIp, timestamp: new Date().toISOString() });
    } catch (emailError) {
      console.error("[ERROR] Failed to send password reset email:", { userId: user.id, email, error: emailError instanceof Error ? emailError.message : String(emailError) });
    }

    return NextResponse.json(
      { message: "If that email is registered with us, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ERROR] Forgot password request failed:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "An error occurred. Please try again later or contact support." },
      { status: 500 }
    );
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

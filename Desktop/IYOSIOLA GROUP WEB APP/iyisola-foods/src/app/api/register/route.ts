import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";
import { z } from "zod";
import { type NextRequest } from "next/server";

const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const registrationAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_REGISTRATIONS_PER_IP = 5;
const REGISTRATION_WINDOW = 60 * 60 * 1000;

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
    const attemptData = registrationAttempts.get(clientIp);

    if (attemptData) {
      if (now < attemptData.resetAt) {
        if (attemptData.count >= MAX_REGISTRATIONS_PER_IP) {
          console.warn("[WARN] Too many registration attempts from IP:", { ip: clientIp, timestamp: new Date().toISOString() });
          return NextResponse.json({ message: "Too many registration attempts. Please try again later." }, { status: 429 });
        }
        attemptData.count++;
      } else {
        registrationAttempts.set(clientIp, { count: 1, resetAt: now + REGISTRATION_WINDOW });
      }
    } else {
      registrationAttempts.set(clientIp, { count: 1, resetAt: now + REGISTRATION_WINDOW });
    }

    const parseResult = RegisterSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const { name, email, password } = parseResult.data;

    const startTime = Date.now();
    while (Date.now() - startTime < 300) {}

    let newUser;
    try {
      newUser = await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { email },
          select: { id: true },
        });

        if (existingUser) {
          throw new Error("EMAIL_EXISTS");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        return await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: "USER",
            isActive: true,
          },
          select: { id: true, email: true, name: true },
        });
      }, { timeout: 10000 });
    } catch (txError) {
      if (txError instanceof Error && txError.message === "EMAIL_EXISTS") {
        console.warn("[WARN] Registration attempt with existing email:", { email, ip: clientIp, timestamp: new Date().toISOString() });
        return NextResponse.json(
          { message: "Account created successfully. Please check your email to verify your account.", userId: "hidden" },
          { status: 201 }
        );
      }
      throw txError;
    }

    const token = crypto.randomBytes(64).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: tokenHash,
          expires: tokenExpiry,
        },
      });
    } catch (tokenError) {
      console.error("[ERROR] Failed to create verification token:", { userId: newUser.id, error: tokenError instanceof Error ? tokenError.message : String(tokenError) });
    }

    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify?token=${token}&email=${encodeURIComponent(email)}`;
      await sendVerificationEmail(email, name, verificationUrl);
      console.info("[AUDIT] Registration email sent:", { userId: newUser.id, email, ip: clientIp, timestamp: new Date().toISOString() });
    } catch (emailError) {
      console.error("[ERROR] Failed to send verification email:", { userId: newUser.id, email, error: emailError instanceof Error ? emailError.message : String(emailError) });
    }

    const response = NextResponse.json(
      { message: "Account created successfully. Please check your email to verify your account.", userId: newUser.id },
      { status: 201 }
    );
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

    return response;
  } catch (error) {
    console.error("[ERROR] Registration failed:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ message: "An error occurred during registration. Please try again later." }, { status: 500 });
  }
}

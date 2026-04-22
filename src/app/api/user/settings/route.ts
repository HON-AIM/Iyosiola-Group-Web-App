import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { type NextRequest } from "next/server";

const SettingsSchema = z.object({
  name: z.string().min(2).max(100).trim().regex(/^[a-zA-Z\s'-]+$/).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).optional(),
}).refine(
  (data) => (data.currentPassword && data.newPassword) || (!data.currentPassword && !data.newPassword),
  { message: "Both current and new password are required to change password", path: ["currentPassword"] }
);

const userRateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

export async function PUT(req: NextRequest) {
  const startTime = Date.now();

  try {
    if (req.method !== "PUT") {
      return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ message: "Bad Request: Content-Type must be application/json" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized: Please login" }, { status: 401 });
    }

    const now = Date.now();
    const userLimit = userRateLimits.get(session.user.id);

    if (userLimit) {
      if (now < userLimit.resetAt) {
        if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });
        }
        userLimit.count++;
      } else {
        userRateLimits.set(session.user.id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      }
    } else {
      userRateLimits.set(session.user.id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Bad Request: Invalid request body" }, { status: 400 });
    }

    const parseResult = SettingsSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((e) => ({ field: e.path.join("."), message: e.message }));
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const { name, currentPassword, newPassword } = parseResult.data;

    if (!name && !newPassword) {
      return NextResponse.json({ message: "No changes provided" }, { status: 400 });
    }

    const validationStartTime = Date.now();
    let hashedPassword: string | undefined;

    if (newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, password: true, email: true },
      });

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      if (!user.password) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return NextResponse.json({ message: "Your account uses a third-party authentication method." }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword || "", user.password);

      const validationTime = Date.now() - validationStartTime;
      if (validationTime < 300) {
        await new Promise((resolve) => setTimeout(resolve, 300 - validationTime));
      }

      if (!isPasswordValid) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });
      }

      const isDifferent = !(await bcrypt.compare(newPassword, user.password));
      if (!isDifferent) {
        return NextResponse.json({ message: "New password must be different from current password" }, { status: 400 });
      }

      hashedPassword = await bcrypt.hash(newPassword, 12);
    }

    let updatedUser;
    try {
      updatedUser = await prisma.$transaction(async (tx) => {
        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (hashedPassword) updateData.password = hashedPassword;

        return await tx.user.update({
          where: { id: session.user.id },
          data: updateData,
          select: { id: true, name: true, email: true, emailVerified: true, role: true },
        });
      }, { timeout: 10000 });
    } catch (txError) {
      console.error("[ERROR] Failed to update settings:", { error: txError instanceof Error ? txError.message : String(txError) });
      return NextResponse.json({ message: "Error updating settings" }, { status: 500 });
    }

    console.info("[AUDIT] User settings updated:", { userId: session.user.id, nameChanged: !!name, passwordChanged: !!newPassword, duration: Date.now() - startTime });

    const response = NextResponse.json(
      { message: "Settings updated successfully", user: { name: updatedUser.name, email: updatedUser.email, id: updatedUser.id } },
      { status: 200 }
    );
    response.headers.set("Cache-Control", "private, no-cache, must-revalidate");

    return response;
  } catch (error) {
    console.error("[ERROR] PUT settings failed:", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ message: "Error updating settings" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

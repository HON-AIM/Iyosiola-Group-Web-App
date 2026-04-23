import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";
import { z } from "zod";
import crypto from "crypto";

// ✅ Validation schema
const VerifyEmailSchema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    // ✅ Parse request
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    // ✅ Validate input
    const validation = VerifyEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid verification data" },
        { status: 400 }
      );
    }

    const { token, email } = validation.data;

    // ✅ Hash token to match database
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // ✅ Find user and verify
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        verificationToken: true,
        verificationTokenExpires: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // ✅ Verify token hash matches
    if (user.verificationToken !== tokenHash) {
      return NextResponse.json(
        { message: "Invalid verification link" },
        { status: 400 }
      );
    }

    // ✅ Verify token hasn't expired
    if (
      !user.verificationTokenExpires ||
      new Date() > user.verificationTokenExpires
    ) {
      return NextResponse.json(
        { message: "Verification link has expired" },
        { status: 400 }
      );
    }

    // ✅ Update user - mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    console.info("[AUDIT] Email verified:", {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Email verified successfully! You can now sign in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ERROR] Email verification failed:", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { message: "An error occurred during verification. Please try again later." },
      { status: 500 }
    );
  }
}
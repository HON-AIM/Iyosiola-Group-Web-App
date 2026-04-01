import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ERROR] Auth check failed:", error);
    return NextResponse.json(
      { message: "Failed to check authentication" },
      { status: 500 }
    );
  }
}
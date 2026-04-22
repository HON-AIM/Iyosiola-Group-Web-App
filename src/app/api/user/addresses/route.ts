import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { type NextRequest } from "next/server";
import { z } from "zod";

const AddressSchema = z.object({
  street: z.string().min(5).trim(),
  city: z.string().min(2).trim(),
  state: z.string().min(2).trim(),
  postalCode: z.string().optional(),
  country: z.string().default("Nigeria"),
  isDefault: z.boolean().default(false),
});

// ✅ GET addresses
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    console.error("[ERROR] Fetch addresses failed:", error);
    return NextResponse.json(
      { message: "Error fetching addresses" },
      { status: 500 }
    );
  }
}

// ✅ POST address
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const validation = AddressSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // ✅ If setting as default, unset others
    if (validation.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("[ERROR] Create address failed:", error);
    return NextResponse.json(
      { message: "Error creating address" },
      { status: 500 }
    );
  }
}

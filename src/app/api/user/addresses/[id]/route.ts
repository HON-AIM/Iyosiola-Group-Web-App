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

// ✅ PATCH address
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // ✅ Verify ownership
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    const validation = AddressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation failed" },
        { status: 400 }
      );
    }

    // ✅ If setting as default, unset others
    if (validation.data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[ERROR] Update address failed:", error);
    return NextResponse.json(
      { message: "Error updating address" },
      { status: 500 }
    );
  }
}

// ✅ DELETE address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // ✅ Verify ownership
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    // ✅ Don't allow deleting if it's the only address
    const count = await prisma.address.count({
      where: { userId: session.user.id },
    });

    if (count === 1) {
      return NextResponse.json(
        { message: "Cannot delete your only address" },
        { status: 400 }
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Address deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ERROR] Delete address failed:", error);
    return NextResponse.json(
      { message: "Error deleting address" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { type NextRequest } from "next/server";

/**
 * GET /api/admin/messages/[id]
 * Fetch a specific message by ID
 *
 * @requires Admin role
 * @param id - Message ID
 * @returns { message } - Message details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // ✅ Validate ID parameter
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json(
      { message: "Bad Request: Invalid message ID" },
      { status: 400 }
    );
  }

  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please login" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // ✅ Fetch message with user info
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Not Found: Message does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("[ERROR] Fetch message failed:", {
      action: "GET",
      messageId: id,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        message:
          "Internal Server Error: Failed to fetch message. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/messages/[id]
 * Delete a message by ID
 *
 * @requires Admin role
 * @param id - Message ID to delete
 * @returns { message, messageId } - Success message and deleted message ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // ✅ Validate ID parameter
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json(
      { message: "Bad Request: Invalid message ID" },
      { status: 400 }
    );
  }

  try {
    const session = await auth();

    // ✅ Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please login" },
        { status: 401 }
      );
    }

    // ✅ Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // ✅ Verify message exists before attempting deletion
    const messageExists = await prisma.message.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!messageExists) {
      return NextResponse.json(
        { message: "Not Found: Message does not exist" },
        { status: 404 }
      );
    }

    // ✅ Delete the message
    await prisma.message.delete({
      where: { id },
    });

    // ✅ Log admin action for audit trail
    console.info("[AUDIT] Message deleted:", {
      adminId: session.user.id,
      adminEmail: session.user.email,
      messageId: id,
      messageSender: messageExists.user?.email,
      messageSubject: messageExists.subject,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: `Message from "${messageExists.user?.name || messageExists.user?.email}" deleted successfully`,
        messageId: id,
      },
      { status: 200 }
    );
  } catch (error) {
    // ✅ Differentiate error types
    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        console.warn("[WARN] Attempted to delete non-existent message:", {
          messageId: id,
          error: error.message,
        });
        return NextResponse.json(
          { message: "Not Found: Message does not exist" },
          { status: 404 }
        );
      }
    }

    console.error("[ERROR] Delete message failed:", {
      action: "DELETE",
      messageId: id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        message:
          "Internal Server Error: Failed to delete message. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/messages/[id]
 * Update message status (e.g., mark as read, responded)
 *
 * @requires Admin role
 * @param id - Message ID
 * @body status - New status (read, responded, closed)
 * @returns { message } - Updated message
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json(
      { message: "Bad Request: Invalid message ID" },
      { status: 400 }
    );
  }

  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized: Please login" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // ✅ Update message (mark as read)
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        isRead: true,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    console.info("[AUDIT] Message marked as read:", {
      adminId: session.user.id,
      messageId: id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: updatedMessage }, { status: 200 });
  } catch (error) {
    console.error("[ERROR] Update message status failed:", {
      action: "PATCH",
      messageId: id,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        message:
          "Internal Server Error: Failed to update message. Please try again.",
      },
      { status: 500 }
    );
  }
}

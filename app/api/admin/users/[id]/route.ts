import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            mockInterviews: true,
            submissions: true,
            userProgress: true,
            examResults: true,
            examSessions: true,
            feedback: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if user has related data
    const hasRelatedData = Object.values(user._count).some(
      (count) => count > 0
    );

    if (hasRelatedData) {
      const relatedData = Object.entries(user._count)
        .filter(([_, count]) => count > 0)
        .map(([key, count]) => `${key}: ${count}`)
        .join(", ");

      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete user with related data: ${relatedData}`,
        },
        { status: 400 }
      );
    }

    // Perform soft delete
    const result = await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: "admin",
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete user",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === "restore") {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 404 }
        );
      }

      if (!user.isDeleted) {
        return NextResponse.json(
          {
            success: false,
            error: "User is not deleted",
          },
          { status: 400 }
        );
      }

      const result = await prisma.user.update({
        where: { id },
        data: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          isActive: true, // Reactivate the user
        },
      });

      return NextResponse.json({
        success: true,
        message: "User restored successfully",
        data: result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error restoring user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to restore user",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === "permanent-delete") {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 404 }
        );
      }

      if (!user.isDeleted) {
        return NextResponse.json(
          {
            success: false,
            error: "Only soft-deleted users can be permanently deleted",
          },
          { status: 400 }
        );
      }

      // This will cascade delete all related records
      const result = await prisma.user.delete({ where: { id } });

      return NextResponse.json({
        success: true,
        message: "User permanently deleted successfully",
        data: result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error permanently deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to permanently delete user",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await prisma.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update user",
      },
      { status: 500 }
    );
  }
}

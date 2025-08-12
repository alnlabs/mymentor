import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, adminNotes, resolvedAt } = body;

    const feedback = await prisma.feedback.update({
      where: { id: params.id },
      data: {
        status,
        adminNotes,
        resolvedAt: resolvedAt ? new Date(resolvedAt) : null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully",
      data: feedback,
    });
  } catch (error: any) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update feedback. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.feedback.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete feedback. Please try again.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (
      !status ||
      !["scheduled", "in-progress", "paused", "completed"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, error: "Valid status is required" },
        { status: 400 }
      );
    }

    const session = await prisma.mockInterview.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error("Error updating session status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update session status" },
      { status: 500 }
    );
  }
}

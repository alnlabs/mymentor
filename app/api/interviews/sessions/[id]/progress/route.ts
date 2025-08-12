import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { currentQuestion, answers } = body;

    const session = await prisma.interviewSession.update({
      where: { id: params.id },
      data: {
        currentQuestion: currentQuestion || 0,
        answers: answers || {},
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

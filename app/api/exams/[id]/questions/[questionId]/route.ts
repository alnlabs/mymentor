import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; questionId: string } }
) {
  try {
    const body = await request.json();
    const { timeLimit } = body;

    // Validate time limit
    if (timeLimit !== null && (timeLimit < 30 || timeLimit > 600)) {
      return NextResponse.json(
        { success: false, error: "Time limit must be between 30 and 600 seconds" },
        { status: 400 }
      );
    }

    // Update the exam question
    const examQuestion = await prisma.examQuestion.update({
      where: { id: params.questionId },
      data: { timeLimit },
    });

    return NextResponse.json({
      success: true,
      data: examQuestion,
      message: "Question timer updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating question timer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update question timer" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find all exam questions to be deleted
    const examQuestions = await prisma.examQuestion.findMany({
      where: { examId: id },
    });

    if (examQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "No questions found to delete" },
        { status: 404 }
      );
    }

    const questionIds = examQuestions.map(q => q.id);

    // Delete related exam question results first
    await prisma.examQuestionResult.deleteMany({
      where: {
        questionId: { in: questionIds },
      },
    });

    // Then delete all exam questions
    await prisma.examQuestion.deleteMany({
      where: { examId: id },
    });

    // Update exam total questions count to 0
    await prisma.exam.update({
      where: { id },
      data: { totalQuestions: 0 },
    });

    return NextResponse.json({
      success: true,
      message: `All ${examQuestions.length} questions removed from exam successfully`,
      deletedCount: examQuestions.length,
    });
  } catch (error: any) {
    console.error("Error removing all questions from exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove all questions from exam" },
      { status: 500 }
    );
  }
}

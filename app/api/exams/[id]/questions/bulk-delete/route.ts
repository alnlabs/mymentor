import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { questionIds } = body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid questionIds array" },
        { status: 400 }
      );
    }

    // Find all exam questions to be deleted
    const examQuestions = await prisma.examQuestion.findMany({
      where: {
        examId: id,
        id: { in: questionIds },
      },
    });

    if (examQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "No questions found to delete" },
        { status: 404 }
      );
    }

    // Delete related exam question results first
    await prisma.examQuestionResult.deleteMany({
      where: {
        questionId: { in: questionIds },
      },
    });

    // Then delete the exam questions
    await prisma.examQuestion.deleteMany({
      where: {
        examId: id,
        id: { in: questionIds },
      },
    });

    // Update exam total questions count
    const questionCount = await prisma.examQuestion.count({
      where: { examId: id },
    });

    await prisma.exam.update({
      where: { id },
      data: { totalQuestions: questionCount },
    });

    return NextResponse.json({
      success: true,
      message: `${examQuestions.length} questions removed from exam successfully`,
      deletedCount: examQuestions.length,
    });
  } catch (error: any) {
    console.error("Error bulk removing questions from exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove questions from exam" },
      { status: 500 }
    );
  }
}

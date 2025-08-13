import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examQuestions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            examQuestions: true,
            examResults: true,
          },
        },
      },
    });

    // Fetch the actual question data for each exam question
    const examQuestionsWithData = await Promise.all(
      exam.examQuestions.map(async (examQuestion) => {
        if (examQuestion.questionType === "MCQ") {
          // Fetch MCQ question data
          const mcqQuestion = await prisma.mCQQuestion.findUnique({
            where: { id: examQuestion.questionId },
          });

          if (mcqQuestion) {
            return {
              ...examQuestion,
              question: mcqQuestion.question,
              options: JSON.parse(mcqQuestion.options),
              correctAnswer: mcqQuestion.correctAnswer,
              explanation: mcqQuestion.explanation,
              type: "mcq",
            };
          }
        } else if (examQuestion.questionType === "Problem") {
          // Fetch Problem data
          const problem = await prisma.problem.findUnique({
            where: { id: examQuestion.questionId },
          });

          if (problem) {
            return {
              ...examQuestion,
              question: problem.description,
              testCases: problem.testCases,
              solution: problem.solution,
              type: "coding",
            };
          }
        } else if (examQuestion.questionType === "CODING") {
          // Handle legacy CODING type
          const problem = await prisma.problem.findUnique({
            where: { id: examQuestion.questionId },
          });

          if (problem) {
            return {
              ...examQuestion,
              question: problem.description,
              testCases: problem.testCases,
              solution: problem.solution,
              type: "coding",
            };
          }
        }

        // Return exam question as is if no matching question found
        return {
          ...examQuestion,
          question: "Question not found",
          type: "unknown",
        };
      })
    );

    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...exam,
      examQuestions: examQuestionsWithData,
      totalQuestions: exam._count.examQuestions,
      totalAttempts: exam._count.examResults,
    });
  } catch (error: any) {
    console.error("Error fetching exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam" },
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
    const {
      title,
      description,
      duration,
      difficulty,
      category,
      targetRole,
      questionTypes,
      totalQuestions,
      passingScore,
      enableTimedQuestions,
      enableOverallTimer,
      defaultQuestionTime,
      isActive,
      isPublic,
    } = body;

    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!existingExam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    // Check if title is being changed and if it conflicts
    if (title && title !== existingExam.title) {
      const titleConflict = await prisma.exam.findUnique({
        where: { title },
      });

      if (titleConflict) {
        return NextResponse.json(
          { success: false, error: "Exam with this title already exists" },
          { status: 400 }
        );
      }
    }

    // Update exam
    const exam = await prisma.exam.update({
      where: { id },
      data: {
        title,
        description,
        duration: duration ? parseInt(duration) : undefined,
        difficulty,
        category,
        targetRole,
        questionTypes,
        totalQuestions: totalQuestions ? parseInt(totalQuestions) : undefined,
        passingScore: passingScore ? parseInt(passingScore) : undefined,
        enableTimedQuestions,
        enableOverallTimer,
        defaultQuestionTime: defaultQuestionTime
          ? parseInt(defaultQuestionTime)
          : undefined,
        isActive,
        isPublic,
      },
    });

    return NextResponse.json({
      success: true,
      data: exam,
      message: "Exam updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update exam" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!existingExam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    // Delete exam questions first
    await prisma.examQuestion.deleteMany({
      where: { examId: id },
    });

    // Delete exam results
    await prisma.examResult.deleteMany({
      where: { examId: id },
    });

    // Delete exam
    await prisma.exam.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete exam" },
      { status: 500 }
    );
  }
}

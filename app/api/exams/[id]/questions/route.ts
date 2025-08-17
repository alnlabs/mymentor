import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const questionType = searchParams.get("questionType") || "";

    // Build where clause
    const where: any = { examId: id };
    if (questionType) {
      where.questionType = questionType;
    }

    const examQuestions = await prisma.examQuestion.findMany({
      where,
      orderBy: { order: "asc" },
    });

    // Get the actual question data for each exam question
    const questionsWithData = await Promise.all(
      examQuestions.map(async (eq) => {
        if (eq.questionType === "MCQ") {
          const mcq = await prisma.mCQQuestion.findUnique({
            where: { id: eq.questionId },
          });
          return {
            ...eq,
            questionData: mcq,
          };
        } else {
          const problem = await prisma.problem.findUnique({
            where: { id: eq.questionId },
          });
          return {
            ...eq,
            questionData: problem,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: questionsWithData,
    });
  } catch (error: any) {
    console.error("Error fetching exam questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam questions" },
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
    const { questionId, questionType, order, points, timeLimit } = body;

    // Validate required fields
    if (!questionId || !questionType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    // Check if question exists
    if (questionType === "MCQ") {
      const mcq = await prisma.mCQQuestion.findUnique({
        where: { id: questionId },
      });
      if (!mcq) {
        return NextResponse.json(
          { success: false, error: "MCQ question not found" },
          { status: 404 }
        );
      }
    } else {
      const problem = await prisma.problem.findUnique({
        where: { id: questionId },
      });
      if (!problem) {
        return NextResponse.json(
          { success: false, error: "Problem not found" },
          { status: 404 }
        );
      }
    }

    // Check if question is already in exam
    const existingQuestion = await prisma.examQuestion.findFirst({
      where: {
        examId: id,
        questionId,
        questionType,
      },
    });

    if (existingQuestion) {
      return NextResponse.json(
        { success: false, error: "Question is already in this exam" },
        { status: 400 }
      );
    }

    // Get the next order if not provided
    let questionOrder = order;
    if (!questionOrder) {
      const lastQuestion = await prisma.examQuestion.findFirst({
        where: { examId: id },
        orderBy: { order: "desc" },
      });
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    // Add question to exam
    const examQuestion = await prisma.examQuestion.create({
      data: {
        examId: id,
        questionId,
        questionType,
        order: questionOrder,
        points: points || 10,
        timeLimit: timeLimit || null, // Time limit in seconds
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
      data: examQuestion,
      message: "Question added to exam successfully",
    });
  } catch (error: any) {
    console.error("Error adding question to exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add question to exam" },
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
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const questionType = searchParams.get("questionType");

    if (!questionId || !questionType) {
      return NextResponse.json(
        { success: false, error: "Missing questionId or questionType" },
        { status: 400 }
      );
    }

    // First, find the exam question to get its ID
    const examQuestion = await prisma.examQuestion.findFirst({
      where: {
        examId: id,
        questionId,
        questionType,
      },
    });

    if (!examQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found in exam" },
        { status: 404 }
      );
    }

    // Delete related exam question results first
    await prisma.examQuestionResult.deleteMany({
      where: {
        questionId: examQuestion.id,
      },
    });

    // Then delete the exam question
    await prisma.examQuestion.delete({
      where: {
        id: examQuestion.id,
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
      message: "Question removed from exam successfully",
    });
  } catch (error: any) {
    console.error("Error removing question from exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove question from exam" },
      { status: 500 }
    );
  }
}

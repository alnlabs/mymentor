import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const questionType = searchParams.get("questionType") || "";

    // Build where clause
    const where: any = { examId: params.id };
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { questionId, questionType, order, points } = body;

    // Validate required fields
    if (!questionId || !questionType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
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
        examId: params.id,
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
        where: { examId: params.id },
        orderBy: { order: "desc" },
      });
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    // Add question to exam
    const examQuestion = await prisma.examQuestion.create({
      data: {
        examId: params.id,
        questionId,
        questionType,
        order: questionOrder,
        points: points || 10,
      },
    });

    // Update exam total questions count
    const questionCount = await prisma.examQuestion.count({
      where: { examId: params.id },
    });

    await prisma.exam.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const questionType = searchParams.get("questionType");

    if (!questionId || !questionType) {
      return NextResponse.json(
        { success: false, error: "Missing questionId or questionType" },
        { status: 400 }
      );
    }

    // Delete the exam question
    await prisma.examQuestion.deleteMany({
      where: {
        examId: params.id,
        questionId,
        questionType,
      },
    });

    // Update exam total questions count
    const questionCount = await prisma.examQuestion.count({
      where: { examId: params.id },
    });

    await prisma.exam.update({
      where: { id: params.id },
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

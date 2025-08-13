import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    const session = await prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        exam: {
          select: {
            title: true,
            passingScore: true,
            totalQuestions: true,
          },
        },
        examResults: {
          include: {
            question: {
              select: {
                id: true,
                questionId: true,
                questionType: true,
                points: true,
                order: true,
              },
            },
          },
          orderBy: {
            question: {
              order: "asc",
            },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Exam session not found" },
        { status: 404 }
      );
    }

    // Enrich exam results with actual question data
    const enrichedResults = await Promise.all(
      session.examResults.map(async (result) => {
        const examQuestion = result.question;

        if (examQuestion.questionType === "MCQ") {
          const mcq = await prisma.mCQQuestion.findUnique({
            where: { id: examQuestion.questionId },
            select: {
              question: true,
              options: true,
              correctAnswer: true,
              explanation: true,
            },
          });

          return {
            ...result,
            question: {
              ...examQuestion,
              question: mcq?.question || "Question not found",
              options: mcq?.options || [],
              correctAnswer: mcq?.correctAnswer || 0,
              explanation: mcq?.explanation || "",
              type: "mcq",
            },
          };
        } else if (examQuestion.questionType === "Problem") {
          const problem = await prisma.problem.findUnique({
            where: { id: examQuestion.questionId },
            select: {
              title: true,
              description: true,
              testCases: true,
              solution: true,
            },
          });

          return {
            ...result,
            question: {
              ...examQuestion,
              question: problem?.description || "Question not found",
              title: problem?.title || "",
              testCases: problem?.testCases || [],
              solution: problem?.solution || "",
              type: "coding",
            },
          };
        }

        return {
          ...result,
          question: {
            ...examQuestion,
            question: "Unknown question type",
            type: "unknown",
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        examResults: enrichedResults,
      },
    });
  } catch (error: any) {
    console.error("Error fetching exam session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam session" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { status, timeSpent } = body;

    const session = await prisma.examSession.update({
      where: { id: sessionId },
      data: {
        status,
        timeSpent,
        ...(status === "completed" && { endTime: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error("Error updating exam session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update exam session" },
      { status: 500 }
    );
  }
}

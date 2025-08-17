import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { answers, endTime } = body;
    const { id: sessionId } = await params;

    console.log("Completing exam session:", {
      sessionId,
      answers,
      endTime,
    });

    // Get the exam session with exam details
    const session = await prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        exam: {
          include: {
            examQuestions: {
              orderBy: { order: "asc" },
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

    console.log("Found session:", {
      id: session.id,
      examId: session.examId,
      userId: session.userId,
      examQuestionsCount: session.exam.examQuestions.length,
    });

    // Calculate score
    let totalScore = 0;
    let correctAnswers = 0;
    const questionResults: any[] = [];

    for (const question of session.exam.examQuestions) {
      const userAnswer = answers[question.id];
      let isCorrect = false;
      let points = 0;

      console.log(`Processing question ${question.id}:`, {
        questionType: question.questionType,
        userAnswer,
        userAnswerType: typeof userAnswer,
      });

      if (question.questionType === "MCQ" && userAnswer !== undefined) {
        // For MCQ questions, we need to fetch the actual question data
        const mcqQuestion = await prisma.mCQQuestion.findUnique({
          where: { id: question.questionId },
        });

        if (mcqQuestion) {
          // Convert both to numbers for comparison
          const userAnswerNum = Number(userAnswer);
          const correctAnswerNum = mcqQuestion.correctAnswer;
          isCorrect = userAnswerNum === correctAnswerNum;
          points = isCorrect ? question.points : 0;

          console.log(`MCQ comparison:`, {
            userAnswer: userAnswerNum,
            correctAnswer: correctAnswerNum,
            isCorrect,
          });
        }
      } else if (
        question.questionType === "Problem" ||
        question.questionType === "CODING"
      ) {
        // For coding questions, we'll need manual grading
        // For now, we'll store the answer for later review
        points = 0; // Will be updated by admin/grader
      }

      if (isCorrect) correctAnswers++;

      totalScore += points;

      const processedUserAnswer =
        userAnswer !== undefined ? String(userAnswer) : null;

      console.log(`Processed answer for question ${question.id}:`, {
        original: userAnswer,
        processed: processedUserAnswer,
        isCorrect,
        points,
      });

      questionResults.push({
        questionId: question.id, // Use ExamQuestion ID
        userAnswer: processedUserAnswer,
        isCorrect,
        points,
      });
    }

    const timeSpent = Math.floor(
      (new Date(endTime).getTime() - new Date(session.startTime).getTime()) /
        1000
    );

    // Update session with results
    const updatedSession = await prisma.examSession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(endTime),
        timeSpent,
        score: totalScore,
        status: "completed",
        examResults: {
          create: questionResults.map((result) => ({
            questionId: result.questionId,
            userAnswer: result.userAnswer,
            isCorrect: result.isCorrect,
            points: result.points,
          })),
        },
      },
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
        },
      },
    });

    const passed = totalScore >= session.exam.passingScore;

    return NextResponse.json({
      success: true,
      data: {
        session: updatedSession,
        score: totalScore,
        correctAnswers,
        totalQuestions: session.exam.examQuestions.length,
        passed,
        timeSpent,
      },
    });
  } catch (error: any) {
    console.error("Error completing exam session:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        success: false,
        error: `Failed to complete exam session: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

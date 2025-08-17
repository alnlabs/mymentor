import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { answers } = body;

    // Get session and template
    const session = await prisma.mockInterview.findUnique({
      where: { id: params.id },
      include: {
        template: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!session || !session.template) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // Calculate results
    const totalQuestions = session.template.questions.length;
    let totalScore = 0;
    let maxScore = 0;
    const questionAnalysis: any[] = [];
    const categoryScores: Record<string, { total: number; earned: number }> =
      {};

    for (const question of session.template.questions) {
      maxScore += question.points;
      const userAnswer = answers[question.id]?.answer;
      let earnedPoints = 0;
      let correct = false;
      let feedback = "";

      // Simple scoring logic (you can enhance this)
      if (userAnswer) {
        if (question.questionType === "MCQ") {
          // For MCQ, assume correct if answered (you can add correct answer field)
          earnedPoints = question.points;
          correct = true;
          feedback = "Good answer!";
        } else {
          // For other types, give partial credit for attempting
          earnedPoints = Math.round(question.points * 0.7);
          correct = earnedPoints >= question.points * 0.6;
          feedback =
            earnedPoints >= question.points * 0.8
              ? "Excellent response!"
              : "Good attempt, room for improvement.";
        }
      } else {
        feedback = "No answer provided.";
      }

      totalScore += earnedPoints;

      // Track category scores (using template category instead)
      const category = session.template.category || "General";
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, earned: 0 };
      }
      categoryScores[category].total += question.points;
      categoryScores[category].earned += earnedPoints;

      questionAnalysis.push({
        questionId: question.id,
        type: question.questionType,
        points: question.points,
        earnedPoints,
        timeSpent: 120, // Default time (you can track actual time)
        correct,
        feedback,
      });
    }

    // Calculate category percentages
    const categoryPercentages: Record<string, number> = {};
    for (const [category, scores] of Object.entries(categoryScores)) {
      categoryPercentages[category] = Math.round(
        (scores.earned / scores.total) * 100
      );
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= 60; // 60% passing threshold

    // Calculate time spent
    const timeSpent = Math.round(
      (Date.now() - new Date(session.scheduledAt || new Date()).getTime()) /
        60000
    );

    // Update the mock interview with results
    const updatedSession = await prisma.mockInterview.update({
      where: { id: params.id },
      data: {
        status: "completed",
        totalScore,
        maxScore,
        completedAt: new Date(),
        notes: JSON.stringify({
          answers,
          questionAnalysis,
          categoryPercentages,
          percentage,
          passed,
          timeSpent,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        resultId: updatedSession.id,
        score: totalScore,
        maxScore,
        percentage,
        passed,
      },
    });
  } catch (error: any) {
    console.error("Error completing interview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete interview" },
      { status: 500 }
    );
  }
}

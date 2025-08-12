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
    const session = await prisma.interviewSession.findUnique({
      where: { id: params.id },
      include: {
        template: {
          include: {
            questions: true
          }
        }
      }
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
    const questionAnalysis = [];
    const categoryScores = {};

    for (const question of session.template.questions) {
      maxScore += question.points;
      const userAnswer = answers[question.id]?.answer;
      let earnedPoints = 0;
      let correct = false;
      let feedback = "";

      // Simple scoring logic (you can enhance this)
      if (userAnswer) {
        if (question.type === "mcq") {
          // For MCQ, assume correct if answered (you can add correct answer field)
          earnedPoints = question.points;
          correct = true;
          feedback = "Good answer!";
        } else {
          // For other types, give partial credit for attempting
          earnedPoints = Math.round(question.points * 0.7);
          correct = earnedPoints >= question.points * 0.6;
          feedback = earnedPoints >= question.points * 0.8 ? "Excellent response!" : "Good attempt, room for improvement.";
        }
      } else {
        feedback = "No answer provided.";
      }

      totalScore += earnedPoints;

      // Track category scores
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { total: 0, earned: 0 };
      }
      categoryScores[question.category].total += question.points;
      categoryScores[question.category].earned += earnedPoints;

      questionAnalysis.push({
        questionId: question.id,
        type: question.type,
        points: question.points,
        earnedPoints,
        timeSpent: 120, // Default time (you can track actual time)
        correct,
        feedback
      });
    }

    // Calculate category percentages
    const categoryPercentages = {};
    for (const [category, scores] of Object.entries(categoryScores)) {
      categoryPercentages[category] = Math.round((scores.earned / scores.total) * 100);
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= 60; // 60% passing threshold

    // Calculate time spent
    const timeSpent = Math.round((Date.now() - new Date(session.startTime).getTime()) / 60000);

    // Create interview result
    const result = await prisma.interviewResult.create({
      data: {
        sessionId: session.id,
        templateId: session.templateId,
        userId: session.userId,
        score: totalScore,
        maxScore,
        percentage,
        passed,
        timeSpent,
        startTime: session.startTime,
        completedAt: new Date(),
        answers: answers,
        feedback: `Overall performance: ${percentage}%. ${passed ? 'Congratulations! You passed the interview.' : 'Keep practicing to improve your skills.'}`,
        categoryScores: categoryPercentages,
        questionAnalysis
      }
    });

    // Update session status
    await prisma.interviewSession.update({
      where: { id: params.id },
      data: {
        status: "completed",
        endTime: new Date(),
        timeSpent
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        resultId: result.id,
        score: totalScore,
        maxScore,
        percentage,
        passed
      }
    });
  } catch (error: any) {
    console.error("Error completing interview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete interview" },
      { status: 500 }
    );
  }
}

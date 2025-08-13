import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Save generated questions to database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, language, topic } = body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "No questions provided" },
        { status: 400 }
      );
    }

    if (!language || !topic) {
      return NextResponse.json(
        { success: false, error: "Language and topic are required" },
        { status: 400 }
      );
    }

    let savedCount = 0;
    const errors = [];

    // Save each question to the database
    for (const question of questions) {
      try {
        // Check if question already exists (enabled to prevent duplicates)
        const existingQuestion = await prisma.mCQQuestion.findFirst({
          where: {
            question: question.question,
            category: language,
          },
        });

        if (existingQuestion) {
          errors.push(
            `Question already exists: ${question.question.substring(0, 50)}...`
          );
          continue;
        }

        // Convert correctAnswer from string to index
        const correctAnswerIndex = question.options.findIndex(
          (option: string) => option === question.correctAnswer
        );

        if (correctAnswerIndex === -1) {
          errors.push(
            `Correct answer not found in options for: ${question.question.substring(
              0,
              50
            )}...`
          );
          continue;
        }

        // Save the question
        await prisma.mCQQuestion.create({
          data: {
            id: question.id,
            question: question.question,
            options: JSON.stringify(question.options),
            correctAnswer: correctAnswerIndex,
            explanation: question.explanation || "",
            category: language,
            difficulty: question.difficulty || "intermediate",
            tags: JSON.stringify(question.tags || []),
            companies: JSON.stringify(question.companies || []),
          },
        });

        savedCount++;
      } catch (error: any) {
        console.error("Error saving question:", error);
        errors.push(
          `Failed to save question: ${question.question.substring(0, 50)}...`
        );
      }
    }

    // Log the generation for analytics (commented out since Analytics model doesn't exist)
    // await prisma.analytics.create({
    //   data: {
    //     event: "ai_question_generation",
    //     details: {
    //       language,
    //       topic,
    //       totalQuestions: questions.length,
    //       savedCount,
    //       errors: errors.length,
    //     },
    //     timestamp: new Date(),
    //   },
    // }).catch(() => {
    //   // Analytics table might not exist, ignore the error
    // });

    return NextResponse.json({
      success: true,
      savedCount,
      totalQuestions: questions.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully saved ${savedCount} out of ${questions.length} questions to database`,
    });
  } catch (error: any) {
    console.error("Error saving generated questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save questions to database" },
      { status: 500 }
    );
  }
}

// GET - Get statistics about AI-generated questions
export async function GET() {
  try {
    // Get count of AI-generated questions
    const aiGeneratedCount = await prisma.mCQQuestion.count({
      where: {
        id: {
          startsWith: "ai_",
        },
      },
    });

    // Get count by language
    const byLanguage = await prisma.mCQQuestion.groupBy({
      by: ["category"],
      where: {
        id: {
          startsWith: "ai_",
        },
      },
      _count: {
        id: true,
      },
    });

    // Get count by difficulty
    const byDifficulty = await prisma.mCQQuestion.groupBy({
      by: ["difficulty"],
      where: {
        id: {
          startsWith: "ai_",
        },
      },
      _count: {
        id: true,
      },
    });

    // Get recent generations
    const recentGenerations = await prisma.mCQQuestion.findMany({
      where: {
        id: {
          startsWith: "ai_",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        question: true,
        category: true,
        difficulty: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalAIGenerated: aiGeneratedCount,
        byLanguage: byLanguage.map((item) => ({
          language: item.category,
          count: item._count.id,
        })),
        byDifficulty: byDifficulty.map((item) => ({
          difficulty: item.difficulty,
          count: item._count.id,
        })),
        recentGenerations,
      },
    });
  } catch (error: any) {
    console.error("Error getting AI generation statistics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get statistics" },
      { status: 500 }
    );
  }
}

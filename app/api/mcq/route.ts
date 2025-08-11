import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const category = searchParams.get("category");

    const where: any = { isActive: true };
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;

    const questions = await prisma.mCQQuestion.findMany({
      where,
      select: {
        id: true,
        question: true,
        difficulty: true,
        category: true,
        createdAt: true,
        _count: {
          select: {
            userProgress: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Group questions by category and create MCQ sets
    const questionsByCategory = questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {} as Record<string, typeof questions>);

    // Create MCQ sets from grouped questions
    const mcqSets = Object.entries(questionsByCategory).map(
      ([category, categoryQuestions]) => {
        const difficulties = categoryQuestions.map((q) => q.difficulty);
        const avgDifficulty = difficulties.includes("hard")
          ? "hard"
          : difficulties.includes("medium")
          ? "medium"
          : "easy";

        return {
          id: `mcq-set-${category}`,
          title: `${
            category.charAt(0).toUpperCase() + category.slice(1)
          } Practice Set`,
          description: `Test your knowledge in ${category} with ${categoryQuestions.length} carefully selected questions.`,
          category: category,
          difficulty: avgDifficulty as "easy" | "medium" | "hard",
          timeLimit: Math.ceil(categoryQuestions.length * 1.5), // 1.5 minutes per question
          questionCount: categoryQuestions.length,
          participants: Math.floor(Math.random() * 100) + 10, // Mock participants
          averageScore: Math.floor(Math.random() * 30) + 60, // Mock average score
        };
      }
    );

    const response: ApiResponse = {
      success: true,
      data: mcqSets,
      message: "MCQ sets retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: "Failed to retrieve MCQ questions",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

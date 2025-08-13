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
      include: {
        _count: {
          select: {
            userProgress: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Transform the data to match frontend expectations
    const transformedQuestions = questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options ? JSON.parse(question.options) : [],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      category: question.category,
      subject: question.subject,
      topic: question.topic,
      tool: question.tool,
      technologyStack: question.technologyStack,
      domain: question.domain,
      skillLevel: question.skillLevel,
      jobRole: question.jobRole,
      companyType: question.companyType,
      interviewType: question.interviewType,
      difficulty: question.difficulty,
      tags: question.tags,
      companies: question.companies,
      priority: question.priority,
      status: question.status,
      isActive: question.isActive,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
      _count: question._count,
    }));

    const response: ApiResponse = {
      success: true,
      data: transformedQuestions,
      message: "MCQ questions retrieved successfully",
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "IDs array is required" },
        { status: 400 }
      );
    }

    // Delete multiple MCQ questions
    const result = await prisma.mCQQuestion.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { deletedCount: result.count },
      message: `Successfully deleted ${result.count} MCQ question(s)`,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error deleting MCQ questions:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete MCQ questions",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

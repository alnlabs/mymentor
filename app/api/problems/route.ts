import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');

    const where: any = { isActive: true };
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;

    const problems = await prisma.problem.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        createdAt: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Transform the data to match frontend expectations
    const transformedProblems = problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty as "easy" | "medium" | "hard",
      category: problem.category,
      timeLimit: 30, // Default time limit
      memoryLimit: 256, // Default memory limit in MB
      submissions: problem._count.submissions,
      successRate: problem._count.submissions > 0 ? Math.floor(Math.random() * 40) + 60 : 0, // Mock success rate for now
    }));

    const response: ApiResponse = {
      success: true,
      data: transformedProblems,
      message: 'Problems retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve problems',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

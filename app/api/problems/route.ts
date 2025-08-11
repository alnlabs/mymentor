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
        difficulty: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const response: ApiResponse = {
      success: true,
      data: problems,
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

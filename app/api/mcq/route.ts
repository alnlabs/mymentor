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

    const questions = await prisma.mCQQuestion.findMany({
      where,
      select: {
        id: true,
        question: true,
        difficulty: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const response: ApiResponse = {
      success: true,
      data: questions,
      message: 'MCQ questions retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve MCQ questions',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

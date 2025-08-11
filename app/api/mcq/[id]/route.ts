import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.mCQQuestion.findUnique({
      where: { id: params.id },
    });

    if (!question) {
      const response: ApiResponse = {
        success: false,
        error: 'MCQ question not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: question,
      message: 'MCQ question retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve MCQ question',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

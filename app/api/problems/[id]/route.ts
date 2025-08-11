import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: params.id },
    });

    if (!problem) {
      const response: ApiResponse = {
        success: false,
        error: 'Problem not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: problem,
      message: 'Problem retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve problem',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

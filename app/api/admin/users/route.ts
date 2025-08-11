import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        progress: true,
        createdAt: true,
        avatar: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: users,
      message: 'Users fetched successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch users',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

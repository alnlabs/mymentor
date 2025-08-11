import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { role, isActive } = body;

    // Validate role
    if (role && !['superadmin', 'admin', 'user'].includes(role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid role. Must be superadmin, admin, or user',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive }),
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
      data: updatedUser,
      message: 'User updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update user',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete user',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

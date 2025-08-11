import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/shared/types/common';
import { prisma } from '@/shared/lib/database';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newUsername, newPassword } = await request.json();

    // Get current SuperAdmin from database
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'superadmin' }
    });

    if (!superAdmin) {
      const response: ApiResponse = {
        success: false,
        error: 'SuperAdmin not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Validate current password (compare with hashed password in database)
    const isValidPassword = await bcrypt.compare(currentPassword, superAdmin.password || '');
    
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        error: 'Current password is incorrect',
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update SuperAdmin credentials in database
    const updatedSuperAdmin = await prisma.user.update({
      where: { id: superAdmin.id },
      data: {
        email: newUsername,
        password: hashedPassword,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Credentials updated successfully',
        newUsername,
        // Don't return the password for security
      },
      message: 'SuperAdmin credentials updated successfully!',
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating SuperAdmin credentials:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update credentials',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

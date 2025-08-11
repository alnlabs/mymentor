import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find SuperAdmin user in database
    const superAdmin = await prisma.user.findFirst({
      where: { 
        role: 'superadmin',
        email: email
      }
    });

    if (!superAdmin) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid SuperAdmin credentials',
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, superAdmin.password || '');
    
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid SuperAdmin credentials',
      };
      return NextResponse.json(response, { status: 401 });
    }

    const response: ApiResponse = {
      success: true,
      data: { user: superAdmin },
      message: 'SuperAdmin login successful',
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('SuperAdmin login error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Login failed',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

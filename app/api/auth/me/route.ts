import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function GET(request: NextRequest) {
  try {
    // Get user from session/token (simplified for demo)
    // In production, you'd get this from JWT token or session
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      const response: ApiResponse = {
        success: false,
        error: 'No authorization header',
      };
      return NextResponse.json(response, { status: 401 });
    }

    // For demo purposes, we'll check for SuperAdmin session
    // In production, validate JWT token here
    const superAdminUser = request.headers.get('x-superadmin-user');
    
    if (superAdminUser) {
      try {
        const user = JSON.parse(superAdminUser);
        return NextResponse.json({
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
          },
        });
      } catch (error) {
        // Continue to normal user lookup
      }
    }

    // For now, return a default user role
    // In production, this would come from your auth system
    const response: ApiResponse = {
      success: true,
      data: {
        role: 'user', // Default role
        isActive: true,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch user',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

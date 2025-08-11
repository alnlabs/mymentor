import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, name, photoURL } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          id: uid,
          email,
          name: name || email.split('@')[0],
          avatar: photoURL,
          provider: 'google',
          role: 'user'
        }
      });
    } else {
      // Update existing user's info
      user = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          avatar: photoURL || user.avatar,
          isActive: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to authenticate user' },
      { status: 500 }
    );
  }
}

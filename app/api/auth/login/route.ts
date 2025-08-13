import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    // Find user in database by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || "" }, { username: username || "" }],
        isActive: true,
        isDeleted: false,
      },
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid credentials",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password || "");

    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid credentials",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
        },
      },
      message: "Login successful",
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("User login error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Login failed",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

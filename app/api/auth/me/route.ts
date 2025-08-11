import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers
    const userId = request.headers.get("x-user-id");
    const superAdminUser = request.headers.get("x-superadmin-user");

    // Handle SuperAdmin session
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
        console.error("Error parsing superadmin user:", error);
      }
    }

    // Handle Firebase user
    if (userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
          },
        });

        if (user) {
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
        }
      } catch (error) {
        console.error("Error fetching user from database:", error);
      }
    }

    // Return default user role if no user found
    const response: ApiResponse = {
      success: true,
      data: {
        role: "user", // Default role
        isActive: true,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch user",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

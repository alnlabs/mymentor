import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get("includeDeleted") === "true";
    const onlyDeleted = searchParams.get("onlyDeleted") === "true";
    const search = searchParams.get("search") || "";

    // Build where clause based on parameters
    let whereClause: any = {};

    if (onlyDeleted) {
      whereClause.isDeleted = true;
    } else if (!includeDeleted) {
      whereClause.isDeleted = false;
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
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
        isDeleted: true,
        deletedAt: true,
        deletedBy: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: users,
      message: "Users fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch users",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

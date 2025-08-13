import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const activeOnly = searchParams.get("activeOnly") === "true";

    let whereClause: any = {};
    if (type) {
      whereClause.type = type;
    }
    if (activeOnly) {
      whereClause.isActive = true;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    const response: ApiResponse = {
      success: true,
      data: categories,
      message: "Categories fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch categories",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, color, icon, sortOrder } = body;

    const category = await prisma.category.create({
      data: {
        name,
        type,
        description,
        color,
        icon,
        sortOrder: sortOrder || 0,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: category,
      message: "Category created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to create category",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

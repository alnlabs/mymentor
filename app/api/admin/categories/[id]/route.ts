import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      const response: ApiResponse = {
        success: false,
        error: "Category not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: category,
      message: "Category fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching category:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch category",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, description, color, icon, isActive, sortOrder } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        type,
        description,
        color,
        icon,
        isActive,
        sortOrder,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: category,
      message: "Category updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating category:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update category",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.category.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
      data: category,
      message: "Category deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting category:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete category",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

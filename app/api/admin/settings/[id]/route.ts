import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { value, category, description } = body;

    // Try to find by ID first, then by key if ID is not found
    let setting = await prisma.setting.findUnique({
      where: { id: params.id },
    });

    if (!setting) {
      // If not found by ID, try to find by key
      setting = await prisma.setting.findUnique({
        where: { key: params.id },
      });
    }

    if (!setting) {
      const response: ApiResponse = {
        success: false,
        error: "Setting not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Update the setting
    const updatedSetting = await prisma.setting.update({
      where: { id: setting.id },
      data: {
        value: value !== undefined ? value : setting.value,
        category: category !== undefined ? category : setting.category,
        description:
          description !== undefined ? description : setting.description,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: updatedSetting,
      message: "Setting updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating setting:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update setting",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find by ID first, then by key if ID is not found
    let setting = await prisma.setting.findUnique({
      where: { id: params.id },
    });

    if (!setting) {
      // If not found by ID, try to find by key
      setting = await prisma.setting.findUnique({
        where: { key: params.id },
      });
    }

    if (!setting) {
      const response: ApiResponse = {
        success: false,
        error: "Setting not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete the setting
    await prisma.setting.delete({
      where: { id: setting.id },
    });

    const response: ApiResponse = {
      success: true,
      message: "Setting deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting setting:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete setting",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }

    const settings = await prisma.setting.findMany({
      where: whereClause,
      orderBy: { key: "asc" },
    });

    const response: ApiResponse = {
      success: true,
      data: settings,
      message: "Settings fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching settings:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch settings",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body; // Array of { key, value, category, description }

    const results = [];

    for (const setting of settings) {
      const result = await prisma.setting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          category: setting.category,
          description: setting.description,
        },
        create: {
          key: setting.key,
          value: setting.value,
          category: setting.category,
          description: setting.description,
        },
      });
      results.push(result);
    }

    const response: ApiResponse = {
      success: true,
      data: results,
      message: "Settings updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating settings:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update settings",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

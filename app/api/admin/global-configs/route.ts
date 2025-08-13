import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    let whereClause: any = {};
    if (key) {
      whereClause.key = key;
    }

    const configs = await prisma.globalConfig.findMany({
      where: whereClause,
      orderBy: { key: "asc" },
    });

    const response: ApiResponse = {
      success: true,
      data: configs,
      message: "Global configs fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching global configs:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch global configs",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { configs } = body; // Array of { key, value, type, description }

    const results = [];

    for (const config of configs) {
      const result = await prisma.globalConfig.upsert({
        where: { key: config.key },
        update: {
          value: config.value,
          type: config.type,
          description: config.description,
        },
        create: {
          key: config.key,
          value: config.value,
          type: config.type,
          description: config.description,
        },
      });
      results.push(result);
    }

    const response: ApiResponse = {
      success: true,
      data: results,
      message: "Global configs updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating global configs:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update global configs",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

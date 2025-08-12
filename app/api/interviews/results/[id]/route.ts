import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.interviewResult.findUnique({
      where: { id: params.id },
      include: {
        template: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        result,
        template: result.template
      }
    });
  } catch (error: any) {
    console.error("Error fetching interview result:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch interview result" },
      { status: 500 }
    );
  }
}

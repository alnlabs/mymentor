import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examId, startTime } = body;

    // TODO: Get actual user ID from authentication
    // For now, create a temporary user or use a default one
    let userId = "temp-user-id";

    // Check if a default user exists, if not create one
    const existingUser = await prisma.user.findFirst({
      where: { email: "temp@example.com" },
    });

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a temporary user for testing
      const tempUser = await prisma.user.create({
        data: {
          email: "temp@example.com",
          name: "Temporary User",
          provider: "email",
          role: "user",
        },
      });
      userId = tempUser.id;
    }

    const session = await prisma.examSession.create({
      data: {
        examId,
        userId,
        startTime: new Date(startTime),
        status: "in-progress",
      },
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error("Error creating exam session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create exam session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("examId");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (examId) where.examId = examId;
    if (userId) where.userId = userId;

    const sessions = await prisma.examSession.findMany({
      where,
      include: {
        exam: {
          select: {
            title: true,
            category: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    console.error("Error fetching exam sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam sessions" },
      { status: 500 }
    );
  }
}

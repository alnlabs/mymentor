import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, action } = body;

    if (!templateId) {
      return NextResponse.json(
        { success: false, error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Get current user (you'll need to implement authentication)
    const userId = "user-123"; // Replace with actual user ID from auth

    if (action === "create-or-resume") {
      // Check for existing session
      const existingSession = await prisma.interviewSession.findFirst({
        where: {
          templateId,
          userId,
          status: {
            in: ["in-progress", "paused"]
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      if (existingSession) {
        // Resume existing session
        return NextResponse.json({
          success: true,
          data: {
            session: existingSession,
            currentQuestion: existingSession.currentQuestion || 0,
            answers: existingSession.answers || {}
          }
        });
      } else {
        // Create new session
        const newSession = await prisma.interviewSession.create({
          data: {
            templateId,
            userId,
            status: "in-progress",
            currentQuestion: 0,
            answers: {},
            startTime: new Date(),
            timeSpent: 0
          }
        });

        return NextResponse.json({
          success: true,
          data: {
            session: newSession,
            currentQuestion: 0,
            answers: {}
          }
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error managing interview session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to manage interview session" },
      { status: 500 }
    );
  }
}

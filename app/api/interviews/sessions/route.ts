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
      const existingSession = await prisma.mockInterview.findFirst({
        where: {
          templateId,
          userId,
          status: {
            in: ["in-progress", "paused"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingSession) {
        // Resume existing session
        let currentQuestion = 0;
        let answers = {};

        try {
          if (existingSession.notes) {
            const notes = JSON.parse(existingSession.notes);
            currentQuestion = notes.currentQuestion || 0;
            answers = notes.answers || {};
          }
        } catch (error) {
          console.error("Error parsing session notes:", error);
        }

        return NextResponse.json({
          success: true,
          data: {
            session: existingSession,
            currentQuestion,
            answers,
          },
        });
      } else {
        // Create new session
        const newSession = await prisma.mockInterview.create({
          data: {
            templateId,
            userId,
            status: "in-progress",
            scheduledAt: new Date(),
            totalScore: 0,
            maxScore: 0,
            notes: JSON.stringify({
              currentQuestion: 0,
              answers: {},
            }),
          },
        });

        return NextResponse.json({
          success: true,
          data: {
            session: newSession,
            currentQuestion: 0,
            answers: {},
          },
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

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isAnonymous, type, category, subject, message, rating } = body;

    // Get or create a default user for feedback
    let user = await prisma.user.findFirst({
      where: { email: "feedback@mymentor.com" }
    });

    if (!user) {
      // Create a default user for feedback submissions
      user = await prisma.user.create({
        data: {
          email: "feedback@mymentor.com",
          name: "Feedback User",
          provider: "email",
          role: "user",
        }
      });
    }

    // Always store user details in background (secret)
    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id, // Use the actual user ID
        isAnonymous, // User's choice for display
        type,
        category,
        subject,
        message,
        rating,
        status: "pending",
        priority: "medium",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        id: feedback.id,
        isAnonymous: feedback.isAnonymous,
        submittedAt: feedback.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit feedback. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint would be used by admin to fetch feedback
    // For now, return empty array - admin interface will implement this
    const feedback = await prisma.feedback.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch feedback.",
      },
      { status: 500 }
    );
  }
}

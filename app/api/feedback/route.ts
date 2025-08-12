import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isAnonymous, type, category, subject, message, rating } = body;

    // For now, using a placeholder user ID - in real app, get from auth context
    const userId = "user-123"; // This would come from authentication

    // Always store user details in background (secret)
    const feedback = await prisma.feedback.create({
      data: {
        userId, // Always stored for admin reference
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

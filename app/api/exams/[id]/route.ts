import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
      include: {
        examQuestions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            examQuestions: true,
            examResults: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...exam,
        totalQuestions: exam._count.examQuestions,
        totalAttempts: exam._count.examResults,
      },
    });
  } catch (error: any) {
    console.error("Error fetching exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      duration,
      difficulty,
      category,
      targetRole,
      questionTypes,
      totalQuestions,
      passingScore,
      isActive,
      isPublic,
    } = body;

    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id: params.id },
    });

    if (!existingExam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    // Check if title is being changed and if it conflicts
    if (title && title !== existingExam.title) {
      const titleConflict = await prisma.exam.findUnique({
        where: { title },
      });

      if (titleConflict) {
        return NextResponse.json(
          { success: false, error: "Exam with this title already exists" },
          { status: 400 }
        );
      }
    }

    // Update exam
    const exam = await prisma.exam.update({
      where: { id: params.id },
      data: {
        title,
        description,
        duration: duration ? parseInt(duration) : undefined,
        difficulty,
        category,
        targetRole,
        questionTypes,
        totalQuestions: totalQuestions ? parseInt(totalQuestions) : undefined,
        passingScore: passingScore ? parseInt(passingScore) : undefined,
        isActive,
        isPublic,
      },
    });

    return NextResponse.json({
      success: true,
      data: exam,
      message: "Exam updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update exam" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id: params.id },
    });

    if (!existingExam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    // Delete exam questions first
    await prisma.examQuestion.deleteMany({
      where: { examId: params.id },
    });

    // Delete exam results
    await prisma.examResult.deleteMany({
      where: { examId: params.id },
    });

    // Delete exam
    await prisma.exam.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete exam" },
      { status: 500 }
    );
  }
}

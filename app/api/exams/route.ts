import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const category = searchParams.get("category") || "";
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Get exams with question count
    const exams = await prisma.exam.findMany({
      where,
      include: {
        _count: {
          select: {
            examQuestions: true,
            examResults: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.exam.count({ where });

    return NextResponse.json({
      success: true,
      data: exams.map(exam => ({
        ...exam,
        totalQuestions: exam._count.examQuestions,
        totalAttempts: exam._count.examResults,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!title || !description || !duration || !difficulty || !category || !questionTypes) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if exam with same title exists
    const existingExam = await prisma.exam.findUnique({
      where: { title },
    });

    if (existingExam) {
      return NextResponse.json(
        { success: false, error: "Exam with this title already exists" },
        { status: 400 }
      );
    }

    // Create exam
    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        difficulty,
        category,
        targetRole,
        questionTypes,
        totalQuestions: parseInt(totalQuestions) || 0,
        passingScore: parseInt(passingScore) || 60,
        isActive: isActive !== undefined ? isActive : true,
        isPublic: isPublic !== undefined ? isPublic : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: exam,
      message: "Exam created successfully",
    });
  } catch (error: any) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create exam" },
      { status: 500 }
    );
  }
}

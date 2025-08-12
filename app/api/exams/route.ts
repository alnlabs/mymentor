import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to generate exam questions based on auto-generation options
async function generateExamQuestions(examId: string, options: any) {
  try {
    const {
      questionCount,
      mcqPercentage,
      codingPercentage,
      aptitudePercentage,
      difficultyDistribution,
      categories,
      subjects,
      languages,
      includeNonTechnical,
      nonTechnicalPercentage,
    } = options;

    const questions = [];
    const mcqCount = Math.round((questionCount * mcqPercentage) / 100);
    const codingCount = Math.round((questionCount * codingPercentage) / 100);
    const aptitudeCount = questionCount - mcqCount - codingCount;

    // Calculate difficulty counts
    const easyCount = Math.round(
      (questionCount * difficultyDistribution.easy) / 100
    );
    const mediumCount = Math.round(
      (questionCount * difficultyDistribution.medium) / 100
    );
    const hardCount = questionCount - easyCount - mediumCount;

    // Build where clauses for filtering
    const mcqWhere: any = {};
    const problemWhere: any = {};

    if (categories.length > 0) {
      mcqWhere.category = { in: categories };
      problemWhere.category = { in: categories };
    }

    if (subjects.length > 0) {
      mcqWhere.subject = { in: subjects };
      problemWhere.subject = { in: subjects };
    }

    if (languages.length > 0) {
      mcqWhere.language = { in: languages };
      problemWhere.language = { in: languages };
    }

    // Get MCQ questions
    if (mcqCount > 0) {
      const mcqQuestions = await prisma.mCQQuestion.findMany({
        where: mcqWhere,
        take: mcqCount * 2, // Get more to ensure we have enough after filtering
      });

      // Shuffle and select based on difficulty distribution
      const shuffledMcqs = mcqQuestions.sort(() => Math.random() - 0.5);
      const selectedMcqs = shuffledMcqs.slice(0, mcqCount);

      for (const mcq of selectedMcqs) {
        questions.push({
          examId,
          questionType: "MCQ",
          questionId: mcq.id,
          questionText: mcq.question,
          options: mcq.options,
          correctAnswer: mcq.correctAnswer,
          explanation: mcq.explanation,
          points: 1,
          timeLimit: 120,
        });
      }
    }

    // Get coding problems
    if (codingCount > 0) {
      const codingProblems = await prisma.problem.findMany({
        where: problemWhere,
        take: codingCount * 2,
      });

      const shuffledProblems = codingProblems.sort(() => Math.random() - 0.5);
      const selectedProblems = shuffledProblems.slice(0, codingCount);

      for (const problem of selectedProblems) {
        questions.push({
          examId,
          questionType: "CODING",
          questionId: problem.id,
          questionText: problem.title,
          description: problem.description,
          points: 5,
          timeLimit: 600, // 10 minutes for coding questions
        });
      }
    }

    // Get aptitude questions (non-technical)
    if (aptitudeCount > 0 && includeNonTechnical) {
      const aptitudeCategories = [
        "Aptitude",
        "Logical Reasoning",
        "Verbal Ability",
        "Quantitative Aptitude",
        "General Knowledge",
        "English Language",
        "Business Communication",
      ];

      const aptitudeWhere = {
        ...mcqWhere,
        category: { in: aptitudeCategories },
      };

      const aptitudeQuestions = await prisma.mCQQuestion.findMany({
        where: aptitudeWhere,
        take: aptitudeCount * 2,
      });

      const shuffledAptitude = aptitudeQuestions.sort(
        () => Math.random() - 0.5
      );
      const selectedAptitude = shuffledAptitude.slice(0, aptitudeCount);

      for (const aptitude of selectedAptitude) {
        questions.push({
          examId,
          questionType: "APTITUDE",
          questionId: aptitude.id,
          questionText: aptitude.question,
          options: aptitude.options,
          correctAnswer: aptitude.correctAnswer,
          explanation: aptitude.explanation,
          points: 1,
          timeLimit: 90,
        });
      }
    }

    // Create exam questions in database
    if (questions.length > 0) {
      await prisma.examQuestion.createMany({
        data: questions,
      });

      // Update exam with total questions count
      await prisma.exam.update({
        where: { id: examId },
        data: { totalQuestions: questions.length },
      });
    }

    return questions.length;
  } catch (error) {
    console.error("Error generating exam questions:", error);
    throw error;
  }
}

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
      data: exams.map((exam) => ({
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
      autoGenerate,
      autoGenerateOptions,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !duration ||
      !difficulty ||
      !category ||
      !questionTypes
    ) {
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

    // Auto-generate questions if enabled
    if (autoGenerate && autoGenerateOptions) {
      await generateExamQuestions(exam.id, autoGenerateOptions);
    }

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

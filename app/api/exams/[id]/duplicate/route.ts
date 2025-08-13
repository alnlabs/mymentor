import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import {
  prepareExamForDuplication,
  validateExamUniqueness,
} from "@/shared/utils/examUtils";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;

    // Get the original exam
    const originalExam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examQuestions: true,
      },
    });

    if (!originalExam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    // Query database for existing exams with same base title
    const baseTitle = originalExam.title;

    // Check if the original title already has a copy pattern
    const originalCopyMatch = baseTitle.match(/^(.*?) \(Copy (\d+)\)$/);
    const actualBaseTitle = originalCopyMatch
      ? originalCopyMatch[1]
      : baseTitle;

    const copyPattern = new RegExp(
      `^${actualBaseTitle.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )} \\(Copy (\\d+)\\)$`
    );

    const existingCopies = await prisma.exam.findMany({
      select: { title: true },
      where: {
        title: {
          startsWith: actualBaseTitle + " (Copy ",
        },
      },
    });

    // Find the highest copy number
    let maxCopyNumber = 0;
    existingCopies.forEach((exam) => {
      const match = exam.title.match(copyPattern);
      if (match) {
        const copyNumber = parseInt(match[1]);
        maxCopyNumber = Math.max(maxCopyNumber, copyNumber);
      }
    });

    // Generate next copy number
    const nextCopyNumber = maxCopyNumber + 1;
    const newTitle = `${actualBaseTitle} (Copy ${nextCopyNumber})`;

    console.log("Base title:", actualBaseTitle);
    console.log(
      "Existing copies:",
      existingCopies.map((e) => e.title)
    );
    console.log("Max copy number:", maxCopyNumber);
    console.log("New title:", newTitle);

    // Double-check that the new title doesn't already exist
    const titleExists = await prisma.exam.findFirst({
      where: { title: newTitle },
    });

    if (titleExists) {
      console.error("Title already exists:", newTitle);
      return NextResponse.json(
        {
          success: false,
          error: "Generated title already exists",
          details: [`Title "${newTitle}" already exists in database`],
        },
        { status: 400 }
      );
    }

    // Prepare the duplicated exam data with the new title
    const duplicatedExamData = {
      title: newTitle,
      description: originalExam.description,
      duration: originalExam.duration,
      difficulty: originalExam.difficulty,
      category: originalExam.category,
      targetRole: originalExam.targetRole,
      questionTypes: originalExam.questionTypes,
      totalQuestions: 0, // Reset to 0 as questions will be added separately
      passingScore: originalExam.passingScore,
      enableTimedQuestions: originalExam.enableTimedQuestions,
      enableOverallTimer: originalExam.enableOverallTimer,
      defaultQuestionTime: originalExam.defaultQuestionTime,
      isActive: false, // Set to inactive by default for safety
      isPublic: false, // Set to private by default for safety
    };

    // Create the duplicated exam
    let duplicatedExam;
    try {
      duplicatedExam = await prisma.exam.create({
        data: duplicatedExamData,
      });
      console.log(
        "Successfully created duplicated exam:",
        duplicatedExam.title
      );
    } catch (createError) {
      console.error("Error creating duplicated exam:", createError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create duplicated exam",
          details:
            createError instanceof Error
              ? createError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Duplicate the exam questions if any exist
    if (originalExam.examQuestions.length > 0) {
      const questionData = originalExam.examQuestions.map((question) => ({
        examId: duplicatedExam.id,
        questionId: question.questionId,
        questionType: question.questionType,
        order: question.order,
        points: question.points,
        timeLimit: question.timeLimit,
        isActive: question.isActive,
      }));

      await prisma.examQuestion.createMany({
        data: questionData,
      });

      // Update the total questions count
      await prisma.exam.update({
        where: { id: duplicatedExam.id },
        data: { totalQuestions: originalExam.examQuestions.length },
      });
    }

    return NextResponse.json({
      success: true,
      data: duplicatedExam,
      message: `Exam "${originalExam.title}" duplicated successfully as "${duplicatedExam.title}"`,
    });
  } catch (error) {
    console.error("Error duplicating exam:", error);
    return NextResponse.json(
      { success: false, error: "Failed to duplicate exam" },
      { status: 500 }
    );
  }
}

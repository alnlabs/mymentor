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

    // Map form categories to database categories
    const categoryMapping: { [key: string]: string[] } = {
      Programming: [
        "algorithms",
        "data-structures",
        "arrays",
        "strings",
        "stacks",
        "math",
      ],
      "Data Structures": ["data-structures", "arrays", "strings", "stacks"],
      Algorithms: ["algorithms", "arrays", "strings"],
      "Web Development": ["algorithms", "data-structures"], // Fallback categories
      Database: ["algorithms", "data-structures"], // Fallback categories
      "System Design": ["algorithms", "data-structures"], // Fallback categories
    };

    // Get mapped categories or use original categories
    const mappedCategories = categoryMapping[categories[0]] || categories;

    if (mappedCategories.length > 0) {
      mcqWhere.category = { in: mappedCategories };
      problemWhere.category = { in: mappedCategories };
    }

    // Combine subjects and languages for filtering
    const allSubjects = [];

    // Add subjects if provided and not "General"
    if (subjects.length > 0 && !subjects.includes("General")) {
      allSubjects.push(...subjects);
    }

    // Add languages if provided
    if (languages && languages.length > 0) {
      allSubjects.push(...languages);
    }

    // Apply combined filter
    if (allSubjects.length > 0) {
      mcqWhere.subject = { in: allSubjects };
      problemWhere.subject = { in: allSubjects };
    }

    // Get MCQ questions with difficulty filtering
    if (mcqCount > 0) {
      console.log("Looking for MCQ questions with criteria:", mcqWhere);
      console.log("Subjects filter:", subjects);
      console.log("Languages filter:", languages);
      console.log("Combined subjects filter:", allSubjects);

      const mcqQuestions = await prisma.mCQQuestion.findMany({
        where: mcqWhere,
        take: mcqCount * 3, // Get more to ensure we have enough after filtering
      });
      console.log(`Found ${mcqQuestions.length} MCQ questions`);

      // Log sample questions to verify filtering
      if (mcqQuestions.length > 0) {
        console.log("Sample questions found:");
        mcqQuestions.slice(0, 3).forEach((q, i) => {
          console.log(
            `  ${i + 1}. Subject: ${q.subject}, Category: ${
              q.category
            }, Question: ${q.question.substring(0, 50)}...`
          );
        });
      }

      // Separate questions by difficulty
      const easyQuestions = mcqQuestions.filter(
        (q) => q.difficulty.toLowerCase() === "easy"
      );
      const mediumQuestions = mcqQuestions.filter(
        (q) => q.difficulty.toLowerCase() === "medium"
      );
      const hardQuestions = mcqQuestions.filter(
        (q) => q.difficulty.toLowerCase() === "hard"
      );

      // Select questions based on difficulty distribution
      const selectedMcqs: any[] = [];

      // Add easy questions
      const shuffledEasy = easyQuestions.sort(() => Math.random() - 0.5);
      selectedMcqs.push(
        ...shuffledEasy.slice(0, Math.min(easyCount, easyQuestions.length))
      );

      // Add medium questions
      const shuffledMedium = mediumQuestions.sort(() => Math.random() - 0.5);
      selectedMcqs.push(
        ...shuffledMedium.slice(
          0,
          Math.min(mediumCount, mediumQuestions.length)
        )
      );

      // Add hard questions
      const shuffledHard = hardQuestions.sort(() => Math.random() - 0.5);
      selectedMcqs.push(
        ...shuffledHard.slice(0, Math.min(hardCount, hardQuestions.length))
      );

      // If we don't have enough questions, fill with remaining questions
      if (selectedMcqs.length < mcqCount) {
        const remainingQuestions = mcqQuestions.filter(
          (q) => !selectedMcqs.includes(q)
        );
        const shuffledRemaining = remainingQuestions.sort(
          () => Math.random() - 0.5
        );
        selectedMcqs.push(
          ...shuffledRemaining.slice(0, mcqCount - selectedMcqs.length)
        );
      }

      // Shuffle final selection and limit to mcqCount
      const finalMcqs = selectedMcqs
        .sort(() => Math.random() - 0.5)
        .slice(0, mcqCount);

      for (const mcq of finalMcqs) {
        questions.push({
          examId,
          questionType: "MCQ",
          questionId: mcq.id,
          order: questions.length + 1,
          points: 1,
          timeLimit: 120,
          isActive: true,
        });
      }
    }

    // Get coding problems with difficulty filtering
    if (codingCount > 0) {
      console.log("Looking for coding problems with criteria:", problemWhere);
      const codingProblems = await prisma.problem.findMany({
        where: problemWhere,
        take: codingCount * 3, // Get more to ensure we have enough after filtering
      });
      console.log(`Found ${codingProblems.length} coding problems`);

      // Separate problems by difficulty
      const easyProblems = codingProblems.filter(
        (p) => p.difficulty.toLowerCase() === "easy"
      );
      const mediumProblems = codingProblems.filter(
        (p) => p.difficulty.toLowerCase() === "medium"
      );
      const hardProblems = codingProblems.filter(
        (p) => p.difficulty.toLowerCase() === "hard"
      );

      // Select problems based on difficulty distribution
      const selectedProblems: any[] = [];

      // Add easy problems
      const shuffledEasy = easyProblems.sort(() => Math.random() - 0.5);
      selectedProblems.push(
        ...shuffledEasy.slice(0, Math.min(easyCount, easyProblems.length))
      );

      // Add medium problems
      const shuffledMedium = mediumProblems.sort(() => Math.random() - 0.5);
      selectedProblems.push(
        ...shuffledMedium.slice(0, Math.min(mediumCount, mediumProblems.length))
      );

      // Add hard problems
      const shuffledHard = hardProblems.sort(() => Math.random() - 0.5);
      selectedProblems.push(
        ...shuffledHard.slice(0, Math.min(hardCount, hardProblems.length))
      );

      // If we don't have enough problems, fill with remaining problems
      if (selectedProblems.length < codingCount) {
        const remainingProblems = codingProblems.filter(
          (p) => !selectedProblems.includes(p)
        );
        const shuffledRemaining = remainingProblems.sort(
          () => Math.random() - 0.5
        );
        selectedProblems.push(
          ...shuffledRemaining.slice(0, codingCount - selectedProblems.length)
        );
      }

      // Shuffle final selection and limit to codingCount
      const finalProblems = selectedProblems
        .sort(() => Math.random() - 0.5)
        .slice(0, codingCount);

      for (const problem of finalProblems) {
        questions.push({
          examId,
          questionType: "Problem",
          questionId: problem.id,
          order: questions.length + 1,
          points: 5,
          timeLimit: 600, // 10 minutes for coding questions
          isActive: true,
        });
      }
    }

    // Get aptitude questions (non-technical) with difficulty filtering
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
        take: aptitudeCount * 3,
      });

      // Separate aptitude questions by difficulty
      const easyAptitude = aptitudeQuestions.filter(
        (q) => q.difficulty.toLowerCase() === "easy"
      );
      const mediumAptitude = aptitudeQuestions.filter(
        (q) => q.difficulty.toLowerCase() === "medium"
      );
      const hardAptitude = aptitudeQuestions.filter(
        (q) => q.difficulty.toLowerCase() === "hard"
      );

      // Select aptitude questions based on difficulty distribution
      const selectedAptitude: any[] = [];

      // Add easy aptitude questions
      const shuffledEasy = easyAptitude.sort(() => Math.random() - 0.5);
      selectedAptitude.push(
        ...shuffledEasy.slice(0, Math.min(easyCount, easyAptitude.length))
      );

      // Add medium aptitude questions
      const shuffledMedium = mediumAptitude.sort(() => Math.random() - 0.5);
      selectedAptitude.push(
        ...shuffledMedium.slice(0, Math.min(mediumCount, mediumAptitude.length))
      );

      // Add hard aptitude questions
      const shuffledHard = hardAptitude.sort(() => Math.random() - 0.5);
      selectedAptitude.push(
        ...shuffledHard.slice(0, Math.min(hardCount, hardAptitude.length))
      );

      // If we don't have enough aptitude questions, fill with remaining questions
      if (selectedAptitude.length < aptitudeCount) {
        const remainingAptitude = aptitudeQuestions.filter(
          (q) => !selectedAptitude.includes(q)
        );
        const shuffledRemaining = remainingAptitude.sort(
          () => Math.random() - 0.5
        );
        selectedAptitude.push(
          ...shuffledRemaining.slice(0, aptitudeCount - selectedAptitude.length)
        );
      }

      // Shuffle final selection and limit to aptitudeCount
      const finalAptitude = selectedAptitude
        .sort(() => Math.random() - 0.5)
        .slice(0, aptitudeCount);

      for (const aptitude of finalAptitude) {
        questions.push({
          examId,
          questionType: "MCQ",
          questionId: aptitude.id,
          order: questions.length + 1,
          points: 1,
          timeLimit: 90,
          isActive: true,
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
    } else {
      console.log(
        "No questions found with specified criteria, adding fallback questions"
      );

      // Fallback: Add some basic questions if none were found
      const fallbackMcqs = await prisma.mCQQuestion.findMany({
        take: Math.min(5, questionCount),
      });

      const fallbackQuestions = fallbackMcqs.map((mcq, index) => ({
        examId,
        questionType: "MCQ",
        questionId: mcq.id,
        order: index + 1,
        points: 1,
        timeLimit: 120,
        isActive: true,
      }));

      if (fallbackQuestions.length > 0) {
        await prisma.examQuestion.createMany({
          data: fallbackQuestions,
        });

        await prisma.exam.update({
          where: { id: examId },
          data: { totalQuestions: fallbackQuestions.length },
        });

        console.log(`Added ${fallbackQuestions.length} fallback questions`);
        return fallbackQuestions.length;
      }
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
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
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
      enableTimedQuestions,
      enableOverallTimer,
      defaultQuestionTime,
      isActive,
      isPublic,
      autoGenerate,
      autoGenerateOptions,
      selectedQuestions,
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
        enableTimedQuestions:
          enableTimedQuestions !== undefined ? enableTimedQuestions : false,
        enableOverallTimer:
          enableOverallTimer !== undefined ? enableOverallTimer : true,
        defaultQuestionTime: parseInt(defaultQuestionTime) || 120,
        isActive: isActive !== undefined ? isActive : true,
        isPublic: isPublic !== undefined ? isPublic : true,
      },
    });

    // Handle selected questions or auto-generate questions
    if (selectedQuestions && selectedQuestions.length > 0) {
      try {
        console.log(
          `Adding ${selectedQuestions.length} selected questions to exam ${exam.id}`
        );

        for (const question of selectedQuestions) {
          if (question.type === "mcq") {
            await prisma.examQuestion.create({
              data: {
                examId: exam.id,
                questionId: question.id,
                questionType: "mcq",
                order: 0, // Will be updated by the exam system
              },
            });
          } else if (question.type === "problem") {
            await prisma.examQuestion.create({
              data: {
                examId: exam.id,
                questionId: question.id,
                questionType: "coding",
                order: 0, // Will be updated by the exam system
              },
            });
          }
        }

        console.log(
          `Successfully added ${selectedQuestions.length} questions to exam ${exam.id}`
        );
      } catch (error) {
        console.error("Error adding selected questions:", error);
        // Continue with exam creation even if adding questions fails
      }
    } else if (autoGenerate && autoGenerateOptions) {
      try {
        const questionsGenerated = await generateExamQuestions(
          exam.id,
          autoGenerateOptions
        );
        console.log(
          `Generated ${questionsGenerated} questions for exam ${exam.id}`
        );
      } catch (error) {
        console.error("Error in auto-generation:", error);
        // Continue with exam creation even if auto-generation fails
      }
    }

    return NextResponse.json({
      success: true,
      data: exam,
      message: "Exam created successfully",
    });
  } catch (error: any) {
    console.error("Error creating exam:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { success: false, error: `Failed to create exam: ${error.message}` },
      { status: 500 }
    );
  }
}

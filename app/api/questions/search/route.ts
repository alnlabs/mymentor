import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const language = searchParams.get("language");
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    console.log("Search params:", {
      language,
      topic,
      difficulty,
      type,
      limit,
      search,
    });

    // Build where clauses for filtering
    const mcqWhere: any = { isActive: true };
    const problemWhere: any = { isActive: true };

    // Language filter (tool field)
    if (language && language !== "All") {
      mcqWhere.tool = language;
      problemWhere.tool = language;
    }

    // Topic filter (category field)
    if (topic && topic !== "General") {
      mcqWhere.category = topic;
      problemWhere.category = topic;
    }

    // Difficulty filter
    if (difficulty) {
      mcqWhere.difficulty = difficulty;
      problemWhere.difficulty = difficulty;
    }

    // Search filter
    if (search) {
      const searchFilter = {
        OR: [
          { question: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
      };
      mcqWhere.OR = searchFilter.OR;
      problemWhere.OR = searchFilter.OR;
    }

    console.log("MCQ where clause:", mcqWhere);
    console.log("Problem where clause:", problemWhere);

    const questions = [];

    // Fetch MCQs if type is "all" or "mcq"
    if (type === "all" || type === "mcq") {
      const mcqQuestions = await prisma.mCQQuestion.findMany({
        where: mcqWhere,
        take: Math.ceil(limit / 2),
        orderBy: { createdAt: "desc" },
      });

      console.log(`Found ${mcqQuestions.length} MCQ questions`);

      questions.push(
        ...mcqQuestions.map((mcq) => ({
          id: mcq.id,
          question: mcq.question,
          type: "mcq" as const,
          difficulty: mcq.difficulty,
          category: mcq.category,
          subject: mcq.subject,
          tool: mcq.tool,
          options: mcq.options ? JSON.parse(mcq.options) : [],
          correctAnswer: mcq.correctAnswer,
          explanation: mcq.explanation,
        }))
      );
    }

    // Fetch problems if type is "all" or "problem"
    if (type === "all" || type === "problem") {
      const problemQuestions = await prisma.problem.findMany({
        where: problemWhere,
        take: Math.ceil(limit / 2),
        orderBy: { createdAt: "desc" },
      });

      console.log(`Found ${problemQuestions.length} problem questions`);

      questions.push(
        ...problemQuestions.map((problem) => ({
          id: problem.id,
          title: problem.title,
          content: problem.description,
          type: "problem" as const,
          difficulty: problem.difficulty,
          category: problem.category,
          subject: problem.subject,
          tool: problem.tool,
        }))
      );
    }

    // Shuffle the questions to mix MCQs and problems
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    console.log(`Total questions found: ${shuffledQuestions.length}`);

    return NextResponse.json({
      success: true,
      data: shuffledQuestions,
      total: shuffledQuestions.length,
    });
  } catch (error) {
    console.error("Error searching questions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

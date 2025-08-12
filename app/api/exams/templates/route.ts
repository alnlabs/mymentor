import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get real exam data to create dynamic templates
    const [exams, problems, mcqs] = await Promise.all([
      prisma.exam.findMany({
        include: {
          questions: true,
        },
      }),
      prisma.problem.findMany({
        select: {
          category: true,
          difficulty: true,
        },
      }),
      prisma.mCQQuestion.findMany({
        select: {
          category: true,
          difficulty: true,
        },
      }),
    ]);

    // Analyze existing data to create relevant templates
    const categoryStats = new Map<
      string,
      { count: number; difficulties: Set<string> }
    >();

    // Analyze problems
    problems.forEach((problem) => {
      if (problem.category) {
        if (!categoryStats.has(problem.category)) {
          categoryStats.set(problem.category, {
            count: 0,
            difficulties: new Set(),
          });
        }
        const stats = categoryStats.get(problem.category)!;
        stats.count++;
        if (problem.difficulty) stats.difficulties.add(problem.difficulty);
      }
    });

    // Analyze MCQs
    mcqs.forEach((mcq) => {
      if (mcq.category) {
        if (!categoryStats.has(mcq.category)) {
          categoryStats.set(mcq.category, {
            count: 0,
            difficulties: new Set(),
          });
        }
        const stats = categoryStats.get(mcq.category)!;
        stats.count++;
        if (mcq.difficulty) stats.difficulties.add(mcq.difficulty);
      }
    });

    // Create dynamic templates based on available content
    const templates = [];

    // Technical Templates
    if (categoryStats.has("Programming") || categoryStats.has("JavaScript")) {
      templates.push({
        id: "js-fundamentals",
        title: "JavaScript Fundamentals",
        description:
          "Basic JavaScript concepts, syntax, and programming logic for fresh graduates",
        category: "Programming",
        difficulty: "Easy",
        duration: 45,
        questionTypes: "Mixed",
        totalQuestions: Math.min(
          15,
          (categoryStats.get("Programming")?.count || 0) +
            (categoryStats.get("JavaScript")?.count || 0)
        ),
        passingScore: 65,
        defaultQuestionTime: 120,
        targetRole: "Frontend Developer",
        tags: ["JavaScript", "ES6", "DOM", "Functions", "Arrays"],
        icon: "💻",
        color: "from-blue-500 to-cyan-500",
      });
    }

    if (
      categoryStats.has("Web Development") ||
      categoryStats.has("HTML") ||
      categoryStats.has("CSS")
    ) {
      templates.push({
        id: "web-basics",
        title: "Web Development Basics",
        description:
          "HTML, CSS, and basic web concepts for entry-level developers",
        category: "Web Development",
        difficulty: "Easy",
        duration: 60,
        questionTypes: "Mixed",
        totalQuestions: Math.min(
          20,
          (categoryStats.get("Web Development")?.count || 0) +
            (categoryStats.get("HTML")?.count || 0) +
            (categoryStats.get("CSS")?.count || 0)
        ),
        passingScore: 60,
        defaultQuestionTime: 180,
        targetRole: "Frontend Developer",
        tags: ["HTML", "CSS", "Responsive Design", "Web Standards"],
        icon: "🌐",
        color: "from-green-500 to-emerald-500",
      });
    }

    if (
      categoryStats.has("Data Structures") ||
      categoryStats.has("Algorithms")
    ) {
      templates.push({
        id: "data-structures",
        title: "Data Structures & Algorithms",
        description:
          "Fundamental data structures and basic algorithms for technical interviews",
        category: "Data Structures",
        difficulty: "Medium",
        duration: 90,
        questionTypes: "Mixed",
        totalQuestions: Math.min(
          25,
          (categoryStats.get("Data Structures")?.count || 0) +
            (categoryStats.get("Algorithms")?.count || 0)
        ),
        passingScore: 70,
        defaultQuestionTime: 240,
        targetRole: "Software Engineer",
        tags: ["Arrays", "Linked Lists", "Trees", "Sorting", "Searching"],
        icon: "🔗",
        color: "from-purple-500 to-pink-500",
      });
    }

    if (categoryStats.has("Database") || categoryStats.has("SQL")) {
      templates.push({
        id: "sql-basics",
        title: "SQL & Database Fundamentals",
        description: "Basic SQL queries, database concepts, and data modeling",
        category: "Database",
        difficulty: "Easy",
        duration: 45,
        questionTypes: "MCQ",
        totalQuestions: Math.min(
          15,
          (categoryStats.get("Database")?.count || 0) +
            (categoryStats.get("SQL")?.count || 0)
        ),
        passingScore: 65,
        defaultQuestionTime: 120,
        targetRole: "Backend Developer",
        tags: ["SQL", "MySQL", "Database Design", "Queries"],
        icon: "🗄️",
        color: "from-orange-500 to-red-500",
      });
    }

    // Non-Technical Templates
    if (
      categoryStats.has("Aptitude") ||
      categoryStats.has("Numerical") ||
      categoryStats.has("Verbal")
    ) {
      templates.push({
        id: "aptitude-basic",
        title: "Basic Aptitude Test",
        description:
          "Numerical, verbal, and logical reasoning for general aptitude assessment",
        category: "Aptitude",
        difficulty: "Easy",
        duration: 60,
        questionTypes: "MCQ",
        totalQuestions: Math.min(
          30,
          (categoryStats.get("Aptitude")?.count || 0) +
            (categoryStats.get("Numerical")?.count || 0) +
            (categoryStats.get("Verbal")?.count || 0)
        ),
        passingScore: 60,
        defaultQuestionTime: 90,
        targetRole: "Business Analyst",
        tags: ["Numerical", "Verbal", "Logical", "Reasoning"],
        icon: "🧠",
        color: "from-indigo-500 to-purple-500",
      });
    }

    if (categoryStats.has("Communication") || categoryStats.has("English")) {
      templates.push({
        id: "communication",
        title: "Business Communication",
        description:
          "English language skills, business writing, and professional communication",
        category: "Business Communication",
        difficulty: "Medium",
        duration: 45,
        questionTypes: "MCQ",
        totalQuestions: Math.min(
          20,
          (categoryStats.get("Communication")?.count || 0) +
            (categoryStats.get("English")?.count || 0)
        ),
        passingScore: 70,
        defaultQuestionTime: 120,
        targetRole: "Marketing Executive",
        tags: ["English", "Writing", "Communication", "Business"],
        icon: "💬",
        color: "from-teal-500 to-cyan-500",
      });
    }

    if (categoryStats.has("Problem Solving") || categoryStats.has("Logic")) {
      templates.push({
        id: "problem-solving",
        title: "Problem Solving & Critical Thinking",
        description:
          "Analytical thinking, decision making, and problem-solving scenarios",
        category: "Problem Solving",
        difficulty: "Medium",
        duration: 75,
        questionTypes: "Mixed",
        totalQuestions: Math.min(
          25,
          (categoryStats.get("Problem Solving")?.count || 0) +
            (categoryStats.get("Logic")?.count || 0)
        ),
        passingScore: 65,
        defaultQuestionTime: 180,
        targetRole: "Project Manager",
        tags: ["Analytical", "Decision Making", "Critical Thinking"],
        icon: "🎯",
        color: "from-yellow-500 to-orange-500",
      });
    }

    if (categoryStats.has("Leadership") || categoryStats.has("Management")) {
      templates.push({
        id: "leadership",
        title: "Leadership & Team Management",
        description:
          "Leadership skills, team dynamics, and project management concepts",
        category: "Leadership",
        difficulty: "Medium",
        duration: 60,
        questionTypes: "MCQ",
        totalQuestions: Math.min(
          20,
          (categoryStats.get("Leadership")?.count || 0) +
            (categoryStats.get("Management")?.count || 0)
        ),
        passingScore: 70,
        defaultQuestionTime: 150,
        targetRole: "Project Manager",
        tags: ["Leadership", "Team Management", "Project Management"],
        icon: "👥",
        color: "from-rose-500 to-pink-500",
      });
    }

    // If no templates can be created from existing data, provide default templates
    if (templates.length === 0) {
      templates.push(
        {
          id: "basic-programming",
          title: "Basic Programming Concepts",
          description: "Fundamental programming concepts and logic",
          category: "Programming",
          difficulty: "Easy",
          duration: 45,
          questionTypes: "Mixed",
          totalQuestions: 15,
          passingScore: 65,
          defaultQuestionTime: 120,
          targetRole: "Junior Developer",
          tags: ["Programming", "Logic", "Basics"],
          icon: "💻",
          color: "from-blue-500 to-cyan-500",
        },
        {
          id: "general-aptitude",
          title: "General Aptitude Test",
          description: "Basic aptitude and reasoning skills",
          category: "Aptitude",
          difficulty: "Easy",
          duration: 60,
          questionTypes: "MCQ",
          totalQuestions: 30,
          passingScore: 60,
          defaultQuestionTime: 90,
          targetRole: "General",
          tags: ["Aptitude", "Reasoning", "General"],
          icon: "🧠",
          color: "from-indigo-500 to-purple-500",
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error: any) {
    console.error("Error fetching exam templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam templates" },
      { status: 500 }
    );
  }
}

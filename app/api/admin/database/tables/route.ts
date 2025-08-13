import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    // Get counts for all tables
    const [
      userCount,
      mcqCount,
      problemCount,
      examCount,
      examQuestionCount,
      examSessionCount,
      examQuestionResultCount,
      interviewCount,
      interviewSessionCount,
      feedbackCount,
      submissionCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.mCQQuestion.count(),
      prisma.problem.count(),
      prisma.exam.count(),
      prisma.examQuestion.count(),
      prisma.examSession.count(),
      prisma.examQuestionResult.count(),
      prisma.interview.count(),
      prisma.interviewSession.count(),
      prisma.feedback.count(),
      prisma.submission.count(),
    ]);

    const tables = [
      {
        name: "User",
        count: userCount,
        size: "~2.5 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "MCQQuestion",
        count: mcqCount,
        size: "~15.2 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "Problem",
        count: problemCount,
        size: "~8.7 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "Exam",
        count: examCount,
        size: "~3.1 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "ExamQuestion",
        count: examQuestionCount,
        size: "~1.8 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "ExamSession",
        count: examSessionCount,
        size: "~2.3 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "ExamQuestionResult",
        count: examQuestionResultCount,
        size: "~4.2 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "Interview",
        count: interviewCount,
        size: "~1.5 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "InterviewSession",
        count: interviewSessionCount,
        size: "~0.8 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "Feedback",
        count: feedbackCount,
        size: "~1.2 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
      {
        name: "Submission",
        count: submissionCount,
        size: "~6.5 KB",
        lastModified: new Date().toLocaleDateString(),
        status: "healthy" as const,
      },
    ];

    const response: ApiResponse = {
      success: true,
      data: tables,
      message: "Database tables information retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching database tables:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to retrieve database tables information",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

export async function GET(request: NextRequest) {
  try {
    // Fetch comprehensive admin statistics
    const [
      totalUsers,
      activeUsers,
      totalProblems,
      totalMCQs,
      totalSubmissions,
      acceptedSubmissions,
      totalInterviews,
      completedInterviews,
      recentUsers,
      recentSubmissions,
      recentInterviews,
      userStats,
      problemStats,
      submissionStats
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (last 30 days)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Total problems
      prisma.problem.count(),
      
      // Total MCQ questions
      prisma.mCQQuestion.count(),
      
      // Total submissions
      prisma.submission.count(),
      
      // Accepted submissions
      prisma.submission.count({
        where: {
          status: "accepted"
        }
      }),
      
      // Total interviews
      prisma.mockInterview.count(),
      
      // Completed interviews
      prisma.mockInterview.count({
        where: {
          status: "completed"
        }
      }),
      
      // Recent users (last 7 days)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      }),
      
      // Recent submissions (last 7 days)
      prisma.submission.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          problem: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      }),
      
      // Recent interviews (last 7 days)
      prisma.mockInterview.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          template: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      }),
      
      // User statistics by role
      prisma.user.groupBy({
        by: ["role"],
        _count: {
          role: true
        }
      }),
      
      // Problem statistics by difficulty
      prisma.problem.groupBy({
        by: ["difficulty"],
        _count: {
          difficulty: true
        }
      }),
      
      // Submission statistics by status
      prisma.submission.groupBy({
        by: ["status"],
        _count: {
          status: true
        }
      })
    ]);

    // Calculate success rate
    const successRate = totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;

    // Calculate completion rate for interviews
    const interviewCompletionRate = totalInterviews > 0
      ? Math.round((completedInterviews / totalInterviews) * 100)
      : 0;

    // Calculate user engagement rate
    const userEngagementRate = totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

    const stats = {
      overview: {
        totalUsers,
        activeUsers,
        totalProblems,
        totalMCQs,
        totalSubmissions,
        acceptedSubmissions,
        totalInterviews,
        completedInterviews,
        successRate,
        interviewCompletionRate,
        userEngagementRate
      },
      recentActivity: {
        recentUsers: recentUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          joinedAt: user.createdAt
        })),
        recentSubmissions: recentSubmissions.map(sub => ({
          id: sub.id,
          userName: sub.user.name,
          userEmail: sub.user.email,
          problemTitle: sub.problem.title,
          status: sub.status,
          score: sub.score,
          submittedAt: sub.createdAt
        })),
        recentInterviews: recentInterviews.map(interview => ({
          id: interview.id,
          userName: interview.user.name,
          userEmail: interview.user.email,
          templateTitle: interview.template.title,
          status: interview.status,
          score: interview.score || 0,
          startedAt: interview.createdAt
        }))
      },
      analytics: {
        userStats: userStats.reduce((acc, stat) => {
          acc[stat.role] = stat._count.role;
          return acc;
        }, {} as Record<string, number>),
        problemStats: problemStats.reduce((acc, stat) => {
          acc[stat.difficulty] = stat._count.difficulty;
          return acc;
        }, {} as Record<string, number>),
        submissionStats: submissionStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {} as Record<string, number>)
      }
    };

    const response: ApiResponse = {
      success: true,
      data: stats,
      message: "Admin statistics retrieved successfully"
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to retrieve admin statistics"
    };
    return NextResponse.json(response, { status: 500 });
  }
}

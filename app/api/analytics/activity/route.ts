import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get recent activity from various sources
    const [recentSubmissions, recentUsers, recentProblems, recentMCQs] = await Promise.all([
      // Recent submissions
      prisma.submission.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        include: {
          user: {
            select: { name: true, email: true }
          },
          problem: {
            select: { title: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      // Recent user registrations
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }),
      // Recent problem uploads
      prisma.problem.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }),
      // Recent MCQ uploads
      prisma.mCQQuestion.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      })
    ]);

    const activities: any[] = [];

    // Add submission activities
    recentSubmissions.forEach(submission => {
      activities.push({
        type: "submission",
        description: `User ${submission.user?.name || 'Anonymous'} solved problem: "${submission.problem?.title || 'Unknown Problem'}"`,
        time: formatTimeAgo(submission.createdAt),
        timestamp: submission.createdAt
      });
    });

    // Add user registration activities
    recentUsers.forEach(user => {
      activities.push({
        type: "user",
        description: `New user registered: ${user.email}`,
        time: formatTimeAgo(user.createdAt),
        timestamp: user.createdAt
      });
    });

    // Add problem upload activities
    recentProblems.forEach(problem => {
      activities.push({
        type: "upload",
        description: `New problem uploaded: "${problem.title}"`,
        time: formatTimeAgo(problem.createdAt),
        timestamp: problem.createdAt
      });
    });

    // Add MCQ upload activities
    recentMCQs.forEach(mcq => {
      activities.push({
        type: "mcq",
        description: `New MCQ uploaded: "${mcq.question}"`,
        time: formatTimeAgo(mcq.createdAt),
        timestamp: mcq.createdAt
      });
    });

    // Sort by timestamp and take top 10
    const recentActivity = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(({ timestamp, ...activity }) => activity);

    return NextResponse.json({
      success: true,
      data: recentActivity
    });
  } catch (error: any) {
    console.error("Error fetching activity analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activity analytics" },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

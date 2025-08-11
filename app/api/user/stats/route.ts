import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Fetch user statistics
    const [
      problemsSolved,
      mcqCompleted,
      interviewsTaken,
      totalSubmissions,
      recentActivity
    ] = await Promise.all([
      // Problems solved (submissions with success status)
      prisma.submission.count({
        where: {
          userId: userId,
          status: 'accepted'
        }
      }),
      
      // MCQ questions completed
      prisma.userProgress.count({
        where: {
          userId: userId,
          questionType: 'mcq',
          status: 'completed'
        }
      }),
      
      // Mock interviews taken
      prisma.mockInterview.count({
        where: {
          userId: userId,
          status: 'completed'
        }
      }),
      
      // Total submissions
      prisma.submission.count({
        where: {
          userId: userId
        }
      }),
      
      // Recent activity (last 7 days)
      prisma.submission.findMany({
        where: {
          userId: userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        include: {
          problem: {
            select: {
              title: true
            }
          }
        }
      })
    ]);

    // Calculate success rate
    const successRate = totalSubmissions > 0 
      ? Math.round((problemsSolved / totalSubmissions) * 100)
      : 0;

    const stats = {
      problemsSolved,
      mcqCompleted,
      interviewsTaken,
      totalSubmissions,
      successRate,
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        problemTitle: activity.problem.title,
        status: activity.status,
        score: activity.score,
        createdAt: activity.createdAt
      }))
    };

    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'User statistics retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve user statistics'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';
import { executeJavaScriptCode, validateCode } from '@/shared/utils/codeExecution';

export async function GET(request: NextRequest) {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response: ApiResponse = {
      success: true,
      data: submissions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch submissions',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemId, code, language, userId } = body;

    if (!problemId || !code || !language || !userId) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Get problem details for test cases
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      const response: ApiResponse = {
        success: false,
        error: 'Problem not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Validate code syntax
    const validation = validateCode(code);
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        error: `Code validation failed: ${validation.error}`,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Execute code with test cases
    const testCases = JSON.parse(problem.testCases);
    const testResults = executeJavaScriptCode(code, testCases);
    
    const passedTests = testResults.filter(result => result.passed).length;
    const totalTests = testResults.length;
    const status = passedTests === totalTests ? 'accepted' : 'wrong_answer';

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        code,
        language,
        executionTime: 0, // Will be implemented with proper timing
        testResults: JSON.stringify(testResults),
        status,
      },
    });

    // Update user progress - check if exists first
    const existingProgress = await prisma.userProgress.findFirst({
      where: {
        userId,
        problemId,
        questionType: 'coding',
      },
    });

    if (existingProgress) {
      // Update existing progress
      await prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          status: status === 'accepted' ? 'completed' : 'failed',
          score: status === 'accepted' ? 100 : 0,
          completedAt: status === 'accepted' ? new Date() : undefined,
        },
      });
    } else {
      // Create new progress
      await prisma.userProgress.create({
        data: {
          userId,
          problemId,
          questionType: 'coding',
          status: status === 'accepted' ? 'completed' : 'failed',
          score: status === 'accepted' ? 100 : 0,
          completedAt: status === 'accepted' ? new Date() : undefined,
        },
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        submission,
        testResults,
        status,
        passedTests,
        totalTests,
      },
      message: 'Submission processed successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Submission error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to process submission',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

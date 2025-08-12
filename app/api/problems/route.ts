import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');

    const where: any = { isActive: true };
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;

    const problems = await prisma.problem.findMany({
      where,
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Transform the data to match frontend expectations
    const transformedProblems = problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      subject: problem.subject,
      topic: problem.topic,
      tool: problem.tool,
      technologyStack: problem.technologyStack,
      domain: problem.domain,
      skillLevel: problem.skillLevel,
      jobRole: problem.jobRole,
      companyType: problem.companyType,
      interviewType: problem.interviewType,
      testCases: problem.testCases,
      solution: problem.solution,
      hints: problem.hints,
      tags: problem.tags,
      companies: problem.companies,
      priority: problem.priority,
      status: problem.status,
      isActive: problem.isActive,
      createdAt: problem.createdAt.toISOString(),
      updatedAt: problem.updatedAt.toISOString(),
      _count: problem._count,
    }));

    const response: ApiResponse = {
      success: true,
      data: transformedProblems,
      message: 'Problems retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve problems',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

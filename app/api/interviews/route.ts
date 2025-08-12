import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const interviews = await prisma.mockInterview.findMany({
      where,
      include: {
        template: true,
        answers: {
          include: {
            question: true
          }
        },
        feedback: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: interviews.map(interview => ({
        ...interview,
        template: interview.template ? {
          ...interview.template,
          companies: interview.template.companies ? JSON.parse(interview.template.companies) : []
        } : null,
        answers: interview.answers.map(answer => ({
          ...answer,
          question: answer.question ? {
            ...answer.question,
            options: answer.question.options ? JSON.parse(answer.question.options) : []
          } : null
        }))
      }))
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, templateId, scheduledAt } = body;

    // Validate required fields
    if (!userId || !templateId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Template ID are required' },
        { status: 400 }
      );
    }

    // Get template to calculate max score
    const template = await prisma.interviewTemplate.findUnique({
      where: { id: templateId },
      include: {
        questions: {
          where: { isActive: true }
        }
      }
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    const maxScore = template.questions.reduce((sum, q) => sum + q.points, 0);

    // Create interview
    const interview = await prisma.mockInterview.create({
      data: {
        userId,
        templateId,
        status: scheduledAt ? 'scheduled' : 'in_progress',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        startedAt: scheduledAt ? null : new Date(),
        maxScore
      },
      include: {
        template: {
          include: {
            questions: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...interview,
        template: interview.template ? {
          ...interview.template,
          companies: interview.template.companies ? JSON.parse(interview.template.companies) : [],
          questions: interview.template.questions.map(q => ({
            ...q,
            options: q.options ? JSON.parse(q.options) : []
          }))
        } : null
      }
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}

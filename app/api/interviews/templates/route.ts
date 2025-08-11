import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';

export async function GET() {
  try {
    const templates = await prisma.interviewTemplate.findMany({
      where: { isActive: true },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: templates.map(template => ({
        ...template,
        companies: template.companies ? JSON.parse(template.companies) : [],
        questions: template.questions.map(q => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : []
        }))
      }))
    });
  } catch (error) {
    console.error('Error fetching interview templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interview templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, duration, difficulty, category, companies, questions } = body;

    // Validate required fields
    if (!name || !description || !duration || !difficulty || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create template
    const template = await prisma.interviewTemplate.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        difficulty,
        category,
        companies: companies ? JSON.stringify(companies) : null
      }
    });

    // Create questions if provided
    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        await prisma.interviewQuestion.create({
          data: {
            templateId: template.id,
            questionType: question.questionType,
            question: question.question,
            options: question.options ? JSON.stringify(question.options) : null,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            points: question.points || 10,
            timeLimit: question.timeLimit,
            order: i
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        companies: companies || []
      }
    });
  } catch (error) {
    console.error('Error creating interview template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create interview template' },
      { status: 500 }
    );
  }
}

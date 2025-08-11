import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.interviewTemplate.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        companies: template.companies ? JSON.parse(template.companies) : [],
        questions: template.questions.map(q => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : []
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, duration, difficulty, category, companies, isActive } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (duration) updateData.duration = parseInt(duration);
    if (difficulty) updateData.difficulty = difficulty;
    if (category) updateData.category = category;
    if (companies) updateData.companies = JSON.stringify(companies);
    if (isActive !== undefined) updateData.isActive = isActive;

    const template = await prisma.interviewTemplate.update({
      where: { id: params.id },
      data: updateData,
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        companies: template.companies ? JSON.parse(template.companies) : [],
        questions: template.questions.map(q => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : []
        }))
      }
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if template exists
    const template = await prisma.interviewTemplate.findUnique({
      where: { id: params.id },
      include: {
        questions: true,
        mockInterviews: true
      }
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    // Check if template has any interviews
    if (template.mockInterviews.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete template with existing interviews' },
        { status: 400 }
      );
    }

    // Delete questions first
    await prisma.interviewQuestion.deleteMany({
      where: { templateId: params.id }
    });

    // Delete the template
    await prisma.interviewTemplate.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}

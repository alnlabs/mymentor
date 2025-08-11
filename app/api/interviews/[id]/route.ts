import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interview = await prisma.mockInterview.findUnique({
      where: { id: params.id },
      include: {
        template: {
          include: {
            questions: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          }
        },
        answers: {
          include: {
            question: true
          }
        },
        feedback: true
      }
    });

    if (!interview) {
      return NextResponse.json(
        { success: false, error: 'Interview not found' },
        { status: 404 }
      );
    }

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
        } : null,
        answers: interview.answers.map(answer => ({
          ...answer,
          question: answer.question ? {
            ...answer.question,
            options: answer.question.options ? JSON.parse(answer.question.options) : []
          } : null
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interview' },
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
    const { status, totalScore, notes, answers } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (totalScore !== undefined) updateData.totalScore = totalScore;
    if (notes !== undefined) updateData.notes = notes;

    // Update interview status timestamps
    if (status === 'in_progress' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    } else if (status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const interview = await prisma.mockInterview.update({
      where: { id: params.id },
      data: updateData,
      include: {
        template: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    // Update answers if provided
    if (answers && Array.isArray(answers)) {
      for (const answer of answers) {
        if (answer.id) {
          // Update existing answer
          await prisma.interviewAnswer.update({
            where: { id: answer.id },
            data: {
              answer: answer.answer,
              selectedOption: answer.selectedOption,
              isCorrect: answer.isCorrect,
              score: answer.score,
              timeSpent: answer.timeSpent,
              feedback: answer.feedback
            }
          });
        } else {
          // Create new answer
          await prisma.interviewAnswer.create({
            data: {
              interviewId: params.id,
              questionId: answer.questionId,
              answer: answer.answer,
              selectedOption: answer.selectedOption,
              isCorrect: answer.isCorrect,
              score: answer.score,
              timeSpent: answer.timeSpent,
              feedback: answer.feedback
            }
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...interview,
        template: interview.template ? {
          ...interview.template,
          companies: interview.template.companies ? JSON.parse(interview.template.companies) : []
        } : null
      }
    });
  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update interview' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete related records first
    await prisma.interviewAnswer.deleteMany({
      where: { interviewId: params.id }
    });

    await prisma.interviewFeedback.deleteMany({
      where: { interviewId: params.id }
    });

    // Delete the interview
    await prisma.mockInterview.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete interview' },
      { status: 500 }
    );
  }
}

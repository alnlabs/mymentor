import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/database';
import { ApiResponse } from '@/shared/types/common';

// Generate unique ID based on title/question
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 50) // Limit length
    + '-' + Date.now().toString().slice(-6); // Add timestamp
}

// Check for duplicate content
async function checkDuplicateContent(type: string, content: string): Promise<boolean> {
  if (type === 'problems') {
    const existing = await prisma.problem.findFirst({
      where: {
        title: {
          equals: content,
          mode: 'insensitive', // Case-insensitive comparison
        },
      },
    });
    return !!existing;
  } else if (type === 'mcq') {
    const existing = await prisma.mCQQuestion.findFirst({
      where: {
        question: {
          equals: content,
          mode: 'insensitive', // Case-insensitive comparison
        },
      },
    });
    return !!existing;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data || !Array.isArray(data)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid data format',
      };
      return NextResponse.json(response, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    let errors: string[] = [];
    let duplicates: string[] = [];

    if (type === 'problems') {
      for (const problem of data) {
        try {
          // Check for duplicate title
          const isDuplicate = await checkDuplicateContent('problems', problem.title);
          
          if (isDuplicate) {
            duplicates.push(`Problem "${problem.title}" already exists`);
            skipped++;
            continue;
          }

          // Generate unique ID if not provided
          const problemId = problem.id || generateId(problem.title);
          
          await prisma.problem.create({
            data: {
              id: problemId,
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              category: problem.category,
              testCases: problem.testCases,
              solution: problem.solution,
              hints: problem.hints,
              tags: problem.tags,
              companies: problem.companies,
              isActive: true,
            },
          });
          imported++;
        } catch (error) {
          errors.push(`Failed to import problem "${problem.title}": ${error}`);
        }
      }
    } else if (type === 'mcq') {
      for (const question of data) {
        try {
          // Check for duplicate question
          const isDuplicate = await checkDuplicateContent('mcq', question.question);
          
          if (isDuplicate) {
            duplicates.push(`MCQ "${question.question.substring(0, 50)}..." already exists`);
            skipped++;
            continue;
          }

          // Generate unique ID if not provided
          const questionId = question.id || generateId(question.question);
          
          await prisma.mCQQuestion.create({
            data: {
              id: questionId,
              question: question.question,
              options: question.options,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              category: question.category,
              difficulty: question.difficulty,
              tags: question.tags,
              companies: question.companies,
              isActive: true,
            },
          });
          imported++;
        } catch (error) {
          errors.push(`Failed to import MCQ "${question.question}": ${error}`);
        }
      }
    } else {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid type. Use "problems" or "mcq"',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        imported,
        skipped,
        errors,
        duplicates,
        type,
      },
      message: `Import completed: ${imported} imported, ${skipped} skipped (duplicates), ${errors.length} errors`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Upload error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to upload data',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

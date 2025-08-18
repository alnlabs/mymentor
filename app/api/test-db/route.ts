import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Test DB request received:", body);
    
    // Try to create a simple MCQ question
    const testQuestion = await prisma.mCQQuestion.create({
      data: {
        question: "Test question for debugging",
        options: JSON.stringify(["A", "B", "C", "D"]),
        correctAnswer: 0,
        explanation: "Test explanation",
        category: "Test",
        topic: "Test",
        tool: "JavaScript",
        difficulty: "easy",
        skillLevel: "beginner",
        status: "active",
      },
    });
    
    console.log("Test question created successfully:", testQuestion.id);
    
    // Delete the test question
    await prisma.mCQQuestion.delete({
      where: { id: testQuestion.id },
    });
    
    console.log("Test question deleted successfully");
    
    return NextResponse.json({
      success: true,
      message: "Database test successful",
      testQuestionId: testQuestion.id,
    });
  } catch (error: any) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get category statistics from problems and MCQs
    const [problemCategories, mcqCategories] = await Promise.all([
      prisma.problem.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      }),
      prisma.mCQQuestion.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      })
    ]);

    // Combine and aggregate categories
    const categoryMap = new Map<string, number>();

    // Add problem categories
    problemCategories.forEach(cat => {
      if (cat.category) {
        categoryMap.set(cat.category, (categoryMap.get(cat.category) || 0) + cat._count.category);
      }
    });

    // Add MCQ categories
    mcqCategories.forEach(cat => {
      if (cat.category) {
        categoryMap.set(cat.category, (categoryMap.get(cat.category) || 0) + cat._count.category);
      }
    });

    // Convert to array and sort by count
    const topCategories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 categories

    return NextResponse.json({
      success: true,
      data: topCategories
    });
  } catch (error: any) {
    console.error("Error fetching category analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category analytics" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, access } from "fs/promises";
import { join } from "path";

// POST - Export generated questions to seeds folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, language, topic } = body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "No questions provided" },
        { status: 400 }
      );
    }

    if (!language || !topic) {
      return NextResponse.json(
        { success: false, error: "Language and topic are required" },
        { status: 400 }
      );
    }

    // Map language to folder name
    const languageMap: { [key: string]: string } = {
      Java: "java",
      JavaScript: "javascript",
      Python: "python",
      React: "javascript", // React questions go to javascript folder
    };

    const folderName = languageMap[language] || language.toLowerCase();
    const seedsPath = join(process.cwd(), "data", "seeds", folderName);
    const fileName = `${folderName}-mcq.json`;
    const filePath = join(seedsPath, fileName);

    // Check if file exists and read existing content
    let existingData: {
      category: string;
      language: string;
      concepts: Array<{
        name: string;
        difficulty: string;
        questions: any[];
      }>;
    } = {
      category: folderName,
      language: language,
      concepts: [],
    };

    try {
      const existingContent = await readFile(filePath, "utf-8");
      existingData = JSON.parse(existingContent);
    } catch (error) {
      // File doesn't exist, use default structure
      console.log(`Creating new file: ${fileName}`);
    }

    // Convert generated questions to the expected format
    const formattedQuestions = questions.map((q: any, index: number) => ({
      id: `${folderName}-${topic.toLowerCase().replace(/\s+/g, "-")}-${
        index + 1
      }`,
      question: q.question,
      options: JSON.stringify(q.options),
      correctAnswer: q.options.indexOf(q.correctAnswer), // Convert to index
      explanation: q.explanation || "",
      tags: JSON.stringify(q.tags || []),
      companies: JSON.stringify(q.companies || []),
      difficulty: q.difficulty || "intermediate",
    }));

    // Check if concept already exists
    const existingConceptIndex = existingData.concepts.findIndex(
      (c: any) => c.name.toLowerCase() === topic.toLowerCase()
    );

    if (existingConceptIndex >= 0) {
      // Append questions to existing concept
      existingData.concepts[existingConceptIndex].questions.push(
        ...formattedQuestions
      );
    } else {
      // Add new concept
      existingData.concepts.push({
        name: topic,
        difficulty: questions[0]?.difficulty || "intermediate",
        questions: formattedQuestions,
      });
    }

    // Write the updated file
    await writeFile(filePath, JSON.stringify(existingData, null, 2), "utf-8");

    // Log the export for analytics
    console.log(`✅ Exported ${questions.length} questions to ${filePath}`);

    return NextResponse.json({
      success: true,
      exportedCount: questions.length,
      filePath: fileName,
      message: `Successfully exported ${questions.length} questions to ${fileName}`,
    });
  } catch (error: any) {
    console.error("Error exporting to seeds:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export questions to seeds folder" },
      { status: 500 }
    );
  }
}

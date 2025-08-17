import { NextRequest, NextResponse } from "next/server";
import {
  AIGenerationRequest,
  AIGenerationResponse,
  GeneratedContent,
} from "@/shared/lib/aiService";

// Mock AI generation function - replace with actual AI service integration
async function generateWithAI(
  request: AIGenerationRequest
): Promise<GeneratedContent[]> {
  try {
    console.log(
      "generateWithAI called with:",
      JSON.stringify(request, null, 2)
    );

    // This is a mock implementation - replace with actual AI service
    const {
      type,
      language = "JavaScript",
      topic = "General",
      difficulty = "intermediate",
      count = 5,
    } = request;

    const generatedContent: GeneratedContent[] = [];

    // Simplified content generation to avoid template string issues
    for (let i = 0; i < count; i++) {
      const id = `ai-generated-${type}-${Date.now()}-${i}`;

      switch (type) {
        case "mcq":
          generatedContent.push({
            id,
            type: "question",
            title: `${language} ${topic} MCQ ${i + 1}`,
            content: `What is the output of the following ${language} code?\n\n\`\`\`${language.toLowerCase()}\n// ${topic} example\nconsole.log("Hello World");\n\`\`\``,
            difficulty,
            category: topic,
            language,
            options: [
              "Hello World",
              "Error",
              "Undefined",
              "None of the above"
            ],
            correctAnswer: "Hello World",
            explanation: `This question tests understanding of ${topic} in ${language}.`,
            tags: [language, topic, difficulty],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.85,
            },
          });
          break;

        case "problem":
          generatedContent.push({
            id,
            type: "problem",
            title: `${language} ${topic} Problem ${i + 1}`,
            content: `Write a function to solve the following problem:\n\n**Problem Description:**\nCreate a ${topic.toLowerCase()} solution in ${language}.\n\n**Requirements:**\n- Implement using modern ${language} features\n- Handle edge cases and errors gracefully\n- Include proper documentation`,
            difficulty,
            category: topic,
            language,
            explanation: `This problem tests implementation skills for ${topic} in ${language}.`,
            tags: [language, topic, difficulty, "coding"],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.9,
            },
          });
          break;

        case "exam":
          generatedContent.push({
            id,
            type: "question",
            title: `Comprehensive ${language} ${topic} Exam Question ${i + 1}`,
            content: `**Exam Question:**\n\nExplain the concept of ${topic.toLowerCase()} in ${language} and provide practical examples. Include:\n\n1. Definition and purpose\n2. Syntax and usage\n3. Common pitfalls\n4. Best practices\n\nProvide code examples to support your explanation.`,
            difficulty,
            category: topic,
            language,
            explanation: `This exam question tests comprehensive understanding of ${topic} in ${language}.`,
            tags: [language, topic, difficulty, "exam"],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.88,
            },
          });
          break;

        case "interview":
          generatedContent.push({
            id,
            type: "interview_question",
            title: `Senior ${language} ${topic} Interview Question ${i + 1}`,
            content: `**Interview Question:**\n\nHow would you design a system to handle ${topic.toLowerCase()} in ${language}? Consider:\n\n- Scalability requirements\n- Performance optimization\n- Error handling and resilience\n- Testing strategies\n- Deployment considerations\n\nWalk through your design process and justify your decisions.`,
            difficulty,
            category: topic,
            language,
            explanation: `This interview question assesses system design skills for ${topic} in ${language}.`,
            tags: [language, topic, difficulty, "interview"],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.87,
            },
          });
          break;
      }
    }

    console.log(
      "Generated content successfully:",
      generatedContent.length,
      "items"
    );
    return generatedContent;
  } catch (error) {
    console.error("Error in generateWithAI:", error);
    throw error;
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<AIGenerationResponse>> {
  try {
    console.log("AI generation request received");

    const body: AIGenerationRequest = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Validate request
    if (!body.type) {
      console.log("Validation failed: Content type is required");
      return NextResponse.json(
        {
          success: false,
          error: "Content type is required",
        },
        { status: 400 }
      );
    }

    console.log("Starting AI content generation...");

    // Generate content using AI
    const generatedContent = await generateWithAI(body);
    console.log(`Generated ${generatedContent.length} content items`);

    return NextResponse.json({
      success: true,
      content: generatedContent,
      data: {
        generatedCount: generatedContent.length,
        type: body.type,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

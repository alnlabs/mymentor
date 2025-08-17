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
          // Create different MCQ templates based on index
          const mcqTemplates = [
            {
              title: `${language} ${topic} MCQ ${i + 1}`,
              content: `What is the output of the following ${language} code?\n\n\`\`\`${language.toLowerCase()}\n// ${topic} example\nconsole.log("Hello World");\n\`\`\``,
              options: [
                "Hello World",
                "Error",
                "Undefined",
                "None of the above",
              ],
              correctAnswer: "Hello World",
              explanation: `This question tests understanding of ${topic} in ${language}.`,
            },
            {
              title: `${language} ${topic} Best Practices MCQ ${i + 1}`,
              content: `Which of the following is the best practice for ${topic.toLowerCase()} in ${language}?`,
              options: [
                `Use modern ${language} features and patterns`,
                "Always use legacy approaches for compatibility",
                "Ignore performance considerations",
                "Skip error handling for simplicity",
              ],
              correctAnswer: `Use modern ${language} features and patterns`,
              explanation: `Best practices for ${topic} in ${language} include using modern features, proper error handling, and performance optimization.`,
            },
            {
              title: `${language} ${topic} Implementation MCQ ${i + 1}`,
              content: `How would you implement a ${topic.toLowerCase()} solution in ${language}?`,
              options: [
                `Using appropriate design patterns and ${language} features`,
                "Copy-pasting code from the internet",
                "Using the most complex approach possible",
                "Avoiding any external libraries or frameworks",
              ],
              correctAnswer: `Using appropriate design patterns and ${language} features`,
              explanation: `Proper implementation of ${topic} in ${language} involves understanding design patterns, language features, and best practices.`,
            },
            {
              title: `${language} ${topic} Debugging MCQ ${i + 1}`,
              content: `What would you do to debug this ${topic.toLowerCase()} issue in ${language}?\n\n\`\`\`${language.toLowerCase()}\n// Buggy ${topic} code\nfunction process${
                topic.charAt(0).toUpperCase() + topic.slice(1)
              }() {\n  // TODO: Fix the bug\n}\n\`\`\`\n\n**Questions:**\n1. Use debugging tools and systematic approach\n2. Ignore the issue and move on\n3. Randomly change code until it works\n4. Ask someone else to fix it`,
              options: [
                "Use debugging tools and systematic approach",
                "Ignore the issue and move on",
                "Randomly change code until it works",
                "Ask someone else to fix it",
              ],
              correctAnswer: "Use debugging tools and systematic approach",
              explanation: `Debugging ${topic} issues in ${language} requires systematic analysis, debugging tools, and understanding of the problem domain.`,
            },
            {
              title: `${language} ${topic} Performance MCQ ${i + 1}`,
              content: `How would you optimize the performance of this ${topic.toLowerCase()} code in ${language}?\n\n\`\`\`${language.toLowerCase()}\n// Inefficient ${topic} implementation\nfor (let i = 0; i < 1000000; i++) {\n  // Expensive operation\n}\n\`\`\`\n\n**Questions:**\n1. Analyze and optimize the algorithm\n2. Add more hardware resources\n3. Ignore performance issues\n4. Use the slowest possible approach`,
              options: [
                "Analyze and optimize the algorithm",
                "Add more hardware resources",
                "Ignore performance issues",
                "Use the slowest possible approach",
              ],
              correctAnswer: "Analyze and optimize the algorithm",
              explanation: `Performance optimization for ${topic} in ${language} involves algorithmic analysis, profiling, and targeted improvements.`,
            },
          ];

          const selectedMCQ = mcqTemplates[i % mcqTemplates.length];

          generatedContent.push({
            id,
            type: "question",
            title: selectedMCQ.title,
            content: selectedMCQ.content,
            difficulty,
            category: topic,
            language,
            options: selectedMCQ.options,
            correctAnswer: selectedMCQ.correctAnswer,
            explanation: selectedMCQ.explanation,
            tags: [language, topic, difficulty],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.85,
            },
          });
          break;

        case "problem":
          // Create different problem templates based on index
          const problemTemplates = [
            {
              title: `${language} ${topic} Implementation Problem ${i + 1}`,
              content: `Write a function to solve the following problem:\n\n**Problem Description:**\nCreate a ${topic.toLowerCase()} solution in ${language}.\n\n**Requirements:**\n- Implement using modern ${language} features\n- Handle edge cases and errors gracefully\n- Include proper documentation`,
              explanation: `This problem tests implementation skills for ${topic} in ${language}.`,
            },
            {
              title: `${language} ${topic} Optimization Problem ${i + 1}`,
              content: `Optimize the following ${topic.toLowerCase()} code in ${language}:\n\n**Current Implementation:**\n\`\`\`${language.toLowerCase()}\n// Inefficient ${topic} implementation\nfunction process${
                topic.charAt(0).toUpperCase() + topic.slice(1)
              }() {\n  // TODO: Optimize this code\n}\n\`\`\`\n\n**Requirements:**\n- Improve performance and efficiency\n- Maintain functionality and readability\n- Add proper error handling`,
              explanation: `This problem focuses on optimizing ${topic} implementations in ${language}, considering performance and maintainability.`,
            },
            {
              title: `${language} ${topic} Design Problem ${i + 1}`,
              content: `Design a system for ${topic.toLowerCase()} in ${language}:\n\n**Requirements:**\n- Design scalable architecture\n- Consider performance implications\n- Include error handling strategies\n- Plan for testing and maintenance\n- Document your design decisions`,
              explanation: `This problem tests system design skills for ${topic} in ${language}, including architecture and scalability considerations.`,
            },
          ];

          const selectedProblem = problemTemplates[i % problemTemplates.length];

          generatedContent.push({
            id,
            type: "problem",
            title: selectedProblem.title,
            content: selectedProblem.content,
            difficulty,
            category: topic,
            language,
            explanation: selectedProblem.explanation,
            tags: [language, topic, difficulty, "coding"],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.9,
            },
          });
          break;

        case "exam":
          // Create different exam question templates based on index
          const examTemplates = [
            {
              title: `Comprehensive ${language} ${topic} Exam Question ${
                i + 1
              }`,
              content: `**Exam Question:**\n\nExplain the concept of ${topic.toLowerCase()} in ${language} and provide practical examples. Include:\n\n1. Definition and purpose\n2. Syntax and usage\n3. Common pitfalls\n4. Best practices\n\nProvide code examples to support your explanation.`,
              explanation: `This exam question tests comprehensive understanding of ${topic} in ${language}.`,
            },
            {
              title: `Advanced ${language} ${topic} Exam Question ${i + 1}`,
              content: `**Advanced Exam Question:**\n\nAnalyze the following ${topic.toLowerCase()} implementation in ${language}:\n\n\`\`\`${language.toLowerCase()}\n// Complex ${topic} implementation\nclass ${
                topic.charAt(0).toUpperCase() + topic.slice(1)
              }Manager {\n  // Implementation details\n}\n\`\`\`\n\n**Questions:**\n1. Identify potential issues and improvements\n2. Discuss scalability considerations\n3. Suggest alternative approaches\n4. Evaluate performance implications`,
              explanation: `This advanced exam question tests deep understanding and analysis skills for ${topic} in ${language}.`,
            },
            {
              title: `Practical ${language} ${topic} Exam Question ${i + 1}`,
              content: `**Practical Exam Question:**\n\nYou are tasked with implementing a ${topic.toLowerCase()} system in ${language} for a production environment.\n\n**Requirements:**\n- Design the system architecture\n- Implement core functionality\n- Add comprehensive error handling\n- Include unit tests\n- Document the implementation\n\nProvide a complete solution with code examples.`,
              explanation: `This practical exam question tests real-world implementation skills for ${topic} in ${language}.`,
            },
          ];

          const selectedExam = examTemplates[i % examTemplates.length];

          generatedContent.push({
            id,
            type: "question",
            title: selectedExam.title,
            content: selectedExam.content,
            difficulty,
            category: topic,
            language,
            explanation: selectedExam.explanation,
            tags: [language, topic, difficulty, "exam"],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.88,
            },
          });
          break;

        case "interview":
          // Create different interview question templates based on index
          const interviewTemplates = [
            {
              title: `Senior ${language} ${topic} Interview Question ${i + 1}`,
              content: `**Interview Question:**\n\nHow would you design a system to handle ${topic.toLowerCase()} in ${language}? Consider:\n\n- Scalability requirements\n- Performance optimization\n- Error handling and resilience\n- Testing strategies\n- Deployment considerations\n\nWalk through your design process and justify your decisions.`,
              explanation: `This interview question assesses system design skills for ${topic} in ${language}.`,
            },
            {
              title: `System Design ${language} ${topic} Interview Question ${
                i + 1
              }`,
              content: `**System Design Interview Question:**\n\nDesign a distributed system for ${topic.toLowerCase()} in ${language} that can handle:\n\n- High traffic (1M+ requests/second)\n- Data consistency across multiple nodes\n- Fault tolerance and recovery\n- Real-time processing\n- Security and access control\n\nProvide detailed architecture diagrams and implementation strategies.`,
              explanation: `This system design interview question tests advanced architecture skills for ${topic} in ${language}.`,
            },
            {
              title: `Technical Leadership ${language} ${topic} Interview Question ${
                i + 1
              }`,
              content: `**Technical Leadership Interview Question:**\n\nAs a technical lead, how would you approach implementing ${topic.toLowerCase()} in ${language} for a team of 10 developers?\n\n**Consider:**\n- Team coordination and communication\n- Code review and quality assurance\n- Performance monitoring and optimization\n- Documentation and knowledge sharing\n- Risk management and contingency planning\n\nProvide a comprehensive leadership strategy.`,
              explanation: `This technical leadership interview question tests management and leadership skills for ${topic} in ${language}.`,
            },
          ];

          const selectedInterview =
            interviewTemplates[i % interviewTemplates.length];

          generatedContent.push({
            id,
            type: "interview_question",
            title: selectedInterview.title,
            content: selectedInterview.content,
            difficulty,
            category: topic,
            language,
            explanation: selectedInterview.explanation,
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
    console.log("First few items:", generatedContent.slice(0, 3).map(item => ({ id: item.id, title: item.title })));
    console.log("Last few items:", generatedContent.slice(-3).map(item => ({ id: item.id, title: item.title })));
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

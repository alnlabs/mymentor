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
    console.log("generateWithAI called with:", JSON.stringify(request, null, 2));
    
    // This is a mock implementation - replace with actual AI service
    const {
      type,
      language = "JavaScript",
      topic = "General",
      difficulty = "intermediate",
      count = 5,
    } = request;

  const generatedContent: GeneratedContent[] = [];

  // Realistic content templates based on language and topic
  const contentTemplates = {
    javascript: {
      basics: {
        questions: [
          {
            title: "JavaScript Variable Declaration",
            content:
              "What is the difference between `let`, `const`, and `var` in JavaScript?",
            options: [
              "`let` and `const` are block-scoped, `var` is function-scoped",
              "All three are function-scoped",
              "`const` is block-scoped, `let` and `var` are function-scoped",
              "All three are block-scoped",
            ],
            correctAnswer:
              "`let` and `const` are block-scoped, `var` is function-scoped",
            explanation:
              "`let` and `const` are block-scoped (ES6), meaning they are only accessible within the block they are declared. `var` is function-scoped and can be accessed throughout the entire function.",
          },
          {
            title: "JavaScript Hoisting",
            content:
              "What will be the output of the following code?\n\n```javascript\nconsole.log(x);\nvar x = 5;\n```",
            options: ["5", "undefined", "ReferenceError", "null"],
            correctAnswer: "undefined",
            explanation:
              "Due to hoisting, `var x` is declared at the top but not initialized. So `console.log(x)` prints `undefined`.",
          },
        ],
        problems: [
          {
            title: "Array Manipulation",
            content:
              "Write a function that removes duplicates from an array without using Set or filter methods.\n\n**Requirements:**\n- Function should return a new array\n- Preserve the order of elements\n- Handle edge cases (empty array, null, undefined)",
            explanation:
              "This tests understanding of array methods, loops, and object properties for tracking unique values.",
          },
        ],
      },
      advanced: {
        questions: [
          {
            title: "JavaScript Closures",
            content:
              "What will be the output of the following code?\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter());\nconsole.log(counter());\n```",
            options: ["0, 1", "1, 2", "undefined, undefined", "Error"],
            correctAnswer: "1, 2",
            explanation:
              "This demonstrates closure - the inner function maintains access to the `count` variable from its outer scope.",
          },
          {
            title: "JavaScript Promises",
            content:
              "What is the correct way to handle multiple promises that should execute in parallel?",
            options: [
              "Use Promise.all()",
              "Use Promise.race()",
              "Use Promise.allSettled()",
              "Use async/await with forEach",
            ],
            correctAnswer: "Use Promise.all()",
            explanation:
              "Promise.all() waits for all promises to resolve and returns an array of results. If any promise rejects, the entire Promise.all() rejects.",
          },
        ],
        problems: [
          {
            title: "Promise Implementation",
            content:
              "Implement a custom Promise class with basic functionality (resolve, reject, then, catch).\n\n**Requirements:**\n- Support for .then() and .catch() methods\n- Handle both synchronous and asynchronous operations\n- Support for promise chaining",
            explanation:
              "This tests deep understanding of how promises work internally and asynchronous programming concepts.",
          },
        ],
      },
    },
    python: {
      basics: {
        questions: [
          {
            title: "Python List Comprehension",
            content:
              "What is the output of the following list comprehension?\n\n```python\nnumbers = [1, 2, 3, 4, 5]\nresult = [x * 2 for x in numbers if x % 2 == 0]\nprint(result)\n```",
            options: ["[2, 4, 6, 8, 10]", "[2, 4]", "[4, 8]", "[1, 3, 5]"],
            correctAnswer: "[4, 8]",
            explanation:
              "The comprehension multiplies even numbers by 2. Only 2 and 4 are even, so result is [4, 8].",
          },
          {
            title: "Python Dictionary Methods",
            content:
              "What is the difference between `.get()` and `[]` when accessing dictionary keys?",
            options: [
              "No difference, they work the same way",
              ".get() returns None for missing keys, [] raises KeyError",
              ".get() is faster than []",
              "[] returns None for missing keys, .get() raises KeyError",
            ],
            correctAnswer:
              ".get() returns None for missing keys, [] raises KeyError",
            explanation:
              ".get() safely returns None (or a default value) for missing keys, while [] raises a KeyError exception.",
          },
        ],
        problems: [
          {
            title: "File Processing",
            content:
              "Write a function that reads a CSV file and returns the data as a list of dictionaries.\n\n**Requirements:**\n- Handle missing or malformed data gracefully\n- Support custom delimiters\n- Return structured data with column names as keys",
            explanation:
              "This tests file I/O operations, data parsing, error handling, and data structure manipulation.",
          },
        ],
      },
      advanced: {
        questions: [
          {
            title: "Python Decorators",
            content:
              "What will be the output of the following code?\n\n```python\n@decorator\ndef greet(name):\n    return f'Hello {name}'\n\ndef decorator(func):\n    def wrapper(*args):\n        return func(*args).upper()\n    return wrapper\n\nprint(greet('Alice'))\n```",
            options: ["Hello Alice", "HELLO ALICE", "Error", "None"],
            correctAnswer: "HELLO ALICE",
            explanation:
              "The decorator wraps the function and converts its return value to uppercase.",
          },
        ],
        problems: [
          {
            title: "Context Manager",
            content:
              "Create a custom context manager class that measures execution time.\n\n**Requirements:**\n- Use __enter__ and __exit__ methods\n- Print execution time when exiting\n- Handle exceptions gracefully",
            explanation:
              "This tests understanding of context managers, class methods, and timing operations.",
          },
        ],
      },
    },
    java: {
      basics: {
        questions: [
          {
            title: "Java String Immutability",
            content: "What happens when you modify a String object in Java?",
            options: [
              "The original string is modified in place",
              "A new String object is created",
              "The string becomes null",
              "A compilation error occurs",
            ],
            correctAnswer: "A new String object is created",
            explanation:
              "Strings in Java are immutable. When you 'modify' a string, a new String object is created with the changes.",
          },
          {
            title: "Java Access Modifiers",
            content:
              "Which access modifier allows access from any class in the same package?",
            options: [
              "private",
              "public",
              "protected",
              "default (no modifier)",
            ],
            correctAnswer: "default (no modifier)",
            explanation:
              "The default access modifier (no keyword) allows access from any class in the same package.",
          },
        ],
        problems: [
          {
            title: "LinkedList Implementation",
            content:
              "Implement a simple LinkedList class with add, remove, and find methods.\n\n**Requirements:**\n- Use a Node inner class\n- Support for adding at beginning and end\n- Handle edge cases (empty list, single element)",
            explanation:
              "This tests understanding of data structures, object-oriented programming, and linked list concepts.",
          },
        ],
      },
    },
  };

  for (let i = 0; i < count; i++) {
    const id = `ai-generated-${type}-${Date.now()}-${i}`;

    // Get content based on language and difficulty
    const langContent =
      contentTemplates[
        language.toLowerCase() as keyof typeof contentTemplates
      ] || contentTemplates.javascript;
    const difficultyContent =
      langContent[difficulty as keyof typeof langContent] || langContent.basics;

    // Create dynamic content based on form settings
    const dynamicTopic = topic !== "General" ? topic : "programming concepts";
    const dynamicContext = context ? `Context: ${context}. ` : "";
    const dynamicLanguage = language.toLowerCase();

    switch (type) {
      case "mcq":
        // Use predefined template if available, otherwise create dynamic content
        const mcqTemplate =
          difficultyContent.questions?.[i % difficultyContent.questions.length];

        if (mcqTemplate && i < difficultyContent.questions.length) {
          // Use predefined template
          generatedContent.push({
            id,
            type: "question",
            title: mcqTemplate.title,
            content: mcqTemplate.content,
            difficulty,
            category: topic,
            language,
            options: mcqTemplate.options,
            correctAnswer: mcqTemplate.correctAnswer,
            explanation: mcqTemplate.explanation,
            tags: [language, topic, difficulty],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.85,
            },
          });
        } else {
          // Create dynamic content based on form settings
          const dynamicQuestions = [
            {
              title: `${language} ${dynamicTopic} MCQ ${i + 1}`,
              content: `${dynamicContext}What is the output of the following ${dynamicLanguage} code?\n\n\`\`\`${dynamicLanguage}\n// ${dynamicTopic} example\nconst result = process${
                dynamicTopic.charAt(0).toUpperCase() + dynamicTopic.slice(1)
              }();\nconsole.log(result);\n\`\`\``,
              options: [
                `Expected output based on ${dynamicTopic}`,
                "Error or exception",
                "Undefined or null",
                "Different result based on context",
              ],
              correctAnswer: `Expected output based on ${dynamicTopic}`,
              explanation: `This question tests understanding of ${dynamicTopic} in ${language}. The code demonstrates ${dynamicTopic.toLowerCase()} concepts and their practical application.`,
            },
            {
              title: `${language} ${dynamicTopic} Best Practices MCQ ${i + 1}`,
              content: `${dynamicContext}Which of the following is the best practice for ${dynamicTopic.toLowerCase()} in ${language}?`,
              options: [
                `Use modern ${language} features and patterns`,
                "Always use legacy approaches for compatibility",
                "Ignore performance considerations",
                "Skip error handling for simplicity",
              ],
              correctAnswer: `Use modern ${language} features and patterns`,
              explanation: `Best practices for ${dynamicTopic} in ${language} include using modern features, proper error handling, and performance optimization.`,
            },
            {
              title: `${language} ${dynamicTopic} Implementation MCQ ${i + 1}`,
              content: `${dynamicContext}How would you implement a ${dynamicTopic.toLowerCase()} solution in ${language}?`,
              options: [
                `Using appropriate design patterns and ${language} features`,
                "Copy-pasting code from the internet",
                "Using the most complex approach possible",
                "Avoiding any external libraries or frameworks",
              ],
              correctAnswer:
                `Using appropriate design patterns and ${language} features`,
              explanation: `Proper implementation of ${dynamicTopic} in ${language} involves understanding design patterns, language features, and best practices.`,
            },
          ];

          const selectedQuestion =
            dynamicQuestions[i % dynamicQuestions.length];

          generatedContent.push({
            id,
            type: "question",
            title: selectedQuestion.title,
            content: selectedQuestion.content,
            difficulty,
            category: topic,
            language,
            options: selectedQuestion.options,
            correctAnswer: selectedQuestion.correctAnswer,
            explanation: selectedQuestion.explanation,
            tags: [language, topic, difficulty],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.85,
              dynamic: true,
            },
          });
        }
        break;

      case "problem":
        const problemTemplate =
          difficultyContent.problems?.[i % difficultyContent.problems.length];

        if (problemTemplate && i < difficultyContent.problems.length) {
          // Use predefined template
          generatedContent.push({
            id,
            type: "problem",
            title: problemTemplate.title,
            content: problemTemplate.content,
            difficulty,
            category: topic,
            language,
            explanation: problemTemplate.explanation,
            tags: [language, topic, difficulty, "coding"],
            metadata: {
              generatedBy: "AI",
              timestamp: new Date().toISOString(),
              confidence: 0.9,
            },
          });
        } else {
          // Create dynamic problem based on form settings
          const dynamicProblems = [
            {
              title: `${language} ${dynamicTopic} Implementation Problem ${
                i + 1
              }`,
              content: `Write a function to solve the following problem:\n\n**Problem Description:**\nCreate a ${dynamicTopic.toLowerCase()} system in ${language}.\n\n**Requirements:**\n- Implement using modern ${language} features\n- Handle edge cases and errors gracefully\n- Include proper documentation and comments\n- Optimize for performance and readability\n- Follow ${language} best practices\n\n${dynamicContext}`,
              explanation: `This problem tests implementation skills for ${dynamicTopic} in ${language}, including design patterns, error handling, and best practices.`,
            },
            {
              title: `${language} ${dynamicTopic} Optimization Problem ${
                i + 1
              }`,
              content: `Optimize the following ${dynamicTopic.toLowerCase()} code in ${language}:\n\n**Current Implementation:**\n\`\`\`${dynamicLanguage}\n// Inefficient ${dynamicTopic} implementation\nfunction process${
                dynamicTopic.charAt(0).toUpperCase() + dynamicTopic.slice(1)
              }() {\n  // TODO: Optimize this code\n}\n\`\`\`\n\n**Requirements:**\n- Improve performance and efficiency\n- Maintain functionality and readability\n- Add proper error handling\n- Include performance benchmarks\n\n${dynamicContext}`,
              explanation: `This problem focuses on optimizing ${dynamicTopic} implementations in ${language}, considering performance, maintainability, and best practices.`,
            },
          ];

          const selectedProblem = dynamicProblems[i % dynamicProblems.length];

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
              dynamic: true,
            },
          });
        }
        break;

      case "exam":
        generatedContent.push({
          id,
          type: "question",
          title: `Comprehensive ${language} ${dynamicTopic} Exam Question ${
            i + 1
          }`,
          content: `**Exam Question:**\n\n${dynamicContext}Explain the concept of ${dynamicTopic.toLowerCase()} in ${language} and provide practical examples. Include:\n\n1. Definition and purpose of ${dynamicTopic}\n2. Syntax and usage in ${language}\n3. Common pitfalls and challenges\n4. Best practices and optimization\n5. Real-world applications\n\nProvide code examples to support your explanation.`,
          difficulty,
          category: topic,
          language,
          explanation: `This exam question tests comprehensive understanding of ${dynamicTopic} in ${language}, including theory, practical application, and best practices.`,
          tags: [language, topic, difficulty, "exam"],
          metadata: {
            generatedBy: "AI",
            timestamp: new Date().toISOString(),
            confidence: 0.88,
            dynamic: true,
          },
        });
        break;

      case "interview":
        generatedContent.push({
          id,
          type: "interview_question",
          title: `Senior ${language} ${dynamicTopic} Interview Question ${
            i + 1
          }`,
          content: `**Interview Question:**\n\n${dynamicContext}How would you design a system to handle ${dynamicTopic.toLowerCase()} in ${language}? Consider:\n\n- Scalability requirements and architecture\n- Performance optimization strategies\n- Error handling and resilience patterns\n- Testing strategies and quality assurance\n- Deployment and monitoring considerations\n- Security and data protection\n\nWalk through your design process and justify your decisions.`,
          difficulty,
          category: topic,
          language,
          explanation: `This interview question assesses system design skills for ${dynamicTopic} in ${language}, including architecture, scalability, and best practices.`,
          tags: [language, topic, difficulty, "interview"],
          metadata: {
            generatedBy: "AI",
            timestamp: new Date().toISOString(),
            confidence: 0.87,
            dynamic: true,
          },
        });
        break;
    }
    }

    console.log("Generated content successfully:", generatedContent.length, "items");
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
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

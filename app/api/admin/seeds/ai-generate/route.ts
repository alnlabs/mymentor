import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// AI Service Integration - You can replace this with your preferred AI service
interface AIService {
  generateQuestions(prompt: string, count: number): Promise<any[]>;
}

// Mock AI Service - Replace with actual AI integration
class MockAIService implements AIService {
  async generateQuestions(prompt: string, count: number): Promise<any[]> {
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const questions = [];
    const baseQuestions = this.getBaseQuestions(prompt);

    for (let i = 0; i < count; i++) {
      const baseQuestion = baseQuestions[i % baseQuestions.length];
      questions.push({
        id: `ai_generated_${Date.now()}_${i}`,
        question: `${baseQuestion.question} (AI Generated ${i + 1})`,
        options: baseQuestion.options,
        correctAnswer: baseQuestion.correctAnswer,
        explanation: baseQuestion.explanation,
        tags: baseQuestion.tags,
        companies: baseQuestion.companies,
        difficulty: baseQuestion.difficulty,
        topic: baseQuestion.topic,
      });
    }

    return questions;
  }

  private getBaseQuestions(prompt: string): any[] {
    // Extract language, topic, and difficulty from the prompt
    const languageMatch = prompt.match(/about (.+?) in (.+?)\./);
    const difficultyMatch = prompt.match(
      /(beginner|intermediate|advanced) level/
    );

    const topic = languageMatch ? languageMatch[1] : "programming";
    const language = languageMatch ? languageMatch[2] : "programming";
    const difficulty = difficultyMatch ? difficultyMatch[1] : "intermediate";

    // Generate questions based on language and topic
    const questions = this.generateQuestionsByLanguage(
      language,
      topic,
      difficulty
    );

    return questions.length > 0
      ? questions
      : this.getFallbackQuestions(language, topic, difficulty);
  }

  private generateQuestionsByLanguage(
    language: string,
    topic: string,
    difficulty: string
  ): any[] {
    const questions: any[] = [];

    // Java Questions
    if (language.toLowerCase().includes("java")) {
      if (
        topic.toLowerCase().includes("object-oriented") ||
        topic.toLowerCase().includes("oop")
      ) {
        questions.push(
          {
            question:
              "What is the difference between method overloading and method overriding in Java?",
            options: [
              "Overloading is in same class with different parameters, overriding is in subclass with same signature",
              "Overriding is in same class, overloading is in different classes",
              "Both are the same concept with different names",
              "Overloading is for constructors only, overriding is for methods only",
            ],
            correctAnswer:
              "Overloading is in same class with different parameters, overriding is in subclass with same signature",
            explanation:
              "Method overloading occurs within the same class with different parameters, while overriding occurs in a subclass with the same signature as the parent class.",
            tags: ["java", "oop", "overloading", "overriding", "polymorphism"],
            companies: ["Google", "Amazon", "Microsoft", "Oracle"],
            difficulty: difficulty,
            topic: topic,
          },
          {
            question:
              "Which access modifier provides the most restrictive access in Java?",
            options: [
              "public",
              "protected",
              "default (package-private)",
              "private",
            ],
            correctAnswer: "private",
            explanation:
              "Private provides the most restrictive access - only accessible within the same class.",
            tags: ["java", "access-modifiers", "encapsulation", "visibility"],
            companies: ["Oracle", "IBM", "Facebook"],
            difficulty: difficulty,
            topic: topic,
          },
          {
            question: "What is the purpose of the 'final' keyword in Java?",
            options: [
              "To make a class, method, or variable unchangeable",
              "To indicate the last method in a class",
              "To mark the end of a program",
              "To create a constant variable only",
            ],
            correctAnswer: "To make a class, method, or variable unchangeable",
            explanation:
              "The final keyword can be applied to classes, methods, and variables to prevent inheritance, overriding, or reassignment respectively.",
            tags: ["java", "final", "inheritance", "constants"],
            companies: ["Google", "Amazon", "Microsoft"],
            difficulty: difficulty,
            topic: topic,
          }
        );
      }

      if (
        topic.toLowerCase().includes("collection") ||
        topic.toLowerCase().includes("framework")
      ) {
        questions.push(
          {
            question:
              "Which Java collection interface does not allow duplicate elements?",
            options: ["List", "Set", "Map", "Queue"],
            correctAnswer: "Set",
            explanation:
              "Set interface does not allow duplicate elements, while List allows duplicates and maintains insertion order.",
            tags: ["java", "collections", "set", "framework"],
            companies: ["Google", "Amazon", "Microsoft"],
            difficulty: difficulty,
            topic: topic,
          },
          {
            question:
              "What is the difference between ArrayList and LinkedList in Java?",
            options: [
              "ArrayList is faster for random access, LinkedList is faster for insertions/deletions",
              "LinkedList is faster for random access, ArrayList is faster for insertions/deletions",
              "Both have the same performance characteristics",
              "ArrayList can only store primitives, LinkedList can store objects",
            ],
            correctAnswer:
              "ArrayList is faster for random access, LinkedList is faster for insertions/deletions",
            explanation:
              "ArrayList uses dynamic array internally, making random access O(1), while LinkedList uses doubly-linked list, making insertions/deletions O(1).",
            tags: [
              "java",
              "collections",
              "arraylist",
              "linkedlist",
              "performance",
            ],
            companies: ["Google", "Amazon", "Microsoft"],
            difficulty: difficulty,
            topic: topic,
          }
        );
      }
    }

    // JavaScript Questions
    if (
      language.toLowerCase().includes("javascript") ||
      language.toLowerCase().includes("js")
    ) {
      if (
        topic.toLowerCase().includes("variable") ||
        topic.toLowerCase().includes("data type")
      ) {
        questions.push(
          {
            question:
              "What is the difference between var, let, and const in JavaScript?",
            options: [
              "var is function-scoped, let and const are block-scoped",
              "All three are block-scoped",
              "var and let are function-scoped, const is block-scoped",
              "There is no difference between them",
            ],
            correctAnswer:
              "var is function-scoped, let and const are block-scoped",
            explanation:
              "var has function scope, while let and const have block scope. const also prevents reassignment.",
            tags: ["javascript", "variables", "scope", "es6"],
            companies: ["Google", "Facebook", "Netflix"],
            difficulty: difficulty,
            topic: topic,
          },
          {
            question: "What is the output of: console.log(typeof null)?",
            options: ["null", "undefined", "object", "number"],
            correctAnswer: "object",
            explanation:
              "This is a known JavaScript quirk. typeof null returns 'object' due to a bug in the original JavaScript implementation.",
            tags: ["javascript", "typeof", "null", "data-types"],
            companies: ["Google", "Facebook", "Netflix"],
            difficulty: difficulty,
            topic: topic,
          }
        );
      }

      if (
        topic.toLowerCase().includes("function") ||
        topic.toLowerCase().includes("scope")
      ) {
        questions.push({
          question: "What is closure in JavaScript?",
          options: [
            "A function that has access to variables in its outer scope",
            "A way to close browser tabs",
            "A method to end loops",
            "A type of JavaScript object",
          ],
          correctAnswer:
            "A function that has access to variables in its outer scope",
          explanation:
            "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
          tags: ["javascript", "closure", "scope", "functions"],
          companies: ["Google", "Facebook", "Netflix"],
          difficulty: difficulty,
          topic: topic,
        });
      }
    }

    // Python Questions
    if (language.toLowerCase().includes("python")) {
      if (
        topic.toLowerCase().includes("data structure") ||
        topic.toLowerCase().includes("list")
      ) {
        questions.push(
          {
            question:
              "What is the difference between a list and a tuple in Python?",
            options: [
              "Lists are mutable, tuples are immutable",
              "Tuples are mutable, lists are immutable",
              "Both are mutable",
              "Both are immutable",
            ],
            correctAnswer: "Lists are mutable, tuples are immutable",
            explanation:
              "Lists can be modified after creation, while tuples cannot be changed once created.",
            tags: [
              "python",
              "data-structures",
              "lists",
              "tuples",
              "mutability",
            ],
            companies: ["Google", "Amazon", "Microsoft"],
            difficulty: difficulty,
            topic: topic,
          },
          {
            question: "What is a dictionary comprehension in Python?",
            options: [
              "A concise way to create dictionaries using expressions",
              "A method to understand dictionary keys",
              "A type of Python documentation",
              "A way to sort dictionaries",
            ],
            correctAnswer:
              "A concise way to create dictionaries using expressions",
            explanation:
              "Dictionary comprehension is a concise way to create dictionaries using expressions, similar to list comprehension.",
            tags: ["python", "dictionary", "comprehension", "data-structures"],
            companies: ["Google", "Amazon", "Microsoft"],
            difficulty: difficulty,
            topic: topic,
          }
        );
      }

      if (
        topic.toLowerCase().includes("function") ||
        topic.toLowerCase().includes("def")
      ) {
        questions.push({
          question:
            "What is the purpose of *args in Python function definition?",
          options: [
            "To accept variable number of positional arguments",
            "To accept keyword arguments only",
            "To define required arguments",
            "To create a tuple",
          ],
          correctAnswer: "To accept variable number of positional arguments",
          explanation:
            "*args allows a function to accept a variable number of positional arguments, which are collected into a tuple.",
          tags: ["python", "functions", "args", "arguments"],
          companies: ["Google", "Amazon", "Microsoft"],
          difficulty: difficulty,
          topic: topic,
        });
      }
    }

    // React Questions
    if (language.toLowerCase().includes("react")) {
      if (
        topic.toLowerCase().includes("component") ||
        topic.toLowerCase().includes("props")
      ) {
        questions.push(
          {
            question:
              "What is the difference between props and state in React?",
            options: [
              "Props are read-only and passed from parent, state is internal and mutable",
              "Props are mutable, state is read-only",
              "Both are the same thing",
              "Props are for styling, state is for data",
            ],
            correctAnswer:
              "Props are read-only and passed from parent, state is internal and mutable",
            explanation:
              "Props are read-only and passed from parent components, while state is internal to a component and can be modified.",
            tags: ["react", "props", "state", "components"],
            companies: ["Facebook", "Netflix", "Airbnb"],
            difficulty: difficulty,
            topic: topic,
          },
          {
            question: "What is a functional component in React?",
            options: [
              "A component written as a JavaScript function",
              "A component that only works with functions",
              "A component that cannot have state",
              "A component that only renders once",
            ],
            correctAnswer: "A component written as a JavaScript function",
            explanation:
              "A functional component is a React component written as a JavaScript function, which can use hooks for state and lifecycle.",
            tags: ["react", "functional-components", "hooks"],
            companies: ["Facebook", "Netflix", "Airbnb"],
            difficulty: difficulty,
            topic: topic,
          }
        );
      }
    }

    return questions;
  }

  private getFallbackQuestions(
    language: string,
    topic: string,
    difficulty: string
  ): any[] {
    return [
      {
        question: `What is a key concept in ${topic} for ${language}?`,
        options: [
          "Understanding the core principles",
          "Memorizing syntax only",
          "Ignoring best practices",
          "Using outdated methods",
        ],
        correctAnswer: "Understanding the core principles",
        explanation: `Understanding the core principles is essential for mastering ${topic} in ${language}.`,
        tags: [language.toLowerCase(), topic.toLowerCase(), "fundamentals"],
        companies: ["Google", "Amazon", "Microsoft"],
        difficulty: difficulty,
        topic: topic,
      },
      {
        question: `Which of the following is important when working with ${topic} in ${language}?`,
        options: [
          "Following best practices and design patterns",
          "Using the most complex solutions",
          "Ignoring documentation",
          "Avoiding testing",
        ],
        correctAnswer: "Following best practices and design patterns",
        explanation: `Following best practices and design patterns is crucial for writing maintainable ${language} code.`,
        tags: [language.toLowerCase(), topic.toLowerCase(), "best-practices"],
        companies: ["Google", "Amazon", "Microsoft"],
        difficulty: difficulty,
        topic: topic,
      },
    ];
  }
}

// Real AI Service Integration (example with OpenAI)
class OpenAIService implements AIService {
  async generateQuestions(prompt: string, count: number): Promise<any[]> {
    // This is where you would integrate with OpenAI or other AI services
    // Example implementation:

    /*
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert programming instructor. Generate ${count} high-quality multiple choice questions about ${prompt}.
          Each question should have 4 options (A, B, C, D) and include:
          - A clear, concise question
          - 4 plausible answer options
          - The correct answer
          - A detailed explanation
          - Relevant tags
          - Company tags (Google, Amazon, Microsoft, etc.)

          Return the response as a JSON array.`
        }
      ],
      temperature: 0.7,
    });

    return JSON.parse(completion.choices[0].message.content);
    */

    // For now, using mock service
    const mockService = new MockAIService();
    return mockService.generateQuestions(prompt, count);
  }
}

// POST - Generate questions using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      language,
      topic,
      difficulty,
      count,
      includeExplanation,
      includeTags,
      includeCompanies,
    } = body;

    // Validate input
    if (!language || !topic || !difficulty || !count) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (count < 1 || count > 50) {
      return NextResponse.json(
        { success: false, error: "Question count must be between 1 and 50" },
        { status: 400 }
      );
    }

    // Create AI service instance
    // You can switch between MockAIService and OpenAIService
    const aiService = new MockAIService(); // Change to OpenAIService for production

    console.log("AI Generation Request:", {
      language,
      topic,
      difficulty,
      count,
      includeExplanation,
      includeTags,
      includeCompanies,
    });

    // Generate prompt for AI
    const prompt = `Generate ${count} ${difficulty} level multiple choice questions about ${topic} in ${language}.
    The questions should be:
    - Relevant to ${language} programming
    - Focused on ${topic}
    - ${difficulty} difficulty level
    - Include explanations: ${includeExplanation}
    - Include tags: ${includeTags}
    - Include company tags: ${includeCompanies}`;

    // Generate questions using AI
    const generatedQuestions = await aiService.generateQuestions(prompt, count);

    // Process and format the questions
    const formattedQuestions = generatedQuestions.map((q, index) => ({
      id: q.id || `ai_${Date.now()}_${index}`,
      question: q.question,
      options: q.options || ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: q.correctAnswer || q.options?.[0] || "Option A",
      explanation: includeExplanation ? q.explanation : undefined,
      tags: includeTags ? q.tags || [] : [],
      companies: includeCompanies ? q.companies || [] : [],
      difficulty: q.difficulty || difficulty,
      topic: q.topic || topic,
    }));

    return NextResponse.json({
      success: true,
      questions: formattedQuestions,
      metadata: {
        language,
        topic,
        difficulty,
        count: formattedQuestions.length,
        generatedAt: new Date().toISOString(),
        aiService: aiService.constructor.name,
      },
    });
  } catch (error: any) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

// GET - Get available AI services and configurations
export async function GET() {
  try {
    const availableServices = [
      {
        name: "MockAIService",
        description: "Mock service for testing and development",
        features: ["Question generation", "Template-based responses"],
        cost: "Free",
      },
      {
        name: "OpenAIService",
        description: "OpenAI GPT-4 integration for production",
        features: [
          "Advanced AI generation",
          "Context-aware responses",
          "High quality",
        ],
        cost: "Per token",
      },
    ];

    const supportedLanguages = [
      "Java",
      "JavaScript",
      "Python",
      "React",
      "Node.js",
      "SQL",
    ];
    const supportedTopics = {
      Java: [
        "Object-Oriented Programming",
        "Collections Framework",
        "Exception Handling",
        "Multithreading",
        "Streams API",
        "Spring Framework",
      ],
      JavaScript: [
        "Variables & Data Types",
        "Functions & Scope",
        "Arrays & Objects",
        "DOM Manipulation",
        "Async Programming",
        "ES6+ Features",
      ],
      Python: [
        "Basic Syntax",
        "Data Structures",
        "Control Flow",
        "Functions",
        "Object-Oriented Programming",
        "Exception Handling",
      ],
    };

    return NextResponse.json({
      success: true,
      data: {
        availableServices,
        supportedLanguages,
        supportedTopics,
        maxQuestionsPerRequest: 50, // This will be updated to use dynamic config
        supportedDifficulties: ["beginner", "intermediate", "advanced"],
      },
    });
  } catch (error: any) {
    console.error("Error getting AI configuration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get configuration" },
      { status: 500 }
    );
  }
}

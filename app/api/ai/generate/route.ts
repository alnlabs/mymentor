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

    // Enhanced content generation with realistic, varied questions
    const baseTimestamp = Date.now();
    const randomSeed = Math.random().toString(36).substr(2, 9);
    
    for (let i = 0; i < count; i++) {
      const id = `ai-generated-${type}-${baseTimestamp + i}-${randomSeed}-${i}`;
      const uniqueSuffix = `${randomSeed}-${i}`;

      switch (type) {
        case "mcq":
          // Create realistic MCQ questions based on actual programming concepts
          const mcqTemplates = [
            {
              title: `${language} ${topic} Variable Scope MCQ ${i + 1}`,
              content: `What is the output of the following ${language} code?\n\n\`\`\`${language.toLowerCase()}\nlet x = 10;\nfunction testScope() {\n  let x = 20;\n  console.log(x);\n}\ntestScope();\nconsole.log(x);\n\`\`\``,
              options: ["20, 10", "10, 20", "20, 20", "10, 10"],
              correctAnswer: "20, 10",
              explanation: `This tests understanding of variable scope in ${language}. The inner 'x' shadows the outer 'x' within the function scope.`,
            },
            {
              title: `${language} ${topic} Array Methods MCQ ${i + 1}`,
              content: `Which ${language} array method returns a new array without modifying the original?\n\n\`\`\`${language.toLowerCase()}\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(x => x * 2);\nconsole.log(numbers); // What will this output?\n\`\`\``,
              options: ["[2, 4, 6, 8, 10]", "[1, 2, 3, 4, 5]", "Error", "Undefined"],
              correctAnswer: "[1, 2, 3, 4, 5]",
              explanation: `The map() method creates a new array and doesn't modify the original array.`,
            },
            {
              title: `${language} ${topic} Async/Await MCQ ${i + 1}`,
              content: `What will be logged first in this ${language} code?\n\n\`\`\`${language.toLowerCase()}\nasync function test() {\n  console.log('1');\n  await new Promise(resolve => setTimeout(resolve, 100));\n  console.log('2');\n}\nconsole.log('3');\ntest();\nconsole.log('4');\n\`\`\``,
              options: ["1, 3, 4, 2", "3, 1, 4, 2", "1, 2, 3, 4", "3, 4, 1, 2"],
              correctAnswer: "3, 1, 4, 2",
              explanation: `The async function is called but doesn't block execution. '3' logs first, then '1', then '4', and finally '2' after the timeout.`,
            },
            {
              title: `${language} ${topic} Object Destructuring MCQ ${i + 1}`,
              content: `What is the value of 'name' after this ${language} destructuring?\n\n\`\`\`${language.toLowerCase()}\nconst user = { id: 1, name: 'John', email: 'john@example.com' };\nconst { name, age = 25 } = user;\nconsole.log(name);\n\`\`\``,
              options: ["'John'", "undefined", "25", "Error"],
              correctAnswer: "'John'",
              explanation: `Destructuring extracts the 'name' property from the user object, which is 'John'. The age default value doesn't affect name.`,
            },
            {
              title: `${language} ${topic} Closure MCQ ${i + 1}`,
              content: `What will this ${language} closure code output?\n\n\`\`\`${language.toLowerCase()}\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\nconst counter = createCounter();\nconsole.log(counter());\nconsole.log(counter());\n\`\`\``,
              options: ["0, 1", "1, 2", "1, 1", "Error"],
              correctAnswer: "1, 2",
              explanation: `The closure maintains the count variable in its scope. Each call increments and returns the current count.`,
            },
            {
              title: `${language} ${topic} Promise MCQ ${i + 1}`,
              content: `What happens when a Promise is rejected in ${language}?\n\n\`\`\`${language.toLowerCase()}\nconst promise = new Promise((resolve, reject) => {\n  reject('Error occurred');\n});\npromise.then(result => console.log('Success:', result))\n       .catch(error => console.log('Error:', error));\n\`\`\``,
              options: ["Success: Error occurred", "Error: Error occurred", "Nothing", "Promise pending"],
              correctAnswer: "Error: Error occurred",
              explanation: `When a Promise is rejected, the .catch() handler is called with the rejection reason.`,
            },
            {
              title: `${language} ${topic} Event Loop MCQ ${i + 1}`,
              content: `In ${language}'s event loop, what is the correct order of execution?\n\n\`\`\`${language.toLowerCase()}\nconsole.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n\`\`\``,
              options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "4, 1, 3, 2"],
              correctAnswer: "1, 4, 3, 2",
              explanation: `Synchronous code (1, 4) runs first, then microtasks (Promise - 3), then macrotasks (setTimeout - 2).`,
            },
            {
              title: `${language} ${topic} Hoisting MCQ ${i + 1}`,
              content: `What is the result of this ${language} hoisting example?\n\n\`\`\`${language.toLowerCase()}\nconsole.log(x);\nvar x = 5;\nconsole.log(x);\n\`\`\``,
              options: ["undefined, 5", "5, 5", "Error, 5", "Error, Error"],
              correctAnswer: "undefined, 5",
              explanation: `Variable declarations are hoisted but not initializations. 'x' is undefined before assignment.`,
            },
            {
              title: `${language} ${topic} This Context MCQ ${i + 1}`,
              content: `What does 'this' refer to in this ${language} code?\n\n\`\`\`${language.toLowerCase()}\nconst obj = {\n  name: 'Object',\n  method: function() {\n    console.log(this.name);\n  }\n};\nconst func = obj.method;\nfunc();\n\`\`\``,
              options: ["'Object'", "undefined", "Error", "Global object"],
              correctAnswer: "undefined",
              explanation: `When a method is assigned to a variable and called, 'this' loses its context and becomes undefined (in strict mode) or the global object.`,
            },
            {
              title: `${language} ${topic} Module System MCQ ${i + 1}`,
              content: `What is the difference between 'export default' and 'export' in ${language} modules?\n\n\`\`\`${language.toLowerCase()}\n// file1.js\nexport default function() {}\nexport const helper = {};\n\n// file2.js\nimport myFunc, { helper } from './file1.js';\n\`\`\``,
              options: [
                "No difference, both work the same",
                "Default export can be imported with any name, named exports must use exact names",
                "Default exports are private, named exports are public",
                "Default exports are synchronous, named exports are asynchronous"
              ],
              correctAnswer: "Default export can be imported with any name, named exports must use exact names",
              explanation: `Default exports allow renaming during import, while named exports require the exact export name.`,
            }
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
          // Create realistic programming problems
          const problemTemplates = [
            {
              title: `${language} ${topic} Reverse String Problem ${i + 1}`,
              content: `Write a function to reverse a string in ${language}.\n\n**Requirements:**\n- Implement without using built-in reverse methods\n- Handle edge cases (empty string, single character)\n- Consider performance for large strings\n- Include proper error handling\n\n**Example:**\nInput: "hello"\nOutput: "olleh"`,
              explanation: `This tests string manipulation and algorithm implementation skills in ${language}.`,
            },
            {
              title: `${language} ${topic} Find Duplicates Problem ${i + 1}`,
              content: `Write a function to find duplicate elements in an array using ${language}.\n\n**Requirements:**\n- Return an array of duplicate elements\n- Handle edge cases (empty array, no duplicates)\n- Optimize for time complexity\n- Include proper documentation\n\n**Example:**\nInput: [1, 2, 3, 2, 4, 5, 3]\nOutput: [2, 3]`,
              explanation: `This tests array manipulation, algorithm design, and optimization skills in ${language}.`,
            },
            {
              title: `${language} ${topic} Valid Parentheses Problem ${i + 1}`,
              content: `Write a function to check if a string of parentheses is valid in ${language}.\n\n**Requirements:**\n- Support (), [], and {} parentheses\n- Return true if valid, false otherwise\n- Handle edge cases (empty string, single character)\n- Consider time and space complexity\n\n**Examples:**\n"()" → true\n"([)]" → false\n"{[]}" → true`,
              explanation: `This tests stack data structure implementation and string parsing in ${language}.`,
            },
            {
              title: `${language} ${topic} Fibonacci Sequence Problem ${i + 1}`,
              content: `Write a function to generate the Fibonacci sequence in ${language}.\n\n**Requirements:**\n- Implement both iterative and recursive approaches\n- Handle large numbers efficiently\n- Include memoization for recursive version\n- Consider performance implications\n\n**Example:**\nInput: 8\nOutput: [0, 1, 1, 2, 3, 5, 8, 13]`,
              explanation: `This tests recursive programming, memoization, and algorithm optimization in ${language}.`,
            },
            {
              title: `${language} ${topic} Binary Search Problem ${i + 1}`,
              content: `Implement binary search algorithm in ${language}.\n\n**Requirements:**\n- Work with sorted arrays\n- Return index of target element or -1 if not found\n- Handle edge cases (empty array, single element)\n- Analyze time complexity\n\n**Example:**\nInput: [1, 3, 5, 7, 9], target: 5\nOutput: 2`,
              explanation: `This tests algorithm implementation, array manipulation, and complexity analysis in ${language}.`,
            },
            {
              title: `${language} ${topic} Merge Sort Problem ${i + 1}`,
              content: `Implement merge sort algorithm in ${language}.\n\n**Requirements:**\n- Sort array in ascending order\n- Use divide-and-conquer approach\n- Handle edge cases (empty array, single element)\n- Analyze time and space complexity\n\n**Example:**\nInput: [64, 34, 25, 12, 22, 11, 90]\nOutput: [11, 12, 22, 25, 34, 64, 90]`,
              explanation: `This tests advanced algorithm implementation, recursion, and sorting techniques in ${language}.`,
            },
            {
              title: `${language} ${topic} Queue Implementation Problem ${i + 1}`,
              content: `Implement a Queue data structure in ${language}.\n\n**Requirements:**\n- Include enqueue, dequeue, peek, and isEmpty methods\n- Handle edge cases (empty queue operations)\n- Consider both array and linked list implementations\n- Analyze time complexity for each operation\n\n**Example:**\nconst queue = new Queue();\nqueue.enqueue(1);\nqueue.enqueue(2);\nqueue.dequeue(); // returns 1`,
              explanation: `This tests data structure implementation and object-oriented programming in ${language}.`,
            },
            {
              title: `${language} ${topic} Promise Implementation Problem ${i + 1}`,
              content: `Implement a basic Promise-like class in ${language}.\n\n**Requirements:**\n- Support .then() and .catch() methods\n- Handle both resolve and reject states\n- Support chaining of promises\n- Handle asynchronous operations\n\n**Example:**\nconst promise = new MyPromise((resolve, reject) => {\n  setTimeout(() => resolve('Success'), 1000);\n});`,
              explanation: `This tests advanced ${language} concepts, asynchronous programming, and class implementation.`,
            }
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
    console.log(
      "First few items:",
      generatedContent
        .slice(0, 3)
        .map((item) => ({ id: item.id, title: item.title }))
    );
    console.log(
      "Last few items:",
      generatedContent
        .slice(-3)
        .map((item) => ({ id: item.id, title: item.title }))
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

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
          // Create topic-specific MCQ questions
          let mcqTemplates = [];

          if (topic === "System Design") {
            mcqTemplates = [
              {
                title: `${language} ${topic} Load Balancer MCQ ${i + 1}`,
                content: `Which load balancing algorithm is best for ${language} applications with ${
                  10 + i
                } servers?\n\n**Scenario:**\nYou have ${
                  10 + i
                } ${language} servers and need to distribute traffic efficiently.`,
                options: [
                  "Round Robin - distributes requests evenly",
                  "Least Connections - sends to server with fewest active connections",
                  "IP Hash - routes based on client IP",
                  "Random - randomly selects server",
                ],
                correctAnswer:
                  "Least Connections - sends to server with fewest active connections",
                explanation: `For ${language} applications with ${
                  10 + i
                } servers, Least Connections provides better performance by avoiding overloaded servers.`,
              },
              {
                title: `${language} ${topic} Database Scaling MCQ ${i + 1}`,
                content: `How would you scale a ${language} application's database to handle ${
                  1000 + i * 100
                } requests per second?\n\n**Current Setup:**\nSingle database server handling ${
                  500 + i * 50
                } requests/sec.`,
                options: [
                  "Vertical scaling - upgrade server hardware",
                  "Horizontal scaling - add read replicas",
                  "Sharding - split data across multiple databases",
                  "Caching - add Redis/memcached layer",
                ],
                correctAnswer: "Horizontal scaling - add read replicas",
                explanation: `Horizontal scaling with read replicas is most effective for ${language} applications needing to handle ${
                  1000 + i * 100
                } requests/sec.`,
              },
              {
                title: `${language} ${topic} Microservices MCQ ${i + 1}`,
                content: `When should you split a ${language} monolith into microservices?\n\n**Current Application:**\n${language} app with ${
                  5 + i
                } modules and ${20 + i * 2} developers.`,
                options: [
                  "Always - microservices are always better",
                  "When team size exceeds ${15 + i} developers",
                  "When deployment frequency becomes a bottleneck",
                  "Never - monoliths are simpler to maintain",
                ],
                correctAnswer: "When deployment frequency becomes a bottleneck",
                explanation: `For ${language} applications, split into microservices when deployment and scaling become bottlenecks, not just team size.`,
              },
              {
                title: `${language} ${topic} Caching Strategy MCQ ${i + 1}`,
                content: `Which caching strategy is best for a ${language} e-commerce application?\n\n**Requirements:**\n- Product catalog with ${
                  10000 + i * 1000
                } items\n- User sessions with ${
                  1000 + i * 100
                } concurrent users`,
                options: [
                  "Cache-aside - load data on demand",
                  "Write-through - update cache immediately",
                  "Write-behind - batch cache updates",
                  "Refresh-ahead - preload popular items",
                ],
                correctAnswer: "Cache-aside - load data on demand",
                explanation: `Cache-aside is ideal for ${language} e-commerce apps as it provides flexibility and handles varying product popularity.`,
              },
              {
                title: `${language} ${topic} API Design MCQ ${i + 1}`,
                content: `How should you design REST APIs for a ${language} microservices architecture?\n\n**Architecture:**\n${
                  3 + i
                } microservices communicating via HTTP APIs.`,
                options: [
                  "Use different API versions for each service",
                  "Standardize on common API patterns and conventions",
                  "Let each team design APIs independently",
                  "Use GraphQL for all service communication",
                ],
                correctAnswer:
                  "Standardize on common API patterns and conventions",
                explanation: `For ${language} microservices, standardized API patterns ensure consistency and easier integration.`,
              },
            ];
          } else if (topic === "Algorithms") {
            mcqTemplates = [
              {
                title: `${language} ${topic} Sorting Algorithm MCQ ${i + 1}`,
                content: `Which sorting algorithm is most efficient for an array of ${
                  100 + i * 10
                } elements in ${language}?\n\n**Array:**\n[${5 + i}, ${
                  3 + i
                }, ${7 + i}, ${1 + i}, ${9 + i}, ${2 + i}, ${8 + i}, ${
                  4 + i
                }, ${6 + i}]`,
                options: [
                  "Bubble Sort - O(n²) time complexity",
                  "Quick Sort - O(n log n) average case",
                  "Merge Sort - O(n log n) guaranteed",
                  "Insertion Sort - O(n²) but good for small arrays",
                ],
                correctAnswer: "Quick Sort - O(n log n) average case",
                explanation: `For ${
                  100 + i * 10
                } elements in ${language}, Quick Sort provides the best average-case performance.`,
              },
              {
                title: `${language} ${topic} Search Algorithm MCQ ${i + 1}`,
                content: `What is the time complexity of searching for element ${
                  10 + i
                } in a sorted array using ${language}?\n\n**Array:**\n[1, 3, 5, 7, 9, 11, 13, 15, 17, 19]`,
                options: [
                  "O(1) - constant time",
                  "O(log n) - logarithmic time",
                  "O(n) - linear time",
                  "O(n²) - quadratic time",
                ],
                correctAnswer: "O(log n) - logarithmic time",
                explanation: `Binary search in a sorted array has O(log n) time complexity in ${language}.`,
              },
              {
                title: `${language} ${topic} Data Structure MCQ ${i + 1}`,
                content: `Which data structure is best for implementing a priority queue in ${language}?\n\n**Requirements:**\n- Insert operations: ${
                  100 + i
                } per second\n- Extract max operations: ${50 + i} per second`,
                options: [
                  "Array - simple but inefficient",
                  "Linked List - good for insertions",
                  "Binary Heap - optimal for priority queues",
                  "Binary Search Tree - balanced operations",
                ],
                correctAnswer: "Binary Heap - optimal for priority queues",
                explanation: `Binary Heap provides O(log n) for both insert and extract operations in ${language} priority queues.`,
              },
              {
                title: `${language} ${topic} Dynamic Programming MCQ ${i + 1}`,
                content: `How would you solve the Fibonacci sequence problem in ${language} using dynamic programming?\n\n**Problem:**\nCalculate the ${
                  10 + i
                }th Fibonacci number efficiently.`,
                options: [
                  "Recursive approach - simple but exponential time",
                  "Memoization - cache recursive results",
                  "Tabulation - bottom-up approach",
                  "Iterative approach - space efficient",
                ],
                correctAnswer: "Tabulation - bottom-up approach",
                explanation: `Tabulation provides O(n) time and O(1) space for Fibonacci in ${language}, avoiding stack overflow.`,
              },
              {
                title: `${language} ${topic} Graph Algorithm MCQ ${i + 1}`,
                content: `Which algorithm finds the shortest path in a weighted graph using ${language}?\n\n**Graph:**\n${
                  5 + i
                } nodes with ${10 + i * 2} weighted edges.`,
                options: [
                  "Breadth-First Search (BFS)",
                  "Depth-First Search (DFS)",
                  "Dijkstra's Algorithm",
                  "Bellman-Ford Algorithm",
                ],
                correctAnswer: "Dijkstra's Algorithm",
                explanation: `Dijkstra's Algorithm efficiently finds shortest paths in weighted graphs using ${language}.`,
                             },
             ];
           } else if (topic === "Database") {
             mcqTemplates = [
               {
                 title: `${language} ${topic} SQL Query MCQ ${i + 1}`,
                 content: `What is the correct SQL query to find all users who registered in the last ${
                   30 + i
                 } days?\n\n**Table:**\nusers (id, name, email, created_at, status)\n\n**Requirements:**\n- Active users only\n- Registered within last ${30 + i} days\n- Order by registration date`,
                 options: [
                   `SELECT * FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${30 + i} DAY)`,
                   `SELECT * FROM users WHERE created_at > NOW() - ${30 + i}`,
                   `SELECT * FROM users WHERE status = 'active' AND created_at >= DATE_SUB(NOW(), INTERVAL ${30 + i} DAY) ORDER BY created_at`,
                   `SELECT * FROM users WHERE created_at BETWEEN NOW() AND DATE_SUB(NOW(), INTERVAL ${30 + i} DAY)`,
                 ],
                 correctAnswer: `SELECT * FROM users WHERE status = 'active' AND created_at >= DATE_SUB(NOW(), INTERVAL ${30 + i} DAY) ORDER BY created_at`,
                 explanation: `This query filters active users, checks registration within last ${30 + i} days, and orders by creation date.`,
               },
               {
                 title: `${language} ${topic} Database Index MCQ ${i + 1}`,
                 content: `Which index strategy is best for a ${language} application's user table with ${10000 + i * 1000} records?\n\n**Table:**\nusers (id, email, username, created_at, last_login)\n\n**Query Pattern:**\n- Frequent searches by email\n- Occasional searches by username\n- Rare searches by created_at`,
                 options: [
                   "Single index on (email, username, created_at)",
                   "Separate indexes on email, username, and created_at",
                   "Composite index on (email, username) and separate index on created_at",
                   "No indexes needed for small tables",
                 ],
                 correctAnswer: "Composite index on (email, username) and separate index on created_at",
                 explanation: `For ${10000 + i * 1000} records, composite index on frequently searched columns with separate index for less common searches optimizes performance.`,
               },
               {
                 title: `${language} ${topic} Transaction MCQ ${i + 1}`,
                 content: `What happens when a ${language} application tries to update ${5 + i} user records in a single transaction?\n\n**Scenario:**\n- Update user status to 'inactive'\n- Update last_login timestamp\n- Update profile_count field\n\n**Database:**\nMySQL with InnoDB engine`,
                 options: [
                   "All updates succeed or all fail (ACID compliance)",
                   "Some updates succeed, others fail randomly",
                   "Updates are queued and processed one by one",
                   "Only the first update succeeds",
                 ],
                 correctAnswer: "All updates succeed or all fail (ACID compliance)",
                 explanation: `InnoDB transactions ensure ACID properties - all ${5 + i} updates either commit together or rollback together.`,
               },
               {
                 title: `${language} ${topic} Database Design MCQ ${i + 1}`,
                 content: `How should you design a database for a ${language} e-commerce application?\n\n**Requirements:**\n- ${1000 + i * 100} products\n- ${10000 + i * 1000} orders\n- ${50000 + i * 5000} customers\n- Support for product categories and reviews`,
                 options: [
                   "Single table with all data",
                   "Normalized design with separate tables for products, orders, customers, categories, reviews",
                   "Denormalized design with embedded JSON data",
                   "NoSQL database only",
                 ],
                 correctAnswer: "Normalized design with separate tables for products, orders, customers, categories, reviews",
                 explanation: `For ${language} e-commerce with ${1000 + i * 100} products and ${10000 + i * 1000} orders, normalized design prevents data redundancy and maintains integrity.`,
               },
               {
                 title: `${language} ${topic} Performance MCQ ${i + 1}`,
                 content: `Which query optimization technique is most effective for a ${language} application with ${100000 + i * 10000} user records?\n\n**Slow Query:**\nSELECT * FROM users WHERE email LIKE '%@gmail.com' AND status = 'active' ORDER BY created_at DESC LIMIT 50`,
                 options: [
                   "Add index on (email, status, created_at)",
                   "Use SELECT specific columns instead of *",
                   "Add WHERE clause to filter results",
                   "Use LIMIT to reduce results",
                 ],
                 correctAnswer: "Add index on (email, status, created_at)",
                 explanation: `For ${100000 + i * 10000} records, a composite index on (email, status, created_at) will dramatically improve query performance.`,
               },
             ];
           } else if (topic === "DevOps") {
             mcqTemplates = [
               {
                 title: `${language} ${topic} CI/CD Pipeline MCQ ${i + 1}`,
                 content: `How should you structure a CI/CD pipeline for a ${language} application with ${5 + i} microservices?\n\n**Requirements:**\n- Automated testing on every commit\n- Staging environment deployment\n- Production deployment with approval\n- Rollback capability`,
                 options: [
                   "Single pipeline for all services",
                   "Separate pipeline per service with shared stages",
                   "Manual deployment only",
                   "No testing required",
                 ],
                 correctAnswer: "Separate pipeline per service with shared stages",
                 explanation: `For ${language} applications with ${5 + i} microservices, separate pipelines with shared stages provide flexibility and faster deployments.`,
               },
               {
                 title: `${language} ${topic} Container Orchestration MCQ ${i + 1}`,
                 content: `Which container orchestration tool is best for managing ${10 + i} ${language} microservices in production?\n\n**Requirements:**\n- Auto-scaling based on load\n- Service discovery\n- Load balancing\n- Rolling updates`,
                 options: [
                   "Docker Compose - simple container management",
                   "Kubernetes - full orchestration platform",
                   "Docker Swarm - basic orchestration",
                   "No orchestration needed",
                 ],
                 correctAnswer: "Kubernetes - full orchestration platform",
                 explanation: `For ${10 + i} ${language} microservices in production, Kubernetes provides comprehensive orchestration with auto-scaling, service discovery, and rolling updates.`,
               },
               {
                 title: `${language} ${topic} Infrastructure as Code MCQ ${i + 1}`,
                 content: `How should you manage infrastructure for a ${language} application across ${3 + i} environments?\n\n**Environments:**\n- Development, Staging, Production\n- Different resource requirements\n- Consistent configuration`,
                 options: [
                   "Manual server setup for each environment",
                   "Terraform with environment-specific variables",
                   "Cloud provider console only",
                   "No infrastructure management needed",
                 ],
                 correctAnswer: "Terraform with environment-specific variables",
                 explanation: `Terraform with environment-specific variables ensures consistent infrastructure across ${3 + i} environments for ${language} applications.`,
               },
               {
                 title: `${language} ${topic} Monitoring MCQ ${i + 1}`,
                 content: `Which monitoring strategy is best for a ${language} application serving ${1000 + i * 100} users?\n\n**Requirements:**\n- Real-time performance metrics\n- Error tracking and alerting\n- Resource utilization monitoring\n- User experience metrics`,
                 options: [
                   "Manual log checking only",
                   "Application Performance Monitoring (APM) + Infrastructure monitoring",
                   "No monitoring needed",
                   "Basic server monitoring only",
                 ],
                 correctAnswer: "Application Performance Monitoring (APM) + Infrastructure monitoring",
                 explanation: `For ${language} applications serving ${1000 + i * 100} users, APM + infrastructure monitoring provides comprehensive visibility into performance and issues.`,
               },
               {
                 title: `${language} ${topic} Security MCQ ${i + 1}`,
                 content: `How should you secure a ${language} application's deployment pipeline?\n\n**Requirements:**\n- Secure secrets management\n- Vulnerability scanning\n- Access control\n- Audit logging`,
                 options: [
                   "Store secrets in code repository",
                   "Use secrets management + security scanning + RBAC",
                   "No security measures needed",
                   "Basic password protection only",
                 ],
                 correctAnswer: "Use secrets management + security scanning + RBAC",
                 explanation: `For ${language} applications, secrets management, vulnerability scanning, and Role-Based Access Control (RBAC) ensure secure deployments.`,
               },
             ];
           } else {
             // Default templates for other topics
            mcqTemplates = [
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
                options: [
                  "[2, 4, 6, 8, 10]",
                  "[1, 2, 3, 4, 5]",
                  "Error",
                  "Undefined",
                ],
                correctAnswer: "[1, 2, 3, 4, 5]",
                explanation: `The map() method creates a new array and doesn't modify the original array.`,
              },
              {
                title: `${language} ${topic} Async/Await MCQ ${i + 1}`,
                content: `What will be logged first in this ${language} code?\n\n\`\`\`${language.toLowerCase()}\nasync function test() {\n  console.log('1');\n  await new Promise(resolve => setTimeout(resolve, 100));\n  console.log('2');\n}\nconsole.log('3');\ntest();\nconsole.log('4');\n\`\`\``,
                options: [
                  "1, 3, 4, 2",
                  "3, 1, 4, 2",
                  "1, 2, 3, 4",
                  "3, 4, 1, 2",
                ],
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
            ];
          }

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
              title: `${language} ${topic} Queue Implementation Problem ${
                i + 1
              }`,
              content: `Implement a Queue data structure in ${language}.\n\n**Requirements:**\n- Include enqueue, dequeue, peek, and isEmpty methods\n- Handle edge cases (empty queue operations)\n- Consider both array and linked list implementations\n- Analyze time complexity for each operation\n\n**Example:**\nconst queue = new Queue();\nqueue.enqueue(1);\nqueue.enqueue(2);\nqueue.dequeue(); // returns 1`,
              explanation: `This tests data structure implementation and object-oriented programming in ${language}.`,
            },
            {
              title: `${language} ${topic} Promise Implementation Problem ${
                i + 1
              }`,
              content: `Implement a basic Promise-like class in ${language}.\n\n**Requirements:**\n- Support .then() and .catch() methods\n- Handle both resolve and reject states\n- Support chaining of promises\n- Handle asynchronous operations\n\n**Example:**\nconst promise = new MyPromise((resolve, reject) => {\n  setTimeout(() => resolve('Success'), 1000);\n});`,
              explanation: `This tests advanced ${language} concepts, asynchronous programming, and class implementation.`,
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

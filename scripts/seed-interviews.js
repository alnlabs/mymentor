const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const interviewTemplates = [
  {
    name: "Frontend Developer Interview",
    description: "Comprehensive frontend interview covering HTML, CSS, JavaScript, and modern frameworks. Perfect for React, Vue, and Angular developers.",
    duration: 60,
    difficulty: "medium",
    category: "frontend",
    companies: ["Google", "Facebook", "Netflix", "Airbnb"],
    questions: [
      {
        questionType: "mcq",
        question: "What is the difference between let, const, and var in JavaScript?",
        options: [
          "let and const are block-scoped, var is function-scoped",
          "All three are function-scoped",
          "const is block-scoped, let and var are function-scoped",
          "All three are block-scoped"
        ],
        correctAnswer: "let and const are block-scoped, var is function-scoped",
        explanation: "let and const are block-scoped (ES6), while var is function-scoped (ES5). const also prevents reassignment.",
        points: 10,
        timeLimit: 2
      },
      {
        questionType: "coding",
        question: "Implement a function that reverses a string without using the built-in reverse() method.",
        explanation: "You can use a loop or convert to array and use reduce().",
        points: 20,
        timeLimit: 10
      },
      {
        questionType: "mcq",
        question: "What is the purpose of React's Virtual DOM?",
        options: [
          "To make React faster than other frameworks",
          "To provide a virtual representation of the actual DOM",
          "To create a backup of the DOM",
          "To enable server-side rendering"
        ],
        correctAnswer: "To provide a virtual representation of the actual DOM",
        explanation: "Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance.",
        points: 10,
        timeLimit: 3
      },
      {
        questionType: "behavioral",
        question: "Describe a challenging project you worked on and how you overcame obstacles.",
        explanation: "Focus on your problem-solving approach, collaboration, and learning outcomes.",
        points: 15,
        timeLimit: 5
      }
    ]
  },
  {
    name: "Backend Developer Interview",
    description: "Backend interview focusing on databases, APIs, server architecture, and system design principles.",
    duration: 90,
    difficulty: "hard",
    category: "backend",
    companies: ["Amazon", "Microsoft", "Uber", "Stripe"],
    questions: [
      {
        questionType: "mcq",
        question: "What is the difference between SQL and NoSQL databases?",
        options: [
          "SQL is relational, NoSQL is non-relational",
          "SQL is faster, NoSQL is slower",
          "SQL is for small data, NoSQL is for big data",
          "There is no difference"
        ],
        correctAnswer: "SQL is relational, NoSQL is non-relational",
        explanation: "SQL databases are relational with structured schemas, while NoSQL databases are non-relational with flexible schemas.",
        points: 10,
        timeLimit: 3
      },
      {
        questionType: "coding",
        question: "Implement a RESTful API endpoint that handles CRUD operations for a user resource.",
        explanation: "Include proper HTTP methods, status codes, error handling, and data validation.",
        points: 25,
        timeLimit: 15
      },
      {
        questionType: "system_design",
        question: "Design a URL shortening service like bit.ly. Consider scalability, performance, and data storage.",
        explanation: "Discuss database design, caching strategies, load balancing, and potential bottlenecks.",
        points: 30,
        timeLimit: 20
      },
      {
        questionType: "mcq",
        question: "What is the time complexity of a hash table lookup?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: "O(1)",
        explanation: "Hash table lookups have O(1) average case time complexity.",
        points: 10,
        timeLimit: 2
      }
    ]
  },
  {
    name: "Full Stack Developer Interview",
    description: "Complete full-stack interview covering both frontend and backend technologies, deployment, and DevOps.",
    duration: 120,
    difficulty: "hard",
    category: "fullstack",
    companies: ["Netflix", "Spotify", "Discord", "Slack"],
    questions: [
      {
        questionType: "mcq",
        question: "What is the purpose of environment variables in web applications?",
        options: [
          "To store sensitive configuration data",
          "To improve performance",
          "To enable debugging",
          "To reduce code size"
        ],
        correctAnswer: "To store sensitive configuration data",
        explanation: "Environment variables help keep sensitive data like API keys and database credentials secure.",
        points: 10,
        timeLimit: 2
      },
      {
        questionType: "coding",
        question: "Create a full-stack application with user authentication, a simple CRUD API, and a responsive frontend.",
        explanation: "Use any stack you prefer (MERN, LAMP, etc.) and focus on clean architecture.",
        points: 40,
        timeLimit: 30
      },
      {
        questionType: "system_design",
        question: "Design a real-time chat application supporting multiple rooms and user presence.",
        explanation: "Consider WebSockets, message persistence, user sessions, and scalability.",
        points: 35,
        timeLimit: 25
      },
      {
        questionType: "behavioral",
        question: "How do you handle conflicts in a team when there are disagreements about technical decisions?",
        explanation: "Focus on communication, data-driven decisions, and team collaboration.",
        points: 15,
        timeLimit: 5
      }
    ]
  },
  {
    name: "Machine Learning Engineer Interview",
    description: "ML-focused interview covering algorithms, data preprocessing, model evaluation, and practical ML applications.",
    duration: 90,
    difficulty: "hard",
    category: "ml",
    companies: ["Google", "OpenAI", "Tesla", "NVIDIA"],
    questions: [
      {
        questionType: "mcq",
        question: "What is the difference between supervised and unsupervised learning?",
        options: [
          "Supervised uses labeled data, unsupervised uses unlabeled data",
          "Supervised is faster, unsupervised is slower",
          "Supervised is for classification, unsupervised is for regression",
          "There is no difference"
        ],
        correctAnswer: "Supervised uses labeled data, unsupervised uses unlabeled data",
        explanation: "Supervised learning uses labeled training data, while unsupervised learning finds patterns in unlabeled data.",
        points: 10,
        timeLimit: 3
      },
      {
        questionType: "coding",
        question: "Implement a simple linear regression model from scratch using gradient descent.",
        explanation: "Include the mathematical formulation, gradient calculation, and training loop.",
        points: 30,
        timeLimit: 20
      },
      {
        questionType: "mcq",
        question: "What is overfitting in machine learning?",
        options: [
          "When a model performs well on training data but poorly on test data",
          "When a model is too simple",
          "When a model has too many parameters",
          "When a model is too slow"
        ],
        correctAnswer: "When a model performs well on training data but poorly on test data",
        explanation: "Overfitting occurs when a model learns the training data too well and fails to generalize to new data.",
        points: 10,
        timeLimit: 3
      },
      {
        questionType: "system_design",
        question: "Design a recommendation system for an e-commerce platform.",
        explanation: "Consider collaborative filtering, content-based filtering, and hybrid approaches.",
        points: 35,
        timeLimit: 25
      }
    ]
  }
];

async function seedInterviewTemplates() {
  try {
    console.log('🌱 Seeding interview templates...');

    for (const templateData of interviewTemplates) {
      // Create template
      const template = await prisma.interviewTemplate.create({
        data: {
          name: templateData.name,
          description: templateData.description,
          duration: templateData.duration,
          difficulty: templateData.difficulty,
          category: templateData.category,
          companies: JSON.stringify(templateData.companies)
        }
      });

      console.log(`✅ Created template: ${template.name}`);

      // Create questions for this template
      for (let i = 0; i < templateData.questions.length; i++) {
        const questionData = templateData.questions[i];
        await prisma.interviewQuestion.create({
          data: {
            templateId: template.id,
            questionType: questionData.questionType,
            question: questionData.question,
            options: questionData.options ? JSON.stringify(questionData.options) : null,
            correctAnswer: questionData.correctAnswer,
            explanation: questionData.explanation,
            points: questionData.points,
            timeLimit: questionData.timeLimit,
            order: i
          }
        });
      }

      console.log(`✅ Added ${templateData.questions.length} questions to ${template.name}`);
    }

    console.log('🎉 Interview templates seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding interview templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedInterviewTemplates();

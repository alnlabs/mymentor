#!/usr/bin/env node

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Get environment from command line args
const env = process.argv.includes("--env=test") ? "test" : "development";

console.log(`🌱 Seeding database for ${env} environment...`);

async function main() {
  try {
    // Clear existing data (optional - comment out if you want to preserve data)
    if (env === "test") {
      console.log("🧹 Clearing existing data for test environment...");
      await clearDatabase();
    }

    // Seed superadmin user
    await seedSuperAdmin();

    // Seed admin users
    await seedAdminUsers();

    // Seed regular users
    await seedRegularUsers();

    // Seed interview templates
    await seedInterviewTemplates();

    // Seed sample problems
    await seedSampleProblems();

    // Seed sample MCQ questions
    await seedSampleMCQs();

    // Seed sample exams
    await seedSampleExams();

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function clearDatabase() {
  const tables = [
    "exam_question_results",
    "exam_sessions",
    "exam_results",
    "exam_questions",
    "exams",
    "interview_feedback",
    "interview_answers",
    "interview_questions",
    "mock_interviews",
    "interview_templates",
    "user_progress",
    "submissions",
    "mcq_questions",
    "problems",
    "feedback",
    "users",
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
  }
}

async function seedSuperAdmin() {
  console.log("👑 Creating superadmin user...");

  const hashedPassword = await bcrypt.hash("superadmin123", 12);

  await prisma.user.upsert({
    where: { email: "superadmin@interview-platform.com" },
    update: {},
    create: {
      email: "superadmin@interview-platform.com",
      name: "Super Admin",
      password: hashedPassword,
      provider: "email",
      role: "superadmin",
      isActive: true,
      emailVerified: true,
      profileCompleted: true,
      firstName: "Super",
      lastName: "Admin",
    },
  });
}

async function seedAdminUsers() {
  console.log("👨‍💼 Creating admin users...");

  const adminUsers = [
    {
      email: "admin@interview-platform.com",
      name: "Platform Admin",
      password: "admin123",
      firstName: "Platform",
      lastName: "Admin",
    },
    {
      email: "content@interview-platform.com",
      name: "Content Manager",
      password: "content123",
      firstName: "Content",
      lastName: "Manager",
    },
  ];

  for (const user of adminUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        provider: "email",
        role: "admin",
        isActive: true,
        emailVerified: true,
        profileCompleted: true,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }
}

async function seedRegularUsers() {
  console.log("👥 Creating sample users...");

  const users = [
    {
      email: "john.doe@example.com",
      name: "John Doe",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    },
    {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      password: "password123",
      firstName: "Jane",
      lastName: "Smith",
    },
    {
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
      password: "password123",
      firstName: "Bob",
      lastName: "Wilson",
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        provider: "email",
        role: "user",
        isActive: true,
        emailVerified: true,
        profileCompleted: true,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }
}

async function seedInterviewTemplates() {
  console.log("📋 Creating interview templates...");

  const templates = [
    {
      name: "Frontend Developer Interview",
      description:
        "Comprehensive frontend development interview covering HTML, CSS, JavaScript, and modern frameworks",
      duration: 60,
      difficulty: "Medium",
      category: "Frontend Development",
      companies: JSON.stringify(["Google", "Facebook", "Netflix", "Airbnb"]),
    },
    {
      name: "Backend Developer Interview",
      description:
        "Backend development interview focusing on APIs, databases, and server-side technologies",
      duration: 90,
      difficulty: "Hard",
      category: "Backend Development",
      companies: JSON.stringify(["Amazon", "Microsoft", "Uber", "Stripe"]),
    },
    {
      name: "Full Stack Developer Interview",
      description:
        "Complete full-stack development interview covering both frontend and backend technologies",
      duration: 120,
      difficulty: "Hard",
      category: "Full Stack Development",
      companies: JSON.stringify(["Netflix", "Airbnb", "Uber", "Spotify"]),
    },
  ];

  for (const template of templates) {
    await prisma.interviewTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
  }
}

async function seedSampleProblems() {
  console.log("💻 Creating sample coding problems...");

  const problems = [
    {
      title: "Reverse String",
      description:
        "Write a function that reverses a string without using built-in reverse methods.",
      difficulty: "Easy",
      category: "Strings",
      subject: "Programming",
      topic: "String Manipulation",
      testCases: JSON.stringify([
        { input: '"hello"', output: '"olleh"' },
        { input: '"world"', output: '"dlrow"' },
        { input: '""', output: '""' },
      ]),
      solution:
        'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
      hints: JSON.stringify([
        "Try using array methods",
        "Consider using a loop",
      ]),
      tags: JSON.stringify(["strings", "algorithms", "beginner"]),
      companies: JSON.stringify(["Google", "Facebook", "Amazon"]),
    },
    {
      title: "Two Sum",
      description:
        "Given an array of integers and a target sum, find two numbers that add up to the target.",
      difficulty: "Medium",
      category: "Arrays",
      subject: "Programming",
      topic: "Hash Tables",
      testCases: JSON.stringify([
        { input: "[2, 7, 11, 15], 9", output: "[0, 1]" },
        { input: "[3, 2, 4], 6", output: "[1, 2]" },
        { input: "[3, 3], 6", output: "[0, 1]" },
      ]),
      solution:
        "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      hints: JSON.stringify(["Use a hash table", "Look for complement"]),
      tags: JSON.stringify(["arrays", "hash-table", "algorithms"]),
      companies: JSON.stringify(["Google", "Amazon", "Microsoft"]),
    },
  ];

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { title: problem.title },
      update: {},
      create: problem,
    });
  }
}

async function seedSampleMCQs() {
  console.log("❓ Creating sample MCQ questions...");

  const mcqs = [
    {
      question:
        "What is the time complexity of accessing an element in an array?",
      options: JSON.stringify(["O(1)", "O(n)", "O(log n)", "O(n²)"]),
      correctAnswer: 0,
      explanation:
        "Array access is O(1) because you can directly access any element using its index.",
      category: "Data Structures",
      subject: "Computer Science",
      topic: "Arrays",
      difficulty: "Easy",
      tags: JSON.stringify(["arrays", "time-complexity", "data-structures"]),
      companies: JSON.stringify(["Google", "Facebook", "Amazon"]),
    },
    {
      question: "Which of the following is NOT a JavaScript framework?",
      options: JSON.stringify(["React", "Angular", "Vue", "Django"]),
      correctAnswer: 3,
      explanation:
        "Django is a Python web framework, not a JavaScript framework.",
      category: "Web Development",
      subject: "Programming",
      topic: "Frameworks",
      difficulty: "Easy",
      tags: JSON.stringify(["javascript", "frameworks", "web-development"]),
      companies: JSON.stringify(["Netflix", "Airbnb", "Uber"]),
    },
    {
      question: "What is the primary purpose of a database index?",
      options: JSON.stringify([
        "To save storage space",
        "To improve query performance",
        "To ensure data integrity",
        "To backup data",
      ]),
      correctAnswer: 1,
      explanation:
        "Database indexes are created to improve query performance by reducing the number of disk accesses required.",
      category: "Databases",
      subject: "Computer Science",
      topic: "Database Optimization",
      difficulty: "Medium",
      tags: JSON.stringify(["databases", "performance", "optimization"]),
      companies: JSON.stringify(["Amazon", "Microsoft", "Oracle"]),
    },
  ];

  for (const mcq of mcqs) {
    await prisma.mCQQuestion.upsert({
      where: { question: mcq.question },
      update: {},
      create: mcq,
    });
  }
}

async function seedSampleExams() {
  console.log("📝 Creating sample exams...");

  const exams = [
    {
      title: "JavaScript Fundamentals",
      description:
        "Test your knowledge of JavaScript basics including variables, functions, and control structures",
      duration: 30,
      difficulty: "Easy",
      category: "Programming",
      targetRole: "Frontend Developer",
      questionTypes: "MCQ",
      totalQuestions: 10,
      passingScore: 70,
    },
    {
      title: "Data Structures & Algorithms",
      description:
        "Comprehensive test covering arrays, linked lists, trees, and basic algorithms",
      duration: 60,
      difficulty: "Medium",
      category: "Computer Science",
      targetRole: "Software Engineer",
      questionTypes: "Mixed",
      totalQuestions: 20,
      passingScore: 75,
    },
    {
      title: "System Design",
      description:
        "Advanced system design concepts including scalability, distributed systems, and architecture patterns",
      duration: 90,
      difficulty: "Hard",
      category: "System Design",
      targetRole: "Senior Developer",
      questionTypes: "Mixed",
      totalQuestions: 15,
      passingScore: 80,
    },
  ];

  for (const exam of exams) {
    await prisma.exam.upsert({
      where: { title: exam.title },
      update: {},
      create: exam,
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

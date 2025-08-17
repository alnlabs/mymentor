const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting simple database seeding...");

  // Create settings
  console.log("⚙️ Creating settings...");
  const settings = [
    {
      key: "app_name",
      value: "MyMentor",
      category: "general",
      description: "Application name",
    },
    {
      key: "app_version",
      value: "1.0.0",
      category: "general",
      description: "Application version",
    },
    {
      key: "max_problems_per_page",
      value: "20",
      category: "pagination",
      description: "Maximum problems to show per page",
    },
    {
      key: "enable_code_execution",
      value: "true",
      category: "features",
      description: "Enable code execution feature",
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Create global configs
  console.log("🔧 Creating global configs...");
  const configs = [
    {
      key: "app_name",
      value: "MyMentor",
      type: "string",
      description: "Application name",
    },
    {
      key: "app_version",
      value: "1.0.0",
      type: "string",
      description: "Application version",
    },
    {
      key: "max_problems_per_page",
      value: "20",
      type: "number",
      description: "Maximum problems to show per page",
    },
    {
      key: "enable_code_execution",
      value: "true",
      type: "boolean",
      description: "Enable code execution feature",
    },
  ];

  for (const config of configs) {
    await prisma.globalConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  // Create categories
  console.log("📂 Creating categories...");
  const categories = [
    {
      name: "Programming",
      type: "question",
      description: "Programming related questions",
      color: "#3B82F6",
      icon: "code",
    },
    {
      name: "Computer Science",
      type: "question",
      description: "Computer science fundamentals",
      color: "#10B981",
      icon: "cpu",
    },
    {
      name: "System Design",
      type: "question",
      description: "System design and architecture",
      color: "#F59E0B",
      icon: "layers",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Create a superadmin user
  console.log("👤 Creating superadmin user...");
  const bcrypt = require("bcryptjs");
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
    },
  });

  // Create an admin user
  console.log("👤 Creating admin user...");
  const adminHashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@interview-platform.com" },
    update: {},
    create: {
      email: "admin@interview-platform.com",
      name: "Admin User",
      password: adminHashedPassword,
      provider: "email",
      role: "admin",
      isActive: true,
    },
  });

  // Create some sample problems
  console.log("💻 Creating sample problems...");
  const problems = [
    {
      title: "Reverse String",
      description: "Write a function to reverse a string",
      difficulty: "Easy",
      category: "Programming",
      subject: "JavaScript",
      topic: "Strings",
      testCases: JSON.stringify([
        { input: '"hello"', output: '"olleh"' },
        { input: '"world"', output: '"dlrow"' },
      ]),
      solution:
        'function reverseString(str) { return str.split("").reverse().join(""); }',
      hints: "Think about using array methods like split, reverse, and join",
    },
    {
      title: "Two Sum",
      description:
        "Given an array of integers and a target sum, find two numbers that add up to the target",
      difficulty: "Medium",
      category: "Programming",
      subject: "JavaScript",
      topic: "Arrays",
      testCases: JSON.stringify([
        { input: "[2, 7, 11, 15], 9", output: "[0, 1]" },
        { input: "[3, 2, 4], 6", output: "[1, 2]" },
      ]),
      solution:
        "function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) return [map.get(complement), i]; map.set(nums[i], i); } return []; }",
      hints: "Use a hash map to store numbers and their indices",
    },
  ];

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { title: problem.title },
      update: {},
      create: problem,
    });
  }

  // Create some sample MCQ questions
  console.log("❓ Creating sample MCQ questions...");
  const mcqQuestions = [
    {
      question: "What is the output of console.log(typeof null)?",
      options: JSON.stringify(["object", "null", "undefined", "boolean"]),
      correctAnswer: 0,
      explanation:
        'In JavaScript, typeof null returns "object". This is a known bug in JavaScript.',
      category: "Programming",
      subject: "JavaScript",
      topic: "Data Types",
      difficulty: "Easy",
    },
    {
      question:
        "Which method is used to add an element to the end of an array?",
      options: JSON.stringify(["push()", "pop()", "shift()", "unshift()"]),
      correctAnswer: 0,
      explanation:
        "The push() method adds one or more elements to the end of an array and returns the new length.",
      category: "Programming",
      subject: "JavaScript",
      topic: "Arrays",
      difficulty: "Easy",
    },
  ];

  for (const mcq of mcqQuestions) {
    await prisma.mCQQuestion.upsert({
      where: { question: mcq.question },
      update: {},
      create: mcq,
    });
  }

  console.log("✅ Simple seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

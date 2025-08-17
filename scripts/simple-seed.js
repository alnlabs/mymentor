#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Essential users only
const essentialUsers = [
  {
    email: 'superadmin@interview-platform.com',
    name: 'Super Admin',
    password: 'superadmin123',
    role: 'superadmin',
    provider: 'email',
    isActive: true,
  },
  {
    email: 'admin@interview-platform.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'admin',
    provider: 'email',
    isActive: true,
  },
  {
    email: 'john.doe@example.com',
    name: 'John Doe',
    password: 'password123',
    role: 'user',
    provider: 'email',
    isActive: true,
  },
];

// Minimal content for testing
const minimalProblems = [
  {
    title: 'Hello World',
    description: 'Write a function that returns "Hello, World!"',
    difficulty: 'easy',
    category: 'basics',
    subject: 'Programming Fundamentals',
    topic: 'Basic Functions',
    tool: 'JavaScript',
    technologyStack: 'JavaScript',
    domain: 'Programming',
    skillLevel: 'beginner',
    jobRole: 'Student',
    companyType: 'Tech',
    interviewType: 'Technical',
    testCases: JSON.stringify([
      { input: '', output: '"Hello, World!"' }
    ]),
    solution: 'function helloWorld() { return "Hello, World!"; }',
    hints: JSON.stringify(['Just return the string']),
    tags: 'basics,functions,beginner',
    companies: 'All',
    priority: 'low',
    status: 'active',
  },
];

const minimalMCQs = [
  {
    question: 'What is 2 + 2?',
    options: JSON.stringify(['3', '4', '5', '6']),
    correctAnswer: 1,
    explanation: 'Basic arithmetic: 2 + 2 = 4',
    category: 'basics',
    subject: 'Mathematics',
    topic: 'Basic Arithmetic',
    tool: 'General',
    technologyStack: 'General',
    domain: 'Mathematics',
    skillLevel: 'beginner',
    jobRole: 'Student',
    companyType: 'All',
    interviewType: 'General',
    difficulty: 'easy',
    tags: 'basics,math,beginner',
    companies: 'All',
    priority: 'low',
    status: 'active',
  },
];

async function simpleSeed() {
  console.log('🌱 Starting simple database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.userProgress.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.examQuestion.deleteMany();
    await prisma.examResult.deleteMany();
    await prisma.examSession.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.interviewAnswer.deleteMany();
    await prisma.interviewFeedback.deleteMany();
    await prisma.interviewQuestion.deleteMany();
    await prisma.mockInterview.deleteMany();
    await prisma.interviewTemplate.deleteMany();
    await prisma.mCQQuestion.deleteMany();
    await prisma.problem.deleteMany();
    await prisma.user.deleteMany();

    // Create essential users
    console.log('👥 Creating essential users...');
    for (const userData of essentialUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
    }

    // Create minimal problems
    console.log('💻 Creating minimal coding problems...');
    for (const problemData of minimalProblems) {
      await prisma.problem.create({
        data: problemData,
      });
    }

    // Create minimal MCQs
    console.log('❓ Creating minimal MCQ questions...');
    for (const mcqData of minimalMCQs) {
      await prisma.mCQQuestion.create({
        data: mcqData,
      });
    }

    console.log('✅ Simple seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`- ${essentialUsers.length} users created`);
    console.log(`- ${minimalProblems.length} coding problems created`);
    console.log(`- ${minimalMCQs.length} MCQ questions created`);

    console.log('\n👑 Login Credentials:');
    console.log('- Super Admin: superadmin@interview-platform.com / superadmin123');
    console.log('- Admin: admin@interview-platform.com / admin123');
    console.log('- User: john.doe@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

simpleSeed()
  .then(() => {
    console.log('🎉 Simple seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Simple seeding failed:', error);
    process.exit(1);
  });

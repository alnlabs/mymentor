#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Default users data
const defaultUsers = [
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
    email: 'content@interview-platform.com',
    name: 'Content Manager',
    password: 'content123',
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
  {
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    password: 'password123',
    role: 'user',
    provider: 'email',
    isActive: true,
  },
  {
    email: 'bob.wilson@example.com',
    name: 'Bob Wilson',
    password: 'password123',
    role: 'user',
    provider: 'email',
    isActive: true,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

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

    // Create users only
    console.log('👥 Creating default users...');
    for (const userData of defaultUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`- ${defaultUsers.length} users created`);

    console.log('\n👑 Default Login Credentials:');
    console.log('- Super Admin: superadmin@interview-platform.com / superadmin123');
    console.log('- Admin: admin@interview-platform.com / admin123');
    console.log('- Content Manager: content@interview-platform.com / content123');
    console.log('- User: john.doe@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Check if running in test environment
const isTestEnv = process.argv.includes('--env=test');

if (isTestEnv) {
  console.log('🧪 Running in test environment...');
}

seedDatabase()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });

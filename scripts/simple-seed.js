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

    // Create essential users only
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

    console.log('✅ Simple seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`- ${essentialUsers.length} users created`);

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

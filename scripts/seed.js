const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seed() {
  try {
    // Read sample data
    const problemsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/problems.json'), 'utf8'));
    const mcqData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/mcq.json'), 'utf8'));

    console.log('Seeding problems...');
    for (const problem of problemsData) {
      await prisma.problem.upsert({
        where: { id: problem.id },
        update: problem,
        create: problem,
      });
    }

    console.log('Seeding MCQ questions...');
    for (const question of mcqData) {
      await prisma.mCQQuestion.upsert({
        where: { id: question.id },
        update: question,
        create: question,
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

#!/usr/bin/env node

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Create separate Prisma clients for SQLite and PostgreSQL
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db", // SQLite database
    },
  },
});

const postgresPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // PostgreSQL database from environment
    },
  },
});

console.log("🔄 Starting migration from SQLite to PostgreSQL...");

async function migrateData() {
  try {
    console.log("📊 Checking SQLite database...");

    // Check if SQLite database exists
    const sqlitePath = path.join(__dirname, "../prisma/dev.db");
    if (!fs.existsSync(sqlitePath)) {
      console.log("⚠️  SQLite database not found. Skipping data migration.");
      return;
    }

    console.log("🔍 Reading data from SQLite...");

    // Read data from SQLite
    const users = await sqlitePrisma.user.findMany();
    const problems = await sqlitePrisma.problem.findMany();
    const mcqQuestions = await sqlitePrisma.mCQQuestion.findMany();
    const submissions = await sqlitePrisma.submission.findMany();
    const userProgress = await sqlitePrisma.userProgress.findMany();
    const interviewTemplates = await sqlitePrisma.interviewTemplate.findMany();
    const mockInterviews = await sqlitePrisma.mockInterview.findMany();
    const interviewQuestions = await sqlitePrisma.interviewQuestion.findMany();
    const interviewAnswers = await sqlitePrisma.interviewAnswer.findMany();
    const interviewFeedback = await sqlitePrisma.interviewFeedback.findMany();
    const exams = await sqlitePrisma.exam.findMany();
    const examQuestions = await sqlitePrisma.examQuestion.findMany();
    const examResults = await sqlitePrisma.examResult.findMany();
    const examSessions = await sqlitePrisma.examSession.findMany();
    const examQuestionResults =
      await sqlitePrisma.examQuestionResult.findMany();
    const feedback = await sqlitePrisma.feedback.findMany();

    console.log(`📈 Found data to migrate:`);
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Problems: ${problems.length}`);
    console.log(`  - MCQ Questions: ${mcqQuestions.length}`);
    console.log(`  - Submissions: ${submissions.length}`);
    console.log(`  - User Progress: ${userProgress.length}`);
    console.log(`  - Interview Templates: ${interviewTemplates.length}`);
    console.log(`  - Mock Interviews: ${mockInterviews.length}`);
    console.log(`  - Interview Questions: ${interviewQuestions.length}`);
    console.log(`  - Interview Answers: ${interviewAnswers.length}`);
    console.log(`  - Interview Feedback: ${interviewFeedback.length}`);
    console.log(`  - Exams: ${exams.length}`);
    console.log(`  - Exam Questions: ${examQuestions.length}`);
    console.log(`  - Exam Results: ${examResults.length}`);
    console.log(`  - Exam Sessions: ${examSessions.length}`);
    console.log(`  - Exam Question Results: ${examQuestionResults.length}`);
    console.log(`  - Feedback: ${feedback.length}`);

    console.log("🗄️  Writing data to PostgreSQL...");

    // Migrate data to PostgreSQL
    if (users.length > 0) {
      console.log("👥 Migrating users...");
      for (const user of users) {
        await postgresPrisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: user,
        });
      }
    }

    if (problems.length > 0) {
      console.log("💻 Migrating problems...");
      for (const problem of problems) {
        await postgresPrisma.problem.upsert({
          where: { title: problem.title },
          update: {},
          create: problem,
        });
      }
    }

    if (mcqQuestions.length > 0) {
      console.log("❓ Migrating MCQ questions...");
      for (const mcq of mcqQuestions) {
        await postgresPrisma.mCQQuestion.upsert({
          where: { question: mcq.question },
          update: {},
          create: mcq,
        });
      }
    }

    if (interviewTemplates.length > 0) {
      console.log("📋 Migrating interview templates...");
      for (const template of interviewTemplates) {
        await postgresPrisma.interviewTemplate.upsert({
          where: { name: template.name },
          update: {},
          create: template,
        });
      }
    }

    if (exams.length > 0) {
      console.log("📝 Migrating exams...");
      for (const exam of exams) {
        await postgresPrisma.exam.upsert({
          where: { title: exam.title },
          update: {},
          create: exam,
        });
      }
    }

    // Migrate related data (these depend on the above)
    if (submissions.length > 0) {
      console.log("📤 Migrating submissions...");
      for (const submission of submissions) {
        await postgresPrisma.submission.upsert({
          where: { id: submission.id },
          update: {},
          create: submission,
        });
      }
    }

    if (userProgress.length > 0) {
      console.log("📈 Migrating user progress...");
      for (const progress of userProgress) {
        await postgresPrisma.userProgress.upsert({
          where: { id: progress.id },
          update: {},
          create: progress,
        });
      }
    }

    if (interviewQuestions.length > 0) {
      console.log("❓ Migrating interview questions...");
      for (const question of interviewQuestions) {
        await postgresPrisma.interviewQuestion.upsert({
          where: { id: question.id },
          update: {},
          create: question,
        });
      }
    }

    if (mockInterviews.length > 0) {
      console.log("🎯 Migrating mock interviews...");
      for (const interview of mockInterviews) {
        await postgresPrisma.mockInterview.upsert({
          where: { id: interview.id },
          update: {},
          create: interview,
        });
      }
    }

    if (interviewAnswers.length > 0) {
      console.log("✍️  Migrating interview answers...");
      for (const answer of interviewAnswers) {
        await postgresPrisma.interviewAnswer.upsert({
          where: { id: answer.id },
          update: {},
          create: answer,
        });
      }
    }

    if (interviewFeedback.length > 0) {
      console.log("💬 Migrating interview feedback...");
      for (const feedback of interviewFeedback) {
        await postgresPrisma.interviewFeedback.upsert({
          where: { id: feedback.id },
          update: {},
          create: feedback,
        });
      }
    }

    if (examQuestions.length > 0) {
      console.log("📝 Migrating exam questions...");
      for (const examQuestion of examQuestions) {
        await postgresPrisma.examQuestion.upsert({
          where: { id: examQuestion.id },
          update: {},
          create: examQuestion,
        });
      }
    }

    if (examSessions.length > 0) {
      console.log("⏱️  Migrating exam sessions...");
      for (const session of examSessions) {
        await postgresPrisma.examSession.upsert({
          where: { id: session.id },
          update: {},
          create: session,
        });
      }
    }

    if (examResults.length > 0) {
      console.log("📊 Migrating exam results...");
      for (const result of examResults) {
        await postgresPrisma.examResult.upsert({
          where: { id: result.id },
          update: {},
          create: result,
        });
      }
    }

    if (examQuestionResults.length > 0) {
      console.log("📋 Migrating exam question results...");
      for (const result of examQuestionResults) {
        await postgresPrisma.examQuestionResult.upsert({
          where: { id: result.id },
          update: {},
          create: result,
        });
      }
    }

    if (feedback.length > 0) {
      console.log("💭 Migrating feedback...");
      for (const feedbackItem of feedback) {
        await postgresPrisma.feedback.upsert({
          where: { id: feedbackItem.id },
          update: {},
          create: feedbackItem,
        });
      }
    }

    console.log("✅ Migration completed successfully!");

    // Create backup of SQLite database
    const backupPath = path.join(__dirname, "../prisma/dev.db.backup");
    fs.copyFileSync(sqlitePath, backupPath);
    console.log(`💾 SQLite database backed up to: ${backupPath}`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await sqlitePrisma.$disconnect();
    await postgresPrisma.$disconnect();
  }
}

migrateData().catch((e) => {
  console.error(e);
  process.exit(1);
});

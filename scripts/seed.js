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
    email: 'user@interview-platform.com',
    name: 'Test User',
    password: 'password123',
    role: 'user',
    provider: 'email',
    isActive: true,
  },
];

// Default Content Management Fields
const defaultContentFields = [
  {
    key: 'content_programming_languages',
    value: 'JavaScript,Python,Java,C++,C#,PHP,Ruby,Go,Rust,Swift,Kotlin,TypeScript,Dart,Elixir,Clojure,Scala',
    category: 'content',
    description: 'Programming languages for content categorization',
  },
  {
    key: 'content_technology_stacks',
    value: 'Frontend,Backend,Full Stack,Mobile,Cloud,DevOps,AI/ML,Blockchain,IoT,Cybersecurity,Data Science,Game Development',
    category: 'content',
    description: 'Technology stacks and domains',
  },
  {
    key: 'content_tools',
    value: 'Docker,Kubernetes,AWS,Azure,GCP,React,Angular,Vue,Node.js,Django,Flask,Spring Boot,MySQL,PostgreSQL,MongoDB,Redis',
    category: 'content',
    description: 'Tools and technologies',
  },
  {
    key: 'content_subjects',
    value: 'Programming Fundamentals,Data Structures,Algorithms,Web Development,Mobile Development,Database Systems,Computer Networks,Operating Systems,Software Engineering,Cybersecurity,Artificial Intelligence,Machine Learning,Blockchain,Internet of Things',
    category: 'content',
    description: 'Academic subjects and topics',
  },
  {
    key: 'content_topics',
    value: 'Arrays,String Manipulation,Linked Lists,Trees,Graphs,Dynamic Programming,Greedy Algorithms,Binary Search,Sorting,Hash Tables,Recursion,Backtracking,Two Pointers,Sliding Window,Stack,Queue,Heap,Bit Manipulation,Math,Geometry',
    category: 'content',
    description: 'Specific technical topics',
  },
  {
    key: 'content_domains',
    value: 'Web Development,Mobile Apps,Desktop Applications,Game Development,Data Science,Artificial Intelligence,Machine Learning,Cybersecurity,Blockchain,Internet of Things,Cloud Computing,DevOps,Quality Assurance,Product Management,UI/UX Design',
    category: 'content',
    description: 'Application domains and industries',
  },
  {
    key: 'content_categories',
    value: 'Frontend,Backend,Full Stack,Mobile,DevOps,Data Science,AI/ML,Cybersecurity,Blockchain,Game Development,Embedded Systems,Cloud Computing',
    category: 'content',
    description: 'Content categories',
  },
  {
    key: 'content_skill_levels',
    value: 'Beginner,Intermediate,Advanced,Expert,Senior,Lead,Architect',
    category: 'content',
    description: 'Skill levels for content',
  },
  {
    key: 'content_interview_types',
    value: 'Technical,Behavioral,System Design,Coding Challenge,Take Home,Whiteboard,Phone Screen,Onsite,Panel,Case Study,Group Discussion',
    category: 'content',
    description: 'Types of interviews',
  },
  {
    key: 'content_target_roles',
    value: 'Software Engineer,Frontend Developer,Backend Developer,Full Stack Developer,Mobile Developer,DevOps Engineer,Data Scientist,Machine Learning Engineer,QA Engineer,Product Manager,UI/UX Designer,Technical Lead,Engineering Manager',
    category: 'content',
    description: 'Target job roles',
  },
  {
    key: 'content_job_roles',
    value: 'Junior Developer,Mid-level Developer,Senior Developer,Technical Lead,Engineering Manager,Architect,CTO,VP Engineering,Director of Engineering',
    category: 'content',
    description: 'Job roles and positions',
  },
  {
    key: 'content_company_types',
    value: 'Startup,Scale-up,Enterprise,Government,Non-profit,Consulting,Product Company,Service Company,FinTech,HealthTech,EdTech,E-commerce,SaaS',
    category: 'content',
    description: 'Types of companies',
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
    await prisma.setting.deleteMany();

    // Create users
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

    // Create Content Management Fields
    console.log('⚙️ Creating Content Management Fields...');
    for (const fieldData of defaultContentFields) {
      await prisma.setting.create({
        data: fieldData,
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`- ${defaultUsers.length} users created`);
    console.log(`- ${defaultContentFields.length} content management fields created`);

    console.log('\n👑 Default Login Credentials:');
    console.log('- Super Admin: superadmin@interview-platform.com / superadmin123');
    console.log('- Admin: admin@interview-platform.com / admin123');
    console.log('- User: user@interview-platform.com / password123');

    console.log('\n📝 Content Management Fields Added:');
    console.log('- Programming Languages (15 options)');
    console.log('- Technology Stacks (12 options)');
    console.log('- Tools & Technologies (16 options)');
    console.log('- Subjects (14 options)');
    console.log('- Topics (20 options)');
    console.log('- Domains (15 options)');
    console.log('- Categories (12 options)');
    console.log('- Skill Levels (7 options)');
    console.log('- Interview Types (11 options)');
    console.log('- Target Roles (13 options)');
    console.log('- Job Roles (9 options)');
    console.log('- Company Types (13 options)');

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

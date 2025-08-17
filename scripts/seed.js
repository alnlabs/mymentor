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

// Default coding problems
const defaultProblems = [
  {
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    difficulty: 'easy',
    category: 'strings',
    subject: 'Programming Fundamentals',
    topic: 'String Manipulation',
    tool: 'JavaScript',
    technologyStack: 'JavaScript',
    domain: 'Programming',
    skillLevel: 'beginner',
    jobRole: 'Frontend Developer',
    companyType: 'Tech',
    interviewType: 'Technical',
    testCases: JSON.stringify([
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
    ]),
    solution: 'Use two pointers approach: one at the beginning and one at the end, swap characters and move pointers inward.',
    hints: JSON.stringify(['Try using two pointers', 'Think about swapping elements']),
    tags: 'strings,algorithms,two-pointers,beginner',
    companies: 'Google,Amazon,Microsoft',
    priority: 'medium',
    status: 'active',
  },
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'medium',
    category: 'arrays',
    subject: 'Data Structures',
    topic: 'Hash Tables',
    tool: 'JavaScript',
    technologyStack: 'JavaScript',
    domain: 'Programming',
    skillLevel: 'intermediate',
    jobRole: 'Backend Developer',
    companyType: 'Tech',
    interviewType: 'Technical',
    testCases: JSON.stringify([
      { input: '[2,7,11,15], target = 9', output: '[0,1]' },
      { input: '[3,2,4], target = 6', output: '[1,2]' }
    ]),
    solution: 'Use a hash map to store complements. For each number, check if its complement exists in the map.',
    hints: JSON.stringify(['Use a hash table', 'Look for complements']),
    tags: 'arrays,hash-table,algorithms,intermediate',
    companies: 'Google,Amazon,Microsoft,Facebook',
    priority: 'high',
    status: 'active',
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    difficulty: 'easy',
    category: 'stacks',
    subject: 'Data Structures',
    topic: 'Stack',
    tool: 'JavaScript',
    technologyStack: 'JavaScript',
    domain: 'Programming',
    skillLevel: 'beginner',
    jobRole: 'Full Stack Developer',
    companyType: 'Tech',
    interviewType: 'Technical',
    testCases: JSON.stringify([
      { input: '"()"', output: 'true' },
      { input: '"()[]{}"', output: 'true' },
      { input: '"(]"', output: 'false' }
    ]),
    solution: 'Use a stack to keep track of opening brackets. For each closing bracket, check if it matches the top of the stack.',
    hints: JSON.stringify(['Use a stack', 'Check for matching brackets']),
    tags: 'stack,strings,algorithms,beginner',
    companies: 'Google,Amazon,Microsoft',
    priority: 'medium',
    status: 'active',
  },
];

// Default MCQ questions
const defaultMCQs = [
  {
    question: 'What is the time complexity of accessing an element in an array?',
    options: JSON.stringify(['O(1)', 'O(n)', 'O(log n)', 'O(n²)']),
    correctAnswer: 0,
    explanation: 'Array access is O(1) because you can directly access any element using its index.',
    category: 'data-structures',
    subject: 'Data Structures',
    topic: 'Arrays',
    tool: 'General',
    technologyStack: 'General',
    domain: 'Computer Science',
    skillLevel: 'beginner',
    jobRole: 'Software Engineer',
    companyType: 'Tech',
    interviewType: 'Technical',
    difficulty: 'easy',
    tags: 'arrays,time-complexity,data-structures,beginner',
    companies: 'Google,Amazon,Microsoft',
    priority: 'medium',
    status: 'active',
  },
  {
    question: 'Which of the following is NOT a JavaScript framework?',
    options: JSON.stringify(['React', 'Angular', 'Vue', 'Django']),
    correctAnswer: 3,
    explanation: 'Django is a Python web framework, not a JavaScript framework.',
    category: 'web-development',
    subject: 'Web Development',
    topic: 'JavaScript Frameworks',
    tool: 'JavaScript',
    technologyStack: 'JavaScript',
    domain: 'Web Development',
    skillLevel: 'beginner',
    jobRole: 'Frontend Developer',
    companyType: 'Tech',
    interviewType: 'Technical',
    difficulty: 'easy',
    tags: 'javascript,frameworks,web-development,beginner',
    companies: 'Google,Amazon,Microsoft,Facebook',
    priority: 'medium',
    status: 'active',
  },
  {
    question: 'What is the purpose of database indexing?',
    options: JSON.stringify(['To increase storage space', 'To improve query performance', 'To reduce data integrity', 'To simplify database design']),
    correctAnswer: 1,
    explanation: 'Database indexing improves query performance by creating data structures that allow faster data retrieval.',
    category: 'database',
    subject: 'Database Systems',
    topic: 'Database Optimization',
    tool: 'SQL',
    technologyStack: 'SQL',
    domain: 'Database',
    skillLevel: 'intermediate',
    jobRole: 'Backend Developer',
    companyType: 'Tech',
    interviewType: 'Technical',
    difficulty: 'medium',
    tags: 'database,indexing,optimization,intermediate',
    companies: 'Google,Amazon,Microsoft,Oracle',
    priority: 'high',
    status: 'active',
  },
  {
    question: 'What is the difference between let and const in JavaScript?',
    options: JSON.stringify(['let is block-scoped, const is function-scoped', 'let can be reassigned, const cannot', 'const is faster than let', 'There is no difference']),
    correctAnswer: 1,
    explanation: 'let allows reassignment while const creates a read-only reference that cannot be reassigned.',
    category: 'javascript',
    subject: 'JavaScript',
    topic: 'Variables',
    tool: 'JavaScript',
    technologyStack: 'JavaScript',
    domain: 'Programming',
    skillLevel: 'beginner',
    jobRole: 'Frontend Developer',
    companyType: 'Tech',
    interviewType: 'Technical',
    difficulty: 'easy',
    tags: 'javascript,variables,es6,beginner',
    companies: 'Google,Amazon,Microsoft,Facebook',
    priority: 'medium',
    status: 'active',
  },
  {
    question: 'What is the time complexity of binary search?',
    options: JSON.stringify(['O(1)', 'O(log n)', 'O(n)', 'O(n²)']),
    correctAnswer: 1,
    explanation: 'Binary search has O(log n) time complexity because it divides the search space in half with each iteration.',
    category: 'algorithms',
    subject: 'Algorithms',
    topic: 'Search Algorithms',
    tool: 'General',
    technologyStack: 'General',
    domain: 'Computer Science',
    skillLevel: 'intermediate',
    jobRole: 'Software Engineer',
    companyType: 'Tech',
    interviewType: 'Technical',
    difficulty: 'medium',
    tags: 'algorithms,binary-search,time-complexity,intermediate',
    companies: 'Google,Amazon,Microsoft,Facebook',
    priority: 'high',
    status: 'active',
  },
];

// Default interview templates
const defaultInterviewTemplates = [
  {
    name: 'Frontend Developer Interview',
    description: 'Comprehensive interview for frontend developer positions covering HTML, CSS, JavaScript, and modern frameworks.',
    duration: 60,
    difficulty: 'medium',
    category: 'frontend',
    companies: 'Google,Amazon,Microsoft,Facebook',
  },
  {
    name: 'Backend Developer Interview',
    description: 'Technical interview for backend developer roles focusing on databases, APIs, and server-side technologies.',
    duration: 90,
    difficulty: 'hard',
    category: 'backend',
    companies: 'Google,Amazon,Microsoft,Netflix',
  },
  {
    name: 'Full Stack Developer Interview',
    description: 'Complete interview covering both frontend and backend technologies for full stack developer positions.',
    duration: 120,
    difficulty: 'hard',
    category: 'fullstack',
    companies: 'Google,Amazon,Microsoft,Facebook,Netflix',
  },
];

// Default interview questions
const defaultInterviewQuestions = [
  // Frontend Developer Questions
  {
    templateName: 'Frontend Developer Interview',
    questions: [
      {
        questionType: 'technical',
        question: 'Explain the difference between let, const, and var in JavaScript.',
        options: null,
        correctAnswer: null,
        explanation: 'var is function-scoped and can be redeclared. let is block-scoped and can be reassigned. const is block-scoped and cannot be reassigned.',
        points: 10,
        timeLimit: 120,
        order: 1,
      },
      {
        questionType: 'technical',
        question: 'What is the Virtual DOM in React and why is it used?',
        options: null,
        correctAnswer: null,
        explanation: 'Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance by minimizing direct DOM manipulation.',
        points: 15,
        timeLimit: 180,
        order: 2,
      },
      {
        questionType: 'coding',
        question: 'Write a function to reverse a string in JavaScript.',
        options: null,
        correctAnswer: null,
        explanation: 'function reverseString(str) { return str.split("").reverse().join(""); }',
        points: 20,
        timeLimit: 300,
        order: 3,
      },
    ],
  },
  // Backend Developer Questions
  {
    templateName: 'Backend Developer Interview',
    questions: [
      {
        questionType: 'technical',
        question: 'Explain the difference between SQL and NoSQL databases.',
        options: null,
        correctAnswer: null,
        explanation: 'SQL databases are relational and use structured query language. NoSQL databases are non-relational and can be document-based, key-value, or graph-based.',
        points: 15,
        timeLimit: 180,
        order: 1,
      },
      {
        questionType: 'technical',
        question: 'What is REST API and what are its main principles?',
        options: null,
        correctAnswer: null,
        explanation: 'REST (Representational State Transfer) is an architectural style with principles like statelessness, client-server separation, and uniform interface.',
        points: 15,
        timeLimit: 180,
        order: 2,
      },
      {
        questionType: 'coding',
        question: 'Write a function to find the second largest number in an array.',
        options: null,
        correctAnswer: null,
        explanation: 'function findSecondLargest(arr) { return arr.sort((a,b) => b-a)[1]; }',
        points: 20,
        timeLimit: 300,
        order: 3,
      },
    ],
  },
];

// Default exams
const defaultExams = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Basic JavaScript concepts including variables, functions, and DOM manipulation.',
    duration: 30,
    difficulty: 'easy',
    category: 'javascript',
    targetRole: 'Frontend Developer',
    questionTypes: JSON.stringify(['mcq']),
    totalQuestions: 10,
    passingScore: 70,
    enableTimedQuestions: true,
    enableOverallTimer: true,
    defaultQuestionTime: 120,
    isActive: true,
    isPublic: true,
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Core concepts of data structures and algorithms for technical interviews.',
    duration: 60,
    difficulty: 'medium',
    category: 'algorithms',
    targetRole: 'Software Engineer',
    questionTypes: JSON.stringify(['mcq', 'coding']),
    totalQuestions: 15,
    passingScore: 60,
    enableTimedQuestions: true,
    enableOverallTimer: true,
    defaultQuestionTime: 180,
    isActive: true,
    isPublic: true,
  },
  {
    title: 'System Design Basics',
    description: 'Introduction to system design concepts and distributed systems.',
    duration: 90,
    difficulty: 'hard',
    category: 'system-design',
    targetRole: 'Senior Developer',
    questionTypes: JSON.stringify(['mcq']),
    totalQuestions: 20,
    passingScore: 65,
    enableTimedQuestions: true,
    enableOverallTimer: true,
    defaultQuestionTime: 240,
    isActive: true,
    isPublic: true,
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

    // Create problems
    console.log('💻 Creating default coding problems...');
    for (const problemData of defaultProblems) {
      await prisma.problem.create({
        data: problemData,
      });
    }

    // Create MCQ questions
    console.log('❓ Creating default MCQ questions...');
    for (const mcqData of defaultMCQs) {
      await prisma.mCQQuestion.create({
        data: mcqData,
      });
    }

    // Create interview templates and questions
    console.log('🎯 Creating default interview templates...');
    for (const templateData of defaultInterviewTemplates) {
      const template = await prisma.interviewTemplate.create({
        data: templateData,
      });

      // Find questions for this template
      const templateQuestions = defaultInterviewQuestions.find(
        (tq) => tq.templateName === templateData.name
      );

      if (templateQuestions) {
        for (const questionData of templateQuestions.questions) {
          await prisma.interviewQuestion.create({
            data: {
              ...questionData,
              templateId: template.id,
            },
          });
        }
      }
    }

    // Create exams
    console.log('📝 Creating default exams...');
    for (const examData of defaultExams) {
      await prisma.exam.create({
        data: examData,
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`- ${defaultUsers.length} users created`);
    console.log(`- ${defaultProblems.length} coding problems created`);
    console.log(`- ${defaultMCQs.length} MCQ questions created`);
    console.log(`- ${defaultInterviewTemplates.length} interview templates created`);
    console.log(`- ${defaultExams.length} exams created`);

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

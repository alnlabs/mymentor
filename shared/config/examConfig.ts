export const EXAM_CONSTANTS = {
  MIN_DURATION: 15,
  MAX_DURATION: 300,
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 100,
  DEFAULT_QUESTION_TIME: 120,
  DEFAULT_PASSING_SCORE: 60,
} as const;

export const EXAM_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const EXAM_CATEGORIES = [
  // Technical Categories
  "Programming",
  "Data Structures",
  "Algorithms",
  "Web Development",
  "Database",
  "System Design",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile Development",
  "DevOps",
  "Machine Learning",
  // Non-Technical Categories
  "Aptitude",
  "Logical Reasoning",
  "Verbal Ability",
  "Quantitative Aptitude",
  "General Knowledge",
  "English Language",
  "Business Communication",
  "Problem Solving",
  "Critical Thinking",
  "Team Management",
  "Leadership",
  "Project Management",
] as const;

export const TARGET_ROLES = [
  // Technical Roles
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "Data Scientist",
  "DevOps Engineer",
  "QA Engineer",
  "UI/UX Designer",
  "Software Engineer",
  "System Administrator",
  // Non-Technical Roles
  "Business Analyst",
  "Project Manager",
  "Product Manager",
  "Marketing Executive",
  "Sales Executive",
  "HR Executive",
  "Finance Executive",
  "Operations Manager",
  "Customer Success",
  "Content Writer",
  "Digital Marketing",
  "Business Development",
] as const;

export const QUESTION_TYPES = ["MCQ", "Coding", "Aptitude", "Mixed"] as const;

export const PROGRAMMING_LANGUAGES = {
  "Web Development": [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PHP",
    "Ruby",
  ],
  "General Programming": ["Python", "Java", "C++", "C#", "Go", "Rust"],
  "Mobile Development": ["Swift", "Kotlin"],
} as const;

export const REASONING_TYPES = [
  "Logical Reasoning",
  "Numerical Reasoning",
  "Verbal Ability",
  "General Aptitude",
] as const;

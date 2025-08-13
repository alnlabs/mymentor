import { useAppSettings } from "@/shared/hooks/useAppSettings";

// Dynamic configuration that uses settings
export const useDynamicConfig = () => {
  const settings = useAppSettings();

  return {
    // Exam Configuration (replaces EXAM_CONSTANTS)
    exam: {
      minDuration: settings.examMinDuration,
      maxDuration: settings.examMaxDuration,
      minQuestions: settings.examMinQuestions,
      maxQuestions: settings.examMaxQuestions,
      defaultQuestionTime: settings.examDefaultQuestionTime,
      defaultPassingScore: settings.examDefaultPassingScore,
    },

    // Question Configuration
    question: {
      minTime: settings.questionMinTime,
      maxTime: settings.questionMaxTime,
    },

    // Interview Configuration
    interview: {
      minDuration: settings.interviewMinDuration,
      maxDuration: settings.interviewMaxDuration,
    },

    // AI Configuration
    ai: {
      maxQuestionsPerRequest: settings.aiMaxQuestionsPerRequest,
    },

    // General Configuration
    general: {
      popularCompanies: settings.popularCompanies,
    },

    // Content Management Configuration
    content: {
      subjects: settings.contentSubjects,
      topics: settings.contentTopics,
      tools: settings.contentTools,
      technologyStacks: settings.contentTechnologyStacks,
      domains: settings.contentDomains,
      skillLevels: settings.contentSkillLevels,
      jobRoles: settings.contentJobRoles,
      companyTypes: settings.contentCompanyTypes,
      interviewTypes: settings.contentInterviewTypes,
      categories: settings.contentCategories,
      targetRoles: settings.contentTargetRoles,
      programmingLanguages: settings.contentProgrammingLanguages,
    },

    // Platform Configuration
    platform: {
      defaultExamDuration: settings.defaultExamDuration,
      defaultInterviewDuration: settings.defaultInterviewDuration,
      allowExamRetakes: settings.allowExamRetakes,
      showResultsImmediately: settings.showResultsImmediately,
      allowInterviewRescheduling: settings.allowInterviewRescheduling,
    },
  };
};

// Static fallback configuration (for server-side or when settings are not available)
export const STATIC_CONFIG = {
  exam: {
    minDuration: 15,
    maxDuration: 300,
    minQuestions: 5,
    maxQuestions: 100,
    defaultQuestionTime: 120,
    defaultPassingScore: 60,
  },
  question: {
    minTime: 30,
    maxTime: 600,
  },
  interview: {
    minDuration: 15,
    maxDuration: 180,
  },
  ai: {
    maxQuestionsPerRequest: 50,
  },
  general: {
    popularCompanies: [
      "LocalShop", "SmallOffice", "DigitalPrint", "WebDesign", "ComputerShop",
      "InternetCafe", "SoftwareStore", "OfficeSupply", "TechSupport", "DataEntry",
      "CallCenter", "CustomerService", "AdminWork", "Receptionist", "Assistant",
      "Restaurant", "RetailStore", "Bakery", "Salon", "Gym", "School", "Hospital",
      "Bank", "Insurance", "RealEstate", "TravelAgency", "EventPlanning",
      "CleaningService", "SecurityService"
    ],
  },
  content: {
    subjects: ["programming", "data-science", "web-development", "mobile-development", "devops", "ai-ml", "database", "cybersecurity", "system-design", "aptitude", "reasoning", "verbal", "quantitative", "general-knowledge", "english", "communication", "problem-solving", "critical-thinking", "leadership", "management", "business"],
    topics: ["arrays", "strings", "linked-lists", "stacks-queues", "trees", "graphs", "dynamic-programming", "greedy-algorithms", "backtracking", "binary-search", "sorting", "hashing", "recursion", "bit-manipulation", "math", "design-patterns", "system-design", "database-design", "api-design", "security", "testing"],
    tools: ["python", "javascript", "java", "cpp", "react", "nodejs", "sql", "mongodb", "docker", "kubernetes", "aws", "other"],
    technologyStacks: ["frontend", "backend", "full-stack", "mobile", "data", "devops", "other"],
    domains: ["web", "mobile", "ai-ml", "data", "cloud", "security", "gaming", "fintech", "healthcare", "ecommerce", "other"],
    skillLevels: ["beginner", "intermediate", "advanced"],
    jobRoles: ["frontend-developer", "backend-developer", "full-stack-developer", "data-scientist", "data-engineer", "devops-engineer", "mobile-developer", "software-engineer", "system-architect", "qa-engineer", "business-analyst", "project-manager", "product-manager", "marketing-executive", "sales-executive", "hr-executive", "finance-executive", "operations-manager", "customer-success", "content-writer", "digital-marketing", "business-development"],
    companyTypes: ["tech", "finance", "healthcare", "ecommerce", "consulting", "startup", "enterprise", "government", "education", "other"],
    interviewTypes: ["technical", "system-design", "coding", "data-structures", "algorithms", "database", "frontend", "backend", "behavioral", "aptitude", "case-study", "group-discussion", "presentation", "assessment", "screening"],
    categories: ["Programming", "Data Structures", "Algorithms", "Web Development", "Database", "System Design", "Frontend", "Backend", "Full Stack", "Mobile Development", "DevOps", "Machine Learning", "Aptitude", "Logical Reasoning", "Verbal Ability", "Quantitative Aptitude", "General Knowledge", "English Language", "Business Communication", "Problem Solving", "Critical Thinking", "Team Management", "Leadership", "Project Management"],
    targetRoles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "Data Scientist", "DevOps Engineer", "QA Engineer", "UI/UX Designer", "Software Engineer", "System Administrator", "Business Analyst", "Project Manager", "Product Manager", "Marketing Executive", "Sales Executive", "HR Executive", "Finance Executive", "Operations Manager", "Customer Success", "Content Writer", "Digital Marketing", "Business Development"],
    programmingLanguages: ["JavaScript", "TypeScript", "React", "Node.js", "PHP", "Ruby", "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin"],
  },
  platform: {
    defaultExamDuration: 60,
    defaultInterviewDuration: 45,
    allowExamRetakes: true,
    showResultsImmediately: true,
    allowInterviewRescheduling: true,
  },
};

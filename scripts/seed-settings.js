const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedSettings() {
  console.log("🌱 Seeding settings and categories...");

  try {
    // Seed initial settings
    const initialSettings = [
      // Security settings
      {
        key: "password_min_length",
        value: "8",
        category: "security",
        description: "Minimum password length",
      },
      {
        key: "password_require_special",
        value: "false",
        category: "security",
        description: "Require special characters in password",
      },
      {
        key: "session_timeout",
        value: "30",
        category: "security",
        description: "Session timeout in minutes",
      },

      // General settings
      {
        key: "app_name",
        value: "Interview Platform",
        category: "general",
        description: "Application name",
      },
      {
        key: "contact_email",
        value: "admin@mymentorapp.com",
        category: "general",
        description: "Contact email",
      },
      {
        key: "default_language",
        value: "en",
        category: "general",
        description: "Default language",
      },
      {
        key: "default_timezone",
        value: "UTC",
        category: "general",
        description: "Default timezone",
      },
      {
        key: "popular_companies",
        value:
          "LocalShop,SmallOffice,DigitalPrint,WebDesign,ComputerShop,InternetCafe,SoftwareStore,OfficeSupply,TechSupport,DataEntry,CallCenter,CustomerService,AdminWork,Receptionist,Assistant,Restaurant,RetailStore,Bakery,Salon,Gym,School,Hospital,Bank,Insurance,RealEstate,TravelAgency,EventPlanning,CleaningService,SecurityService",
        category: "general",
        description: "Popular companies for interviews (comma-separated)",
      },
      // Content Management Fields
      {
        key: "content_subjects",
        value:
          "programming,data-science,web-development,mobile-development,devops,ai-ml,database,cybersecurity,system-design,aptitude,reasoning,verbal,quantitative,general-knowledge,english,communication,problem-solving,critical-thinking,leadership,management,business",
        category: "content",
        description:
          "Available subjects for content categorization (comma-separated)",
      },
      {
        key: "content_topics",
        value:
          "arrays,strings,linked-lists,stacks-queues,trees,graphs,dynamic-programming,greedy-algorithms,backtracking,binary-search,sorting,hashing,recursion,bit-manipulation,math,design-patterns,system-design,database-design,api-design,security,testing",
        category: "content",
        description:
          "Available topics for content categorization (comma-separated)",
      },
      {
        key: "content_tools",
        value:
          "python,javascript,java,cpp,react,nodejs,sql,mongodb,docker,kubernetes,aws,other",
        category: "content",
        description: "Available tools/technologies (comma-separated)",
      },
      {
        key: "content_technology_stacks",
        value: "frontend,backend,full-stack,mobile,data,devops,other",
        category: "content",
        description: "Available technology stacks (comma-separated)",
      },
      {
        key: "content_domains",
        value:
          "web,mobile,ai-ml,data,cloud,security,gaming,fintech,healthcare,ecommerce,other",
        category: "content",
        description: "Available domains (comma-separated)",
      },
      {
        key: "content_skill_levels",
        value: "beginner,intermediate,advanced",
        category: "content",
        description: "Available skill levels (comma-separated)",
      },
      {
        key: "content_job_roles",
        value:
          "frontend-developer,backend-developer,full-stack-developer,data-scientist,data-engineer,devops-engineer,mobile-developer,software-engineer,system-architect,qa-engineer,business-analyst,project-manager,product-manager,marketing-executive,sales-executive,hr-executive,finance-executive,operations-manager,customer-success,content-writer,digital-marketing,business-development",
        category: "content",
        description: "Available job roles (comma-separated)",
      },
      {
        key: "content_company_types",
        value:
          "tech,finance,healthcare,ecommerce,consulting,startup,enterprise,government,education,other",
        category: "content",
        description: "Available company types (comma-separated)",
      },
      {
        key: "content_interview_types",
        value:
          "technical,system-design,coding,data-structures,algorithms,database,frontend,backend,behavioral,aptitude,case-study,group-discussion,presentation,assessment,screening",
        category: "content",
        description: "Available interview types (comma-separated)",
      },
      {
        key: "content_categories",
        value:
          "Programming,Data Structures,Algorithms,Web Development,Database,System Design,Frontend,Backend,Full Stack,Mobile Development,DevOps,Machine Learning,Aptitude,Logical Reasoning,Verbal Ability,Quantitative Aptitude,General Knowledge,English Language,Business Communication,Problem Solving,Critical Thinking,Team Management,Leadership,Project Management",
        category: "content",
        description: "Available content categories (comma-separated)",
      },
      {
        key: "content_target_roles",
        value:
          "Frontend Developer,Backend Developer,Full Stack Developer,Mobile Developer,Data Scientist,DevOps Engineer,QA Engineer,UI/UX Designer,Software Engineer,System Administrator,Business Analyst,Project Manager,Product Manager,Marketing Executive,Sales Executive,HR Executive,Finance Executive,Operations Manager,Customer Success,Content Writer,Digital Marketing,Business Development",
        category: "content",
        description: "Available target roles (comma-separated)",
      },
      {
        key: "content_programming_languages",
        value:
          "JavaScript,TypeScript,React,Node.js,PHP,Ruby,Python,Java,C++,C#,Go,Rust,Swift,Kotlin",
        category: "content",
        description: "Available programming languages (comma-separated)",
      },

      // Platform settings
      {
        key: "default_exam_duration",
        value: "60",
        category: "platform",
        description: "Default exam duration in minutes",
      },
      {
        key: "allow_exam_retakes",
        value: "true",
        category: "platform",
        description: "Allow exam retakes",
      },
      {
        key: "show_results_immediately",
        value: "true",
        category: "platform",
        description: "Show results immediately after exam",
      },
      {
        key: "default_interview_duration",
        value: "45",
        category: "platform",
        description: "Default interview duration in minutes",
      },
      {
        key: "allow_interview_rescheduling",
        value: "true",
        category: "platform",
        description: "Allow interview rescheduling",
      },
      // Exam Configuration Limits
      {
        key: "exam_min_duration",
        value: "15",
        category: "platform",
        description: "Minimum exam duration in minutes",
      },
      {
        key: "exam_max_duration",
        value: "300",
        category: "platform",
        description: "Maximum exam duration in minutes",
      },
      {
        key: "exam_min_questions",
        value: "5",
        category: "platform",
        description: "Minimum questions per exam",
      },
      {
        key: "exam_max_questions",
        value: "100",
        category: "platform",
        description: "Maximum questions per exam",
      },
      {
        key: "exam_default_question_time",
        value: "120",
        category: "platform",
        description: "Default question time in seconds",
      },
      {
        key: "exam_default_passing_score",
        value: "60",
        category: "platform",
        description: "Default passing score percentage",
      },
      {
        key: "question_min_time",
        value: "30",
        category: "platform",
        description: "Minimum question time in seconds",
      },
      {
        key: "question_max_time",
        value: "600",
        category: "platform",
        description: "Maximum question time in seconds",
      },
      {
        key: "interview_min_duration",
        value: "15",
        category: "platform",
        description: "Minimum interview duration in minutes",
      },
      {
        key: "interview_max_duration",
        value: "180",
        category: "platform",
        description: "Maximum interview duration in minutes",
      },
      {
        key: "ai_max_questions_per_request",
        value: "50",
        category: "platform",
        description: "Maximum AI questions per request",
      },

      // User settings
      {
        key: "allow_user_registration",
        value: "true",
        category: "users",
        description: "Allow user registration",
      },
      {
        key: "require_email_verification",
        value: "true",
        category: "users",
        description: "Require email verification",
      },
      {
        key: "default_user_role",
        value: "user",
        category: "users",
        description: "Default user role",
      },
      {
        key: "max_users",
        value: "1000",
        category: "users",
        description: "Maximum number of users",
      },

      // System settings
      {
        key: "maintenance_mode",
        value: "false",
        category: "system",
        description: "Maintenance mode",
      },
      {
        key: "maintenance_message",
        value: "System is under maintenance",
        category: "system",
        description: "Maintenance message",
      },
      {
        key: "auto_backup",
        value: "daily",
        category: "system",
        description: "Auto backup frequency",
      },
      {
        key: "backup_retention",
        value: "30",
        category: "system",
        description: "Backup retention in days",
      },
    ];

    for (const setting of initialSettings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: setting,
        create: setting,
      });
    }

    // Seed initial categories
    const initialCategories = [
      // Exam categories
      {
        name: "Programming Fundamentals",
        type: "exam",
        description: "Basic programming concepts",
        color: "#3B82F6",
        sortOrder: 1,
      },
      {
        name: "Data Structures",
        type: "exam",
        description: "Data structures and algorithms",
        color: "#10B981",
        sortOrder: 2,
      },
      {
        name: "System Design",
        type: "exam",
        description: "System design and architecture",
        color: "#F59E0B",
        sortOrder: 3,
      },

      // Question categories
      {
        name: "Java",
        type: "question",
        description: "Java programming questions",
        color: "#EF4444",
        sortOrder: 1,
      },
      {
        name: "Python",
        type: "question",
        description: "Python programming questions",
        color: "#8B5CF6",
        sortOrder: 2,
      },
      {
        name: "JavaScript",
        type: "question",
        description: "JavaScript programming questions",
        color: "#F97316",
        sortOrder: 3,
      },
      {
        name: "SQL",
        type: "question",
        description: "Database and SQL questions",
        color: "#06B6D4",
        sortOrder: 4,
      },

      // Interview categories
      {
        name: "Technical Interview",
        type: "interview",
        description: "Technical interview sessions",
        color: "#84CC16",
        sortOrder: 1,
      },
      {
        name: "HR Interview",
        type: "interview",
        description: "HR interview sessions",
        color: "#EC4899",
        sortOrder: 2,
      },
      {
        name: "Behavioral Interview",
        type: "interview",
        description: "Behavioral interview sessions",
        color: "#6366F1",
        sortOrder: 3,
      },
    ];

    for (const category of initialCategories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: category,
        create: category,
      });
    }

    // Seed initial global configs
    const initialGlobalConfigs = [
      {
        key: "max_file_upload_size",
        value: "10485760",
        type: "number",
        description: "Maximum file upload size in bytes (10MB)",
      },
      {
        key: "max_questions_per_exam",
        value: "50",
        type: "number",
        description: "Maximum questions per exam",
      },
      {
        key: "max_interviews_per_user",
        value: "10",
        type: "number",
        description: "Maximum interviews per user",
      },
      {
        key: "page_size",
        value: "20",
        type: "number",
        description: "Default page size for lists",
      },
      {
        key: "enable_search",
        value: "true",
        type: "boolean",
        description: "Enable search functionality",
      },
      {
        key: "enable_analytics",
        value: "true",
        type: "boolean",
        description: "Enable analytics tracking",
      },
      {
        key: "feature_beta_mode",
        value: "false",
        type: "boolean",
        description: "Enable beta features",
      },
    ];

    for (const config of initialGlobalConfigs) {
      await prisma.globalConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config,
      });
    }

    console.log("✅ Settings and categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding settings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSettings();

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
      await prisma.category.create({
        data: category,
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

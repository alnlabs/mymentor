import { useSettings } from "@/shared/contexts/SettingsContext";

export function useAppSettings() {
  const { getSetting, getGlobalConfig, loading } = useSettings();

  return {
    loading,

    // Security settings
    passwordMinLength: parseInt(getSetting("password_min_length", "8")),
    passwordRequireSpecial:
      getSetting("password_require_special", "false") === "true",
    sessionTimeout: parseInt(getSetting("session_timeout", "30")),

    // General settings
    appName: getSetting("app_name", "Interview Platform"),
    contactEmail: getSetting("contact_email", "admin@mymentorapp.com"),
    defaultLanguage: getSetting("default_language", "en"),
    defaultTimezone: getSetting("default_timezone", "UTC"),
    popularCompanies: getSetting("popular_companies", "")
      .split(",")
      .filter(Boolean),

    // Content Management Fields
    contentSubjects: getSetting("content_subjects", "").split(",").filter(Boolean),
    contentTopics: getSetting("content_topics", "").split(",").filter(Boolean),
    contentTools: getSetting("content_tools", "").split(",").filter(Boolean),
    contentTechnologyStacks: getSetting("content_technology_stacks", "").split(",").filter(Boolean),
    contentDomains: getSetting("content_domains", "").split(",").filter(Boolean),
    contentSkillLevels: getSetting("content_skill_levels", "").split(",").filter(Boolean),
    contentJobRoles: getSetting("content_job_roles", "").split(",").filter(Boolean),
    contentCompanyTypes: getSetting("content_company_types", "").split(",").filter(Boolean),
    contentInterviewTypes: getSetting("content_interview_types", "").split(",").filter(Boolean),
    contentCategories: getSetting("content_categories", "").split(",").filter(Boolean),
    contentTargetRoles: getSetting("content_target_roles", "").split(",").filter(Boolean),
    contentProgrammingLanguages: getSetting("content_programming_languages", "").split(",").filter(Boolean),

    // Platform settings
    defaultExamDuration: parseInt(getSetting("default_exam_duration", "60")),
    allowExamRetakes: getSetting("allow_exam_retakes", "true") === "true",
    showResultsImmediately:
      getSetting("show_results_immediately", "true") === "true",
    defaultInterviewDuration: parseInt(
      getSetting("default_interview_duration", "45")
    ),
    allowInterviewRescheduling:
      getSetting("allow_interview_rescheduling", "true") === "true",

    // Exam Configuration Limits
    examMinDuration: parseInt(getSetting("exam_min_duration", "15")),
    examMaxDuration: parseInt(getSetting("exam_max_duration", "300")),
    examMinQuestions: parseInt(getSetting("exam_min_questions", "5")),
    examMaxQuestions: parseInt(getSetting("exam_max_questions", "100")),
    examDefaultQuestionTime: parseInt(
      getSetting("exam_default_question_time", "120")
    ),
    examDefaultPassingScore: parseInt(
      getSetting("exam_default_passing_score", "60")
    ),
    questionMinTime: parseInt(getSetting("question_min_time", "30")),
    questionMaxTime: parseInt(getSetting("question_max_time", "600")),
    interviewMinDuration: parseInt(getSetting("interview_min_duration", "15")),
    interviewMaxDuration: parseInt(getSetting("interview_max_duration", "180")),
    aiMaxQuestionsPerRequest: parseInt(
      getSetting("ai_max_questions_per_request", "50")
    ),

    // User settings
    allowUserRegistration:
      getSetting("allow_user_registration", "true") === "true",
    requireEmailVerification:
      getSetting("require_email_verification", "true") === "true",
    defaultUserRole: getSetting("default_user_role", "user"),
    maxUsers: parseInt(getSetting("max_users", "1000")),

    // System settings
    maintenanceMode: getSetting("maintenance_mode", "false") === "true",
    maintenanceMessage: getSetting(
      "maintenance_message",
      "System is under maintenance"
    ),
    autoBackup: getSetting("auto_backup", "daily"),
    backupRetention: parseInt(getSetting("backup_retention", "30")),

    // Global configs
    maxFileUploadSize: parseInt(
      getGlobalConfig("max_file_upload_size", "10485760")
    ), // 10MB
    maxQuestionsPerExam: parseInt(
      getGlobalConfig("max_questions_per_exam", "50")
    ),
    maxInterviewsPerUser: parseInt(
      getGlobalConfig("max_interviews_per_user", "10")
    ),
    pageSize: parseInt(getGlobalConfig("page_size", "20")),
    enableSearch: getGlobalConfig("enable_search", "true") === "true",
    enableAnalytics: getGlobalConfig("enable_analytics", "true") === "true",

    // Helper functions
    isFeatureEnabled: (feature: string) =>
      getGlobalConfig(`feature_${feature}`, "true") === "true",
    getConfig: (key: string, defaultValue: string = "") =>
      getGlobalConfig(key, defaultValue),
    getSetting: (key: string, defaultValue: string = "") =>
      getSetting(key, defaultValue),
  };
}

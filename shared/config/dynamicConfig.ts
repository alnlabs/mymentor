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
  platform: {
    defaultExamDuration: 60,
    defaultInterviewDuration: 45,
    allowExamRetakes: true,
    showResultsImmediately: true,
    allowInterviewRescheduling: true,
  },
};

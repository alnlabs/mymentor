export interface ExamFormData {
  title: string;
  description: string;
  duration: number;
  difficulty: ExamDifficulty;
  category: string;
  targetRole: string;
  questionTypes: QuestionType;
  totalQuestions: number;
  passingScore: number;
  defaultQuestionTime: number;
  enableTimedQuestions: boolean;
  enableOverallTimer: boolean;
  isActive: boolean;
  isPublic: boolean;
}

export type ExamDifficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "MCQ" | "Coding" | "Aptitude" | "Mixed";
export type DropdownType = "programming" | "reasoning";

export interface AutoGenerateSettings {
  mcqCount: number;
  codingCount: number;
  aptitudeCount: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  categories: string[];
  subjects: string[];
}

export interface ExamTemplate {
  title: string;
  description: string;
  duration: number;
  difficulty: ExamDifficulty;
  category: string;
  targetRole: string;
  questionTypes: QuestionType;
  totalQuestions: number;
  passingScore: number;
  defaultQuestionTime: number;
  autoGenerateEnabled: boolean;
  autoGenerateOptions: {
    questionCount: number;
    mcqPercentage: number;
    codingPercentage: number;
    aptitudePercentage: number;
    difficultyDistribution: { easy: number; medium: number; hard: number };
    categories: string[];
    subjects: string[];
    languages: string[];
    includeNonTechnical: boolean;
    nonTechnicalPercentage: number;
  };
}

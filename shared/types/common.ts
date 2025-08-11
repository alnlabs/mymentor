export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  testCases: string; // JSON string
  solution?: string;
  hints?: string; // JSON string
  tags?: string; // JSON string
  companies?: string; // JSON string
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: string;
  tags?: string[];
  companies?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock Interview Types
export interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: string; // easy, medium, hard
  category: string; // frontend, backend, fullstack, ml, etc.
  companies?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  templateId: string;
  questionType: 'coding' | 'mcq' | 'behavioral' | 'system_design';
  question: string;
  options?: string[]; // For MCQ questions
  correctAnswer?: string; // For MCQ questions
  explanation?: string;
  points: number;
  timeLimit?: number; // in minutes, null for no limit
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewAnswer {
  id: string;
  interviewId: string;
  questionId: string;
  answer?: string; // User's answer (code for coding, text for others)
  selectedOption?: number; // For MCQ questions
  isCorrect?: boolean;
  score: number;
  timeSpent?: number; // in seconds
  feedback?: string; // Specific feedback for this answer
  createdAt: string;
}

export interface MockInterview {
  id: string;
  userId: string;
  templateId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  totalScore: number;
  maxScore: number;
  notes?: string; // User's notes during interview
  createdAt: string;
  updatedAt: string;
  template?: InterviewTemplate;
  answers?: InterviewAnswer[];
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  detailedFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSession {
  interview: MockInterview;
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  answers: Record<string, InterviewAnswer>;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  executionTime?: number;
  memoryUsed?: number;
  testResults?: string; // JSON string
  status: 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error';
  submittedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  problemId?: string;
  mcqId?: string;
  questionType: 'coding' | 'mcq';
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
  timeTaken?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

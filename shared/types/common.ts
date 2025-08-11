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
  options: string; // JSON string
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string; // JSON string
  companies?: string; // JSON string
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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

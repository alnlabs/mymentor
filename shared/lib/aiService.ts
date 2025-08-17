export interface AIGenerationRequest {
  type: 'exam' | 'interview' | 'mcq' | 'problem';
  language?: string;
  topic?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  count?: number;
  context?: string;
  requirements?: string[];
}

export interface AIGenerationResponse {
  success: boolean;
  data?: any;
  error?: string;
  content?: GeneratedContent[];
}

export interface GeneratedContent {
  id: string;
  type: 'question' | 'problem' | 'interview_question';
  title: string;
  content: string;
  difficulty: string;
  category: string;
  language?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface AIExamRequest extends AIGenerationRequest {
  type: 'exam';
  examTitle: string;
  duration: number;
  questionTypes: ('mcq' | 'coding' | 'essay')[];
  totalQuestions: number;
}

export interface AIInterviewRequest extends AIGenerationRequest {
  type: 'interview';
  role: string;
  level: 'junior' | 'mid' | 'senior';
  focusAreas: string[];
  duration: number;
}

export interface AIMCQRequest extends AIGenerationRequest {
  type: 'mcq';
  subject: string;
  questionCount: number;
  includeExplanation: boolean;
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl: string = '/api/ai';

  constructor() {
    // Initialize with environment variable or config
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || null;
  }

  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`AI generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generateExam(request: AIExamRequest): Promise<AIGenerationResponse> {
    return this.generateContent(request);
  }

  async generateInterview(request: AIInterviewRequest): Promise<AIGenerationResponse> {
    return this.generateContent(request);
  }

  async generateMCQs(request: AIMCQRequest): Promise<AIGenerationResponse> {
    return this.generateContent(request);
  }

  async generateProblems(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return this.generateContent({ ...request, type: 'problem' });
  }

  // Helper method to validate AI responses
  validateGeneratedContent(content: GeneratedContent[]): boolean {
    return content.every(item => 
      item.title && 
      item.content && 
      item.difficulty && 
      item.category
    );
  }

  // Method to enhance existing content with AI
  async enhanceContent(content: any, enhancementType: 'difficulty' | 'explanation' | 'variations'): Promise<AIGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({
          content,
          enhancementType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Content enhancement failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Content enhancement error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const aiService = new AIService();
export default aiService;

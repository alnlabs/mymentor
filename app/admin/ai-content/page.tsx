"use client";

import React, { useState } from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import AIGenerator from '@/shared/components/AIGenerator';
import { GeneratedContent } from '@/shared/lib/aiService';
import {
  Brain,
  Sparkles,
  FileText,
  Target,
  Code,
  Users,
  BarChart3,
  Settings,
  Download,
  Save,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

interface ContentType {
  id: 'exam' | 'interview' | 'mcq' | 'problem';
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const contentTypes: ContentType[] = [
  {
    id: 'exam',
    name: 'Exams',
    description: 'Generate comprehensive exam questions with multiple sections',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    id: 'interview',
    name: 'Interviews',
    description: 'Create interview questions for different roles and levels',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    id: 'mcq',
    name: 'MCQ Questions',
    description: 'Generate multiple choice questions with explanations',
    icon: Target,
    color: 'bg-green-500',
  },
  {
    id: 'problem',
    name: 'Coding Problems',
    description: 'Create coding challenges and programming problems',
    icon: Code,
    color: 'bg-orange-500',
  },
];

export default function AIContentPage() {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleContentGenerated = (content: GeneratedContent[]) => {
    setGeneratedContent(content);
    setMessage({
      type: 'success',
      text: `Successfully generated ${content.length} ${selectedType?.name.toLowerCase()} items!`
    });
  };

  const handleSaveToDatabase = async (content: GeneratedContent[]) => {
    if (!selectedType) return;
    
    setIsSaving(true);
    try {
      let endpoint = '';
      let data: any = {};

      switch (selectedType.id) {
        case 'mcq':
          endpoint = '/api/admin/upload';
          data = {
            type: 'mcq',
            data: content.map(item => ({
              question: item.content,
              options: item.options || ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: item.options?.indexOf(item.correctAnswer || 'Option A') || 0,
              explanation: item.explanation || '',
              category: item.category,
              subject: item.category,
              topic: item.category,
              tool: item.language || '',
              technologyStack: item.language || '',
              domain: item.category,
              skillLevel: item.difficulty === 'beginner' ? 'beginner' : 
                         item.difficulty === 'intermediate' ? 'intermediate' : 'advanced',
              jobRole: '',
              companyType: '',
              interviewType: '',
              difficulty: item.difficulty === 'beginner' ? 'easy' : 
                         item.difficulty === 'intermediate' ? 'medium' : 'hard',
              tags: item.tags?.join(', ') || '',
              companies: '',
              priority: 'medium',
              status: 'draft',
            }))
          };
          break;

        case 'exam':
          endpoint = '/api/exams';
          data = {
            title: `AI Generated Exam - ${new Date().toLocaleDateString()}`,
            description: `AI generated exam with ${content.length} questions`,
            duration: 60,
            questions: content.map(item => ({
              question: item.content,
              type: item.type === 'question' ? 'mcq' : 'coding',
              difficulty: item.difficulty,
              category: item.category,
              options: item.options || [],
              correctAnswer: item.correctAnswer || '',
              explanation: item.explanation || '',
            })),
            difficulty: content[0]?.difficulty || 'intermediate',
            category: content[0]?.category || 'General',
            status: 'draft'
          };
          break;

        case 'interview':
          endpoint = '/api/interviews/templates';
          data = {
            name: `AI Generated Interview - ${new Date().toLocaleDateString()}`,
            description: `AI generated interview template with ${content.length} questions`,
            duration: 30,
            difficulty: content[0]?.difficulty || 'intermediate',
            category: content[0]?.category || 'General',
            companies: [],
            questions: content.map((item, index) => ({
              questionType: item.type === 'interview_question' ? 'behavioral' : 'mcq',
              question: item.content,
              options: item.options || [],
              correctAnswer: item.correctAnswer || '',
              explanation: item.explanation || '',
              points: 5,
              timeLimit: 120,
              order: index,
            })),
          };
          break;

        case 'problem':
          endpoint = '/api/problems';
          data = content.map(item => ({
            title: item.title,
            description: item.content,
            difficulty: item.difficulty,
            category: item.category,
            language: item.language,
            tags: item.tags || [],
            status: 'draft'
          }));
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || `Failed to save AI generated ${selectedType.name}`);
      }

      setMessage({
        type: 'success',
        text: `${selectedType.name} saved to database successfully!`
      });

      return result;
    } catch (error) {
      console.error('Error saving AI content:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save content'
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(generatedContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-generated-${selectedType?.id}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    setSelectedType(null);
    setGeneratedContent([]);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="w-8 h-8 mr-3 text-purple-600" />
                AI Content Creation
              </h1>
            </div>
            {selectedType && (
              <div className="flex space-x-3">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  disabled={generatedContent.length === 0}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => handleSaveToDatabase(generatedContent)}
                  disabled={isSaving || generatedContent.length === 0}
                  className="flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save to Database
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          <p className="text-gray-600">
            Generate high-quality content for exams, interviews, MCQs, and coding problems using AI
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {!selectedType ? (
          /* Content Type Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card
                  key={type.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200"
                  onClick={() => setSelectedType(type)}
                >
                  <div className="text-center">
                    <div className={`inline-flex p-3 rounded-full ${type.color} text-white mb-4`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {type.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {type.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate {type.name}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* AI Generator for Selected Type */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Types
                </Button>
                <div className="flex items-center space-x-2">
                  <div className={`inline-flex p-2 rounded-full ${selectedType.color} text-white`}>
                    <selectedType.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Generate {selectedType.name}
                  </h2>
                </div>
              </div>
            </div>

            <AIGenerator
              type={selectedType.id}
              onContentGenerated={handleContentGenerated}
              onSaveToDatabase={handleSaveToDatabase}
            />
          </div>
        )}

        {/* Stats Section */}
        {!selectedType && (
          <div className="mt-12">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                AI Content Generation Stats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4</div>
                  <div className="text-sm text-gray-600">Content Types</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">AI-Powered</div>
                  <div className="text-sm text-gray-600">Generation</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">Customizable</div>
                  <div className="text-sm text-gray-600">Parameters</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">Instant</div>
                  <div className="text-sm text-gray-600">Results</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

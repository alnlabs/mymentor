"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import PageHeader from "@/shared/components/PageHeader";
import QuestionSelector from "@/shared/components/QuestionSelector";
import AIGenerator from "@/shared/components/AIGenerator";
import { GeneratedContent } from "@/shared/lib/aiService";
import {
  CheckCircle,
  AlertCircle,
  Save,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useExamForm } from "@/shared/hooks/useExamForm";
import { BasicInfoSection } from "@/shared/components/exam-form/BasicInfoSection";

export default function AddExamPage() {
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<
    GeneratedContent[]
  >([]);
  const [questionMode, setQuestionMode] = useState<"manual" | "ai" | "mixed">(
    "manual"
  );

  const {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
    resetForm,
    saveAsDraft,
  } = useExamForm();

  const handleQuestionsSelected = (questions: any[]) => {
    setSelectedQuestions(questions);
    console.log("Selected questions:", questions);
  };

  const handleAIContentGenerated = (content: GeneratedContent[]) => {
    setAiGeneratedContent(content);
    console.log("AI generated exam content:", content);
  };

  const handleSaveAIContentToDatabase = async (content: GeneratedContent[]) => {
    try {
      // Convert AI generated content to exam format
      const examData = {
        title: `AI Generated Exam - ${new Date().toLocaleDateString()}`,
        description: `AI generated exam with ${content.length} questions`,
        duration: 60,
        questions: content.map((item) => ({
          question: item.content,
          type: item.type === "question" ? "mcq" : "coding",
          difficulty: item.difficulty,
          category: item.category,
          options: item.options || [],
          correctAnswer: item.correctAnswer || "",
          explanation: item.explanation || "",
        })),
        difficulty: content[0]?.difficulty || "intermediate",
        category: content[0]?.category || "General",
        status: "draft",
      };

      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save AI generated exam");
      }

      return result;
    } catch (error) {
      console.error("Error saving AI exam content:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Exam"
        subtitle="Create comprehensive exams with technical and aptitude questions."
        backUrl="/admin/exams"
        backText="Back to Exams"
      />

      {/* Question Selection Method */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Question Selection Method
          </h3>

          {/* Method Selection Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setQuestionMode("manual")}
              className={`p-4 rounded-lg border-2 transition-all ${
                questionMode === "manual"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Manual Selection</span>
              </div>
              <p className="text-sm">Select existing questions from database</p>
            </button>

            <button
              onClick={() => setQuestionMode("ai")}
              className={`p-4 rounded-lg border-2 transition-all ${
                questionMode === "ai"
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">AI Generation</span>
              </div>
              <p className="text-sm">Generate new questions with AI</p>
            </button>

            <button
              onClick={() => setQuestionMode("mixed")}
              className={`p-4 rounded-lg border-2 transition-all ${
                questionMode === "mixed"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-medium">Mixed Mode</span>
              </div>
              <p className="text-sm">Combine both methods</p>
            </button>
          </div>

          {/* Content Based on Selected Mode */}
          {questionMode === "manual" && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Select from Existing Questions
                </span>
              </div>
              <QuestionSelector
                onQuestionsSelected={handleQuestionsSelected}
                selectedQuestions={selectedQuestions}
              />
            </div>
          )}

          {questionMode === "ai" && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  AI Content Generator
                </span>
              </div>
              <AIGenerator
                type="exam"
                onContentGenerated={handleAIContentGenerated}
                onSaveToDatabase={handleSaveAIContentToDatabase}
              />
            </div>
          )}

          {questionMode === "mixed" && (
            <div className="space-y-6">
              {/* Manual Selection Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Select Existing Questions
                  </span>
                </div>
                <QuestionSelector
                  onQuestionsSelected={handleQuestionsSelected}
                  selectedQuestions={selectedQuestions}
                />
              </div>

              {/* AI Generation Section */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Generate Additional Questions with AI
                  </span>
                </div>
                <AIGenerator
                  type="exam"
                  onContentGenerated={handleAIContentGenerated}
                  onSaveToDatabase={handleSaveAIContentToDatabase}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Questions Summary */}
      {(selectedQuestions.length > 0 || aiGeneratedContent.length > 0) && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {questionMode === "ai"
                  ? "AI Generated Questions"
                  : questionMode === "mixed"
                  ? "Mixed Questions"
                  : "Selected Questions"}{" "}
                for Exam (
                {questionMode === "ai"
                  ? aiGeneratedContent.length
                  : questionMode === "mixed"
                  ? selectedQuestions.length + aiGeneratedContent.length
                  : selectedQuestions.length}
                )
              </h3>
              <div className="text-sm text-gray-500">
                {questionMode === "ai"
                  ? "AI will generate these questions when you create the exam"
                  : questionMode === "mixed"
                  ? "Combination of selected and AI-generated questions"
                  : "These questions will be included in your exam"}
              </div>
            </div>

            {questionMode === "ai" ? (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">
                    AI will generate {aiGeneratedContent.length} questions based
                    on your criteria
                  </span>
                </div>
              </div>
            ) : questionMode === "mixed" ? (
              <div className="space-y-4">
                {/* Manual Questions Summary */}
                {selectedQuestions.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Selected from Database: {selectedQuestions.length}{" "}
                        questions
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-blue-700">
                        MCQ:{" "}
                        {
                          selectedQuestions.filter((q) => q.type === "mcq")
                            .length
                        }
                      </span>
                      <span className="text-blue-700">
                        Problems:{" "}
                        {
                          selectedQuestions.filter((q) => q.type === "problem")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* AI Questions Summary */}
                {aiGeneratedContent.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-800">
                        AI Generated: {aiGeneratedContent.length} questions
                      </span>
                    </div>
                    <div className="text-sm text-purple-700">
                      Will be generated based on your AI criteria
                    </div>
                  </div>
                )}

                {/* Total Summary */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <Sparkles className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-green-800">
                      Total Questions:{" "}
                      {selectedQuestions.length + aiGeneratedContent.length}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      MCQ Questions:{" "}
                      {selectedQuestions.filter((q) => q.type === "mcq").length}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      Problem Questions:{" "}
                      {
                        selectedQuestions.filter((q) => q.type === "problem")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Simple Exam Form */}
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (questionMode === "ai" && aiGeneratedContent.length > 0) {
              // Use AI-generated content only
              handleSubmit(e, aiGeneratedContent);
            } else if (
              questionMode === "mixed" &&
              (selectedQuestions.length > 0 || aiGeneratedContent.length > 0)
            ) {
              // Combine both selected and AI-generated content
              const combinedQuestions = [
                ...selectedQuestions,
                ...aiGeneratedContent,
              ];
              handleSubmit(e, combinedQuestions);
            } else {
              // Use manually selected questions only
              handleSubmit(e, selectedQuestions);
            }
          }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Simple Configuration */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Exam Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Database">Database</option>
                  <option value="System Design">System Design</option>
                  <option value="Aptitude">Aptitude</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simple Settings */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-900">
                  Active Exam
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-900">
                  Public Exam
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "/admin/exams")}
            >
              Cancel
            </Button>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={saveAsDraft}>
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  <Loading size="sm" text="Creating Exam..." />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Exam
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

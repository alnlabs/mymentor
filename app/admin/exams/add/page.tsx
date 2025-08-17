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
  const [questionMode, setQuestionMode] = useState<"manual" | "ai">("manual");
  const [questionTypes, setQuestionTypes] = useState<{
    mcq: boolean;
    problem: boolean;
  }>({
    mcq: true,
    problem: true,
  });

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
      // Save individual questions to database
      const questionsToSave = content.map((item) => ({
        question: item.content,
        options: item.options || [],
        correctAnswer: item.correctAnswer || "",
        explanation: item.explanation || "",
        category: item.category,
        topic: item.category, // Use category as topic
        tool: item.language || "JavaScript",
        difficulty:
          item.difficulty === "beginner"
            ? "easy"
            : item.difficulty === "intermediate"
            ? "medium"
            : "hard",
        skillLevel: item.difficulty,
        status: "active",
        type: item.type === "question" ? "mcq" : "problem",
      }));

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: questionsToSave,
          type: "mixed", // Save as mixed content (MCQs and Problems)
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save questions to database");
      }

      return result;
    } catch (error) {
      console.error("Error saving questions to database:", error);
      throw error;
    }
  };

  const handleCreateExamFromAI = async (content: GeneratedContent[]) => {
    try {
      // Ensure all required fields are provided with defaults if not set
      const examData = {
        title: formData.title || `AI Generated Exam - ${new Date().toLocaleDateString()}`,
        description: formData.description || "Exam created from AI-generated questions",
        duration: formData.duration || 60,
        difficulty: formData.difficulty || "Medium",
        category: formData.category || "Programming",
        targetRole: formData.targetRole || "",
        questionTypes: formData.questionTypes || "Mixed",
        totalQuestions: formData.totalQuestions || content.length,
        passingScore: formData.passingScore || 60,
        enableTimedQuestions: formData.enableTimedQuestions || false,
        enableOverallTimer: formData.enableOverallTimer || true,
        defaultQuestionTime: formData.defaultQuestionTime || 120,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        isPublic: formData.isPublic !== undefined ? formData.isPublic : true,
        autoGenerate: false,
        selectedQuestions: content.map((item) => ({
          id: item.id,
          type: item.type === "question" ? "mcq" : "problem",
          title: item.title,
          content: item.content,
          options: item.options || [],
          correctAnswer: item.correctAnswer || "",
          explanation: item.explanation || "",
          category: item.category,
          topic: item.category,
          tool: item.language || "JavaScript",
          difficulty:
            item.difficulty === "beginner"
              ? "easy"
              : item.difficulty === "intermediate"
              ? "medium"
              : "hard",
          skillLevel: item.difficulty,
        })),
      };

      // Use the existing exam form submission logic
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create exam");
      }

      // Redirect to exams page on success
      window.location.href = "/admin/exams";

      return result;
    } catch (error) {
      console.error("Error creating exam from AI content:", error);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
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
                <span className="font-medium">AI Selection</span>
              </div>
              <p className="text-sm">
                AI selects existing questions based on criteria
              </p>
            </button>
          </div>

          {/* Question Type Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Question Types to Include
            </h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={questionTypes.mcq}
                  onChange={(e) =>
                    setQuestionTypes((prev) => ({
                      ...prev,
                      mcq: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">MCQ Questions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={questionTypes.problem}
                  onChange={(e) =>
                    setQuestionTypes((prev) => ({
                      ...prev,
                      problem: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Problem Questions</span>
              </label>
            </div>
            {!questionTypes.mcq && !questionTypes.problem && (
              <p className="text-sm text-red-600 mt-2">
                Please select at least one question type
              </p>
            )}
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
                questionTypes={questionTypes}
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
                onSaveToDatabase={handleCreateExamFromAI}
                questionTypes={questionTypes}
              />
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
                  ? "AI Selected Questions"
                  : "Selected Questions"}{" "}
                for Exam (
                {questionMode === "ai"
                  ? aiGeneratedContent.length
                  : selectedQuestions.length}
                )
              </h3>
              <div className="text-sm text-gray-500">
                {questionMode === "ai"
                  ? "AI selected these questions based on your criteria"
                  : "These questions will be included in your exam"}
              </div>
            </div>

            {questionMode === "ai" ? (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">
                    AI selected {aiGeneratedContent.length} questions based on
                    your criteria
                  </span>
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

            // Validate question types selection
            if (!questionTypes.mcq && !questionTypes.problem) {
              alert(
                "Please select at least one question type (MCQ or Problem)"
              );
              return;
            }

            if (questionMode === "ai" && aiGeneratedContent.length > 0) {
              // Use AI-selected content
              handleSubmit(e, aiGeneratedContent);
            } else {
              // Use manually selected questions
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

"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import AIGenerator from "@/shared/components/AIGenerator";
import { GeneratedContent } from "@/shared/lib/aiService";
import {
  Plus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  BookOpen,
  Brain,
  X,
} from "lucide-react";
import { useExamForm } from "@/shared/hooks/useExamForm";
import { AutoFillSection } from "@/shared/components/exam-form/AutoFillSection";
import { BasicInfoSection } from "@/shared/components/exam-form/BasicInfoSection";
import { ExamConfigSection } from "@/shared/components/exam-form/ExamConfigSection";
import { TimerSettingsSection } from "@/shared/components/exam-form/TimerSettingsSection";
import { showNotification } from "@/shared/utils/notifications";
import {
  LANGUAGE_TEMPLATES,
  REASONING_TEMPLATES,
} from "@/shared/data/examTemplates";

export default function AddExamPage() {
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const {
    formData,
    loading,
    dropdownType,
    selectedOption,
    lastUsedDropdown,
    handleInputChange,
    handleAutoFillWithLanguage,
    handleAutoFillWithReasoning,
    handleAutoFillForm,
    handleSubmit,
    resetForm,
    saveAsDraft,
    setDropdownType,
    setSelectedOption,
    setLastUsedDropdown,
  } = useExamForm();

  const handleAutoPopulate = async () => {
    if (selectedOption) {
      // Get template to check for existing exams with similar titles
      let template;
      if (dropdownType === "programming") {
        template = LANGUAGE_TEMPLATES[selectedOption];
      } else {
        template = REASONING_TEMPLATES[selectedOption];
      }

      if (template) {
        // Check for existing exams with similar titles
        try {
          const response = await fetch(
            `/api/exams?search=${encodeURIComponent(template.title)}`
          );
          const result = await response.json();
          const existingExams = result.data || [];

          // Find all exams based on selection and append totalCount + 1
          const baseTitle = template.title;
          const similarExams = existingExams.filter((exam: any) =>
            exam.title.startsWith(baseTitle)
          );

          const count = similarExams.length + 1;

          if (dropdownType === "programming") {
            setLastUsedDropdown("language");
            handleAutoFillWithLanguage(selectedOption, count);
          } else {
            setLastUsedDropdown("reasoning");
            handleAutoFillWithReasoning(selectedOption, count);
          }
        } catch (error) {
          // Fallback to count 1 if API call fails
          if (dropdownType === "programming") {
            setLastUsedDropdown("language");
            handleAutoFillWithLanguage(selectedOption, 1);
          } else {
            setLastUsedDropdown("reasoning");
            handleAutoFillWithReasoning(selectedOption, 1);
          }
        }
      }
      setSelectedOption(""); // Reset selection
    } else {
      showNotification.warning("Please select an option first!");
    }
  };

  const handleAIContentGenerated = (content: GeneratedContent[]) => {
    // Handle AI generated exam content
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
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold flex items-center">
                <Plus className="w-8 h-8 mr-3" />
                Create Exam
              </h1>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowAIGenerator(!showAIGenerator)}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {showAIGenerator ? "Hide AI Generator" : "AI Generator"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/admin/exams")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← Back to Exams
                </Button>
              </div>
            </div>
            <p className="text-green-100 text-lg">
              Create comprehensive exams with technical and aptitude questions.
            </p>
            <div className="flex items-center mt-4 space-x-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                <span>Fresh Graduate Focus</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                <span>Timed Assessment</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                <span>Performance Tracking</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">📝</div>
                <div className="text-sm opacity-90">New Exam</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generator */}
      {showAIGenerator && (
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Generator
                </h3>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  AI
                </span>
              </div>
              <Button
                onClick={() => setShowAIGenerator(false)}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <AIGenerator
              type="exam"
              onContentGenerated={handleAIContentGenerated}
              onSaveToDatabase={handleSaveAIContentToDatabase}
            />
          </div>
        </Card>
      )}

      {/* Form */}
      <Card>
        {/* Auto-Fill Section */}
        <AutoFillSection
          dropdownType={dropdownType}
          selectedOption={selectedOption}
          lastUsedDropdown={lastUsedDropdown}
          onDropdownTypeChange={setDropdownType}
          onSelectedOptionChange={setSelectedOption}
          onAutoPopulate={handleAutoPopulate}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Exam Configuration */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <ExamConfigSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Timer Settings */}
            <TimerSettingsSection
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>

          {/* Exam Settings */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
              Exam Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active Exam (Students can take this exam)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Public Exam (Available to all students)
                </label>
              </div>
            </div>
          </div>

          {/* Fresh Graduate Focus Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-yellow-600" />
              Fresh Graduate Focus Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p className="font-medium">🎯 Recommended Settings:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Duration: 30-60 minutes for focused assessment</li>
                  <li>
                    Difficulty: Start with Easy/Medium for confidence building
                  </li>
                  <li>Questions: 10-20 questions for manageable completion</li>
                  <li>Passing Score: 60-70% for reasonable standards</li>
                  <li>Question Time: 60-180 seconds per question</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">📚 Popular Categories:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Programming Fundamentals</li>
                  <li>Basic Data Structures</li>
                  <li>Web Development Basics</li>
                  <li>JavaScript/React Essentials</li>
                  <li>Database Fundamentals</li>
                  <li>Aptitude & Reasoning</li>
                  <li>Verbal & Communication</li>
                  <li>Business Fundamentals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Category Guidance */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
              Category Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-indigo-800">
                  💻 Technical Categories:
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Programming:</strong> Basic coding concepts, syntax,
                    logic
                  </li>
                  <li>
                    <strong>Web Development:</strong> HTML, CSS, JavaScript,
                    frameworks
                  </li>
                  <li>
                    <strong>Data Structures:</strong> Arrays, linked lists,
                    trees, graphs
                  </li>
                  <li>
                    <strong>Algorithms:</strong> Sorting, searching,
                    optimization
                  </li>
                  <li>
                    <strong>Database:</strong> SQL, NoSQL, data modeling
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-800">
                  🧠 Non-Technical Categories:
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Aptitude:</strong> Numerical, verbal, logical
                    reasoning
                  </li>
                  <li>
                    <strong>Communication:</strong> English, business writing,
                    presentation
                  </li>
                  <li>
                    <strong>Problem Solving:</strong> Analytical thinking,
                    decision making
                  </li>
                  <li>
                    <strong>Leadership:</strong> Team management, project
                    coordination
                  </li>
                  <li>
                    <strong>Business:</strong> Market knowledge, industry
                    awareness
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "/admin/exams")}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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

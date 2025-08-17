"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import PageHeader from "@/shared/components/PageHeader";
import QuestionSelector from "@/shared/components/QuestionSelector";
import { CheckCircle, AlertCircle, Save, BookOpen } from "lucide-react";
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
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

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

  const handleQuestionsSelected = (questions: any[]) => {
    setSelectedQuestions(questions);
    console.log("Selected questions:", questions);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Exam"
        subtitle="Create comprehensive exams with technical and aptitude questions."
        backUrl="/admin/exams"
        backText="Back to Exams"
      />

      {/* Question Selector */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Questions from Database
          </h3>
          <QuestionSelector
            onQuestionsSelected={handleQuestionsSelected}
            selectedQuestions={selectedQuestions}
          />
        </div>
      </Card>

      {/* Selected Questions Summary */}
      {selectedQuestions.length > 0 && (
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Questions for Exam ({selectedQuestions.length})
              </h3>
              <div className="text-sm text-gray-500">
                These questions will be included in your exam
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">
                    MCQ Questions: {selectedQuestions.filter(q => q.type === "mcq").length}
                  </span>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">
                    Problem Questions: {selectedQuestions.filter(q => q.type === "problem").length}
                  </span>
                </div>
              </div>
            </div>
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

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, selectedQuestions);
        }} className="space-y-6">
          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Exam Configuration */}
          <div className="p-6">
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
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
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
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
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
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
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

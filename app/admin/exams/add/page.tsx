"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import PageHeader from "@/shared/components/PageHeader";
import QuestionSelector from "@/shared/components/QuestionSelector";
import { CheckCircle, AlertCircle, Save, BookOpen } from "lucide-react";
import { useExamForm } from "@/shared/hooks/useExamForm";
import { BasicInfoSection } from "@/shared/components/exam-form/BasicInfoSection";

export default function AddExamPage() {
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

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
          </div>
        </Card>
      )}

      {/* Simple Exam Form */}
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e, selectedQuestions);
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

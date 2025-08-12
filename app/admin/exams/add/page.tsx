"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Plus,
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Save,
} from "lucide-react";

export default function AddExamPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 60,
    difficulty: "Medium",
    category: "Programming",
    targetRole: "",
    questionTypes: "Mixed",
    totalQuestions: 0,
    passingScore: 60,
    defaultQuestionTime: 120, // Default time per question in seconds
    isActive: true,
    isPublic: true,
  });

  const difficulties = ["Easy", "Medium", "Hard"];
  const categories = [
    // Technical Categories
    "Programming",
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Database",
    "System Design",
    "Frontend",
    "Backend",
    "Full Stack",
    "Mobile Development",
    "DevOps",
    "Machine Learning",
    // Non-Technical Categories
    "Aptitude",
    "Logical Reasoning",
    "Verbal Ability",
    "Quantitative Aptitude",
    "General Knowledge",
    "English Language",
    "Business Communication",
    "Problem Solving",
    "Critical Thinking",
    "Team Management",
    "Leadership",
    "Project Management",
  ];
  const targetRoles = [
    // Technical Roles
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "Data Scientist",
    "DevOps Engineer",
    "QA Engineer",
    "UI/UX Designer",
    "Software Engineer",
    "System Administrator",
    // Non-Technical Roles
    "Business Analyst",
    "Project Manager",
    "Product Manager",
    "Marketing Executive",
    "Sales Executive",
    "HR Executive",
    "Finance Executive",
    "Operations Manager",
    "Customer Success",
    "Content Writer",
    "Digital Marketing",
    "Business Development",
  ];
  const questionTypes = ["MCQ", "Coding", "Aptitude", "Mixed"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Exam created successfully!");
        window.location.href = "/admin/exams";
      } else {
        alert(result.error || "Failed to create exam");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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
                Create New Exam
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/exams")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to Exams
              </Button>
            </div>
            <p className="text-green-100 text-lg">
              Create a comprehensive exam for fresh graduates with technical and aptitude questions
            </p>
            <div className="flex items-center mt-4 space-x-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                <span>Fresh Graduate Focus</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-green-300" />
                <span>Timed Assessment</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-green-300" />
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

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., JavaScript Fundamentals for Fresh Graduates"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Describe the exam content, objectives, and what students will learn..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Exam Configuration */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-600" />
              Exam Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="15"
                  max="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%) *
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Target Role</option>
                  {targetRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Types *
                </label>
                <select
                  name="questionTypes"
                  value={formData.questionTypes}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Questions
                </label>
                <input
                  type="number"
                  name="totalQuestions"
                  value={formData.totalQuestions}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Will be set when questions are added"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Question Time (seconds)
                </label>
                <input
                  type="number"
                  name="defaultQuestionTime"
                  value={formData.defaultQuestionTime}
                  onChange={handleInputChange}
                  min="30"
                  max="600"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default time limit per question (30-600 seconds)
                </p>
              </div>
            </div>
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
                  <li>Difficulty: Start with Easy/Medium for confidence building</li>
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
                 <h4 className="font-semibold text-indigo-800">💻 Technical Categories:</h4>
                 <ul className="text-sm text-gray-700 space-y-1">
                   <li><strong>Programming:</strong> Basic coding concepts, syntax, logic</li>
                   <li><strong>Web Development:</strong> HTML, CSS, JavaScript, frameworks</li>
                   <li><strong>Data Structures:</strong> Arrays, linked lists, trees, graphs</li>
                   <li><strong>Algorithms:</strong> Sorting, searching, optimization</li>
                   <li><strong>Database:</strong> SQL, NoSQL, data modeling</li>
                 </ul>
               </div>
               <div className="space-y-3">
                 <h4 className="font-semibold text-purple-800">🧠 Non-Technical Categories:</h4>
                 <ul className="text-sm text-gray-700 space-y-1">
                   <li><strong>Aptitude:</strong> Numerical, verbal, logical reasoning</li>
                   <li><strong>Communication:</strong> English, business writing, presentation</li>
                   <li><strong>Problem Solving:</strong> Analytical thinking, decision making</li>
                   <li><strong>Leadership:</strong> Team management, project coordination</li>
                   <li><strong>Business:</strong> Market knowledge, industry awareness</li>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Save as draft functionality
                  setFormData((prev) => ({ ...prev, isActive: false }));
                }}
              >
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

"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import PageHeader from "@/shared/components/PageHeader";
import AIGenerator from "@/shared/components/AIGenerator";
import { GeneratedContent } from "@/shared/lib/aiService";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Brain,
  Zap,
  Target,
  BookOpen,
  Users,
  Building,
  Star,
} from "lucide-react";

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  subject: string;
  topic: string;
  tool: string;
  technologyStack: string;
  domain: string;
  skillLevel: string;
  jobRole: string;
  companyType: string;
  interviewType: string;
  difficulty: string;
  tags: string;
  companies: string;
  priority: string;
  status: string;
}

export default function AddMCQPage() {
  const [saving, setSaving] = useState(false);
  const [clearAIContent, setClearAIContent] = useState(false);
  const [mcq, setMCQ] = useState<MCQ>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    category: "",
    subject: "",
    topic: "",
    tool: "",
    technologyStack: "",
    domain: "",
    skillLevel: "beginner",
    jobRole: "",
    companyType: "",
    interviewType: "",
    difficulty: "easy",
    tags: "",
    companies: "",
    priority: "medium",
    status: "draft",
  });

  const updateMCQ = (field: keyof MCQ, value: any) => {
    setMCQ((prev) => ({ ...prev, [field]: value }));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...mcq.options];
    newOptions[index] = value;
    setMCQ((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    if (mcq.options.length < 6) {
      setMCQ((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const removeOption = (index: number) => {
    if (mcq.options.length > 2) {
      const newOptions = mcq.options.filter((_, i) => i !== index);
      const newCorrectAnswer =
        mcq.correctAnswer >= index
          ? Math.max(0, mcq.correctAnswer - 1)
          : mcq.correctAnswer;
      setMCQ((prev) => ({
        ...prev,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
      }));
    }
  };

  const handleSave = async () => {
    if (!mcq.question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (mcq.options.some((option) => !option.trim())) {
      alert("Please fill in all options");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "mcq",
          data: [mcq],
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("MCQ saved successfully!");
        // Reset form to initial state
        setMCQ({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          category: "",
          subject: "",
          topic: "",
          tool: "",
          technologyStack: "",
          domain: "",
          skillLevel: "beginner",
          jobRole: "",
          companyType: "",
          interviewType: "",
          difficulty: "easy",
          tags: "",
          companies: "",
          priority: "medium",
          status: "draft",
        });

        // Clear AI Generator content
        setClearAIContent(true);
        setTimeout(() => setClearAIContent(false), 100);
      } else {
        alert("Failed to save MCQ: " + result.error);
      }
    } catch (error) {
      console.error("Error saving MCQ:", error);
      alert("Failed to save MCQ");
    } finally {
      setSaving(false);
    }
  };

  const handleAIContentGenerated = (content: GeneratedContent[]) => {
    // Handle AI generated content and auto-populate both main form and settings
    console.log("AI generated MCQ content:", content);

    if (content.length > 0) {
      const firstItem = content[0];

      // Auto-populate MAIN FORM FIELDS (Question, Options, Explanation)
      updateMCQ("question", firstItem.content || mcq.question);
      updateMCQ("options", firstItem.options || mcq.options);
      updateMCQ(
        "correctAnswer",
        firstItem.options?.indexOf(firstItem.correctAnswer || "Option A") || 0
      );
      updateMCQ("explanation", firstItem.explanation || mcq.explanation);

      // Auto-populate SETTINGS FIELDS
      updateMCQ("category", firstItem.category || mcq.category);
      updateMCQ("subject", firstItem.category || mcq.subject);
      updateMCQ("topic", firstItem.category || mcq.topic);
      updateMCQ("tool", firstItem.language || mcq.tool);
      updateMCQ("technologyStack", firstItem.language || mcq.technologyStack);
      updateMCQ("domain", firstItem.category || mcq.domain);
      updateMCQ(
        "difficulty",
        firstItem.difficulty === "beginner"
          ? "easy"
          : firstItem.difficulty === "intermediate"
          ? "medium"
          : "hard"
      );
      updateMCQ(
        "skillLevel",
        firstItem.difficulty === "beginner"
          ? "beginner"
          : firstItem.difficulty === "intermediate"
          ? "intermediate"
          : "advanced"
      );
      updateMCQ("tags", firstItem.tags?.join(", ") || mcq.tags);

      // Show success message
      alert(`AI generated MCQ content and populated both form and settings!`);
    }
  };

  const handleSaveAIContentToDatabase = async (content: GeneratedContent[]) => {
    try {
      console.log(`Saving ${content.length} AI-generated items to database`);

      // Convert AI generated content to MCQ format
      const mcqData = content.map((item) => ({
        question: item.content,
        options: item.options || [
          "Option A",
          "Option B",
          "Option C",
          "Option D",
        ],
        correctAnswer:
          item.options?.indexOf(item.correctAnswer || "Option A") || 0,
        explanation: item.explanation || "",
        category: item.category,
        subject: item.category,
        topic: item.category,
        tool: item.language || "",
        technologyStack: item.language || "",
        domain: item.category,
        skillLevel:
          item.difficulty === "beginner"
            ? "beginner"
            : item.difficulty === "intermediate"
            ? "intermediate"
            : "advanced",
        jobRole: "",
        companyType: "",
        interviewType: "",
        difficulty:
          item.difficulty === "beginner"
            ? "easy"
            : item.difficulty === "intermediate"
            ? "medium"
            : "hard",
        tags: item.tags?.join(", ") || "",
        companies: "",
        priority: "medium",
        status: "draft",
      }));

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "mcq",
          data: mcqData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save AI generated content");
      }

      // Clear the form after successful save
      setMCQ({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        category: "",
        subject: "",
        topic: "",
        tool: "",
        technologyStack: "",
        domain: "",
        skillLevel: "beginner",
        jobRole: "",
        companyType: "",
        interviewType: "",
        difficulty: "easy",
        tags: "",
        companies: "",
        priority: "medium",
        status: "draft",
      });

      // Clear AI Generator content
      setClearAIContent(true);
      setTimeout(() => setClearAIContent(false), 100);

      return result;
    } catch (error) {
      console.error("Error saving AI content:", error);
      throw error;
    }
  };

  const difficulties = [
    { value: "easy", label: "Easy", color: "text-green-600 bg-green-50" },
    { value: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-50" },
    { value: "hard", label: "Hard", color: "text-red-600 bg-red-50" },
  ];

  const skillLevels = [
    { value: "beginner", label: "Beginner", color: "text-blue-600 bg-blue-50" },
    {
      value: "intermediate",
      label: "Intermediate",
      color: "text-purple-600 bg-purple-50",
    },
    {
      value: "advanced",
      label: "Advanced",
      color: "text-orange-600 bg-orange-50",
    },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-gray-600 bg-gray-50" },
    { value: "medium", label: "Medium", color: "text-blue-600 bg-blue-50" },
    { value: "high", label: "High", color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create MCQ</h1>
                <p className="text-gray-600 mt-1">
                  Build engaging multiple choice questions
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/mcq")}
                className="flex items-center"
              >
                ← Back to MCQs
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to clear the form?")) {
                    setMCQ({
                      question: "",
                      options: ["", "", "", ""],
                      correctAnswer: 0,
                      explanation: "",
                      category: "",
                      subject: "",
                      topic: "",
                      tool: "",
                      technologyStack: "",
                      domain: "",
                      skillLevel: "beginner",
                      jobRole: "",
                      companyType: "",
                      interviewType: "",
                      difficulty: "easy",
                      tags: "",
                      companies: "",
                      priority: "medium",
                      status: "draft",
                    });

                    // Clear AI Generator content
                    setClearAIContent(true);
                    setTimeout(() => setClearAIContent(false), 100);
                  }
                }}
                className="flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Form
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {saving ? (
                  <Loading size="sm" text="Saving..." />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save MCQ
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Generator - Full Width */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Generator
                  </h3>
                </div>
                <AIGenerator
                  type="mcq"
                  onContentGenerated={handleAIContentGenerated}
                  onSaveToDatabase={handleSaveAIContentToDatabase}
                  clearContent={clearAIContent}
                  currentSettings={{
                    category: mcq.category,
                    subject: mcq.subject,
                    topic: mcq.topic,
                    tool: mcq.tool,
                    technologyStack: mcq.technologyStack,
                    domain: mcq.domain,
                    difficulty: mcq.difficulty,
                    skillLevel: mcq.skillLevel,
                    tags: mcq.tags,
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Question
                  </h2>
                </div>
                <textarea
                  value={mcq.question}
                  onChange={(e) => updateMCQ("question", e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your question here..."
                />
              </div>
            </Card>

            {/* Options Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Options
                    </h2>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={mcq.options.length >= 6}
                    className="flex items-center bg-white hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-4">
                  {mcq.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={mcq.correctAnswer === index}
                        onChange={() => updateMCQ("correctAnswer", index)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )}`}
                      />
                      {mcq.options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Explanation Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <AlertCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Explanation
                  </h2>
                </div>
                <textarea
                  value={mcq.explanation}
                  onChange={(e) => updateMCQ("explanation", e.target.value)}
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Explain why this answer is correct..."
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Zap className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Settings
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {difficulties.map((diff) => (
                        <button
                          key={diff.value}
                          type="button"
                          onClick={() => updateMCQ("difficulty", diff.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            mcq.difficulty === diff.value
                              ? `${diff.color} ring-2 ring-offset-2 ring-blue-500`
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {diff.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skill Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {skillLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => updateMCQ("skillLevel", level.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            mcq.skillLevel === level.value
                              ? `${level.color} ring-2 ring-offset-2 ring-blue-500`
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {priorities.map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => updateMCQ("priority", priority.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            mcq.priority === priority.value
                              ? `${priority.color} ring-2 ring-offset-2 ring-blue-500`
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={mcq.category}
                      onChange={(e) => updateMCQ("category", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Frontend, Backend, Algorithms"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={mcq.tags}
                      onChange={(e) => updateMCQ("tags", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., javascript, react, hooks"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={mcq.subject}
                      onChange={(e) => updateMCQ("subject", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Programming, Data Structures, Algorithms"
                    />
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={mcq.topic}
                      onChange={(e) => updateMCQ("topic", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Variables, Functions, Classes"
                    />
                  </div>

                  {/* Tool */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tool
                    </label>
                    <input
                      type="text"
                      value={mcq.tool}
                      onChange={(e) => updateMCQ("tool", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>

                  {/* Technology Stack */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technology Stack
                    </label>
                    <input
                      type="text"
                      value={mcq.technologyStack}
                      onChange={(e) =>
                        updateMCQ("technologyStack", e.target.value)
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., MERN, LAMP, MEAN"
                    />
                  </div>

                  {/* Domain */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={mcq.domain}
                      onChange={(e) => updateMCQ("domain", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Web Development, Mobile, AI/ML"
                    />
                  </div>

                  {/* Job Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Role
                    </label>
                    <input
                      type="text"
                      value={mcq.jobRole}
                      onChange={(e) => updateMCQ("jobRole", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Frontend Developer, Backend Engineer"
                    />
                  </div>

                  {/* Company Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Type
                    </label>
                    <input
                      type="text"
                      value={mcq.companyType}
                      onChange={(e) => updateMCQ("companyType", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Startup, Enterprise, Agency"
                    />
                  </div>

                  {/* Interview Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Type
                    </label>
                    <input
                      type="text"
                      value={mcq.interviewType}
                      onChange={(e) =>
                        updateMCQ("interviewType", e.target.value)
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Technical, Behavioral, System Design"
                    />
                  </div>

                  {/* Companies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Companies
                    </label>
                    <input
                      type="text"
                      value={mcq.companies}
                      onChange={(e) => updateMCQ("companies", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Google, Amazon, Microsoft"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Stats
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Options</span>
                    <span className="text-sm font-medium text-gray-900">
                      {mcq.options.length}/6
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Question Length
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {mcq.question.length} chars
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${
                        mcq.difficulty === "easy"
                          ? "text-green-600 bg-green-100"
                          : mcq.difficulty === "medium"
                          ? "text-yellow-600 bg-yellow-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {mcq.difficulty.charAt(0).toUpperCase() +
                        mcq.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import AIGenerator from "@/shared/components/AIGenerator";
import { GeneratedContent } from "@/shared/lib/aiService";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Code,
  CheckCircle,
  AlertCircle,
  Brain,
  X,
} from "lucide-react";

interface Problem {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  subject: string;
  topic: string;
  tool: string;
  technologyStack: string;
  domain: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  jobRole: string;
  companyType: string;
  interviewType: string;
  testCases: string;
  solution?: string;
  hints?: string;
  tags?: string;
  companies?: string;
  priority: "high" | "medium" | "low";
  status: "draft" | "active" | "archived";
}

export default function AddProblemPage() {
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [problem, setProblem] = useState<Problem>({
    title: "",
    description: "",
    difficulty: "easy",
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
    testCases: "",
    solution: "",
    hints: "",
    tags: "",
    companies: "",
    priority: "medium",
    status: "draft",
  });

  const updateProblem = (field: keyof Problem, value: string) => {
    setProblem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!problem.title || !problem.description || !problem.testCases) {
      alert(
        "Please fill in all required fields (Title, Description, Test Cases)"
      );
      return;
    }

    setSaving(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "problems",
          data: [problem],
        }),
      });

      const result = await response.json();
      setResult(result);

      if (result.success) {
        // Reset form on success
        setProblem({
          title: "",
          description: "",
          difficulty: "easy",
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
          testCases: "",
          solution: "",
          hints: "",
          tags: "",
          companies: "",
          priority: "medium",
          status: "draft",
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Failed to save problem",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAIContentGenerated = (content: GeneratedContent[]) => {
    // Handle AI generated content
    console.log("AI generated content:", content);
  };

  const handleSaveAIContentToDatabase = async (content: GeneratedContent[]) => {
    try {
      // Convert AI generated content to problem format
      const problemData = content.map((item) => ({
        title: item.title,
        description: item.content,
        difficulty:
          item.difficulty === "beginner"
            ? "easy"
            : item.difficulty === "intermediate"
            ? "medium"
            : "hard",
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
        testCases: "Sample test cases will be generated",
        solution: item.explanation || "",
        hints: "",
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
          type: "problems",
          data: problemData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save AI generated content");
      }

      return result;
    } catch (error) {
      console.error("Error saving AI content:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/problems")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Problems
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Code className="w-8 h-8 mr-3 text-blue-600" />
                Create Problem
              </h1>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                variant="outline"
                className="flex items-center"
              >
                <Brain className="w-4 h-4 mr-2" />
                {showAIGenerator ? "Hide AI Generator" : "AI Generator"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <Loading size="sm" text="Saving..." />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Problem
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Create coding problems for assessments.
          </p>
        </div>

        {/* AI Generator */}
        {showAIGenerator && (
          <Card className="mb-6 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Generator
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
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
                type="problem"
                onContentGenerated={handleAIContentGenerated}
                onSaveToDatabase={handleSaveAIContentToDatabase}
              />
            </div>
          </Card>
        )}

        {/* Form */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Problem Details
            </h2>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={problem.title}
                  onChange={(e) => updateProblem("title", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter problem title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={problem.difficulty}
                  onChange={(e) => updateProblem("difficulty", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={problem.description}
                onChange={(e) => updateProblem("description", e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the problem in detail..."
              />
            </div>

            {/* Categorization */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Categorization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={problem.category}
                    onChange={(e) => updateProblem("category", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="algorithms">Algorithms</option>
                    <option value="data-structures">Data Structures</option>
                    <option value="arrays">Arrays</option>
                    <option value="strings">Strings</option>
                    <option value="linked-lists">Linked Lists</option>
                    <option value="stacks-queues">Stacks & Queues</option>
                    <option value="trees">Trees</option>
                    <option value="graphs">Graphs</option>
                    <option value="dynamic-programming">
                      Dynamic Programming
                    </option>
                    <option value="greedy-algorithms">Greedy Algorithms</option>
                    <option value="backtracking">Backtracking</option>
                    <option value="binary-search">Binary Search</option>
                    <option value="sorting">Sorting</option>
                    <option value="hashing">Hashing</option>
                    <option value="recursion">Recursion</option>
                    <option value="bit-manipulation">Bit Manipulation</option>
                    <option value="math">Math</option>
                    <option value="design-patterns">Design Patterns</option>
                    <option value="system-design">System Design</option>
                    <option value="database-design">Database Design</option>
                    <option value="api-design">API Design</option>
                    <option value="security">Security</option>
                    <option value="testing">Testing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={problem.subject}
                    onChange={(e) => updateProblem("subject", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    <option value="programming">Programming</option>
                    <option value="data-science">Data Science</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">
                      Mobile Development
                    </option>
                    <option value="devops">DevOps</option>
                    <option value="ai-ml">AI/ML</option>
                    <option value="database">Database</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="system-design">System Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <select
                    value={problem.topic}
                    onChange={(e) => updateProblem("topic", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Topic</option>
                    <option value="arrays">Arrays</option>
                    <option value="strings">Strings</option>
                    <option value="linked-lists">Linked Lists</option>
                    <option value="stacks-queues">Stacks & Queues</option>
                    <option value="trees">Trees</option>
                    <option value="graphs">Graphs</option>
                    <option value="dynamic-programming">
                      Dynamic Programming
                    </option>
                    <option value="greedy-algorithms">Greedy Algorithms</option>
                    <option value="backtracking">Backtracking</option>
                    <option value="binary-search">Binary Search</option>
                    <option value="sorting">Sorting</option>
                    <option value="hashing">Hashing</option>
                    <option value="recursion">Recursion</option>
                    <option value="bit-manipulation">Bit Manipulation</option>
                    <option value="math">Math</option>
                    <option value="design-patterns">Design Patterns</option>
                    <option value="system-design">System Design</option>
                    <option value="database-design">Database Design</option>
                    <option value="api-design">API Design</option>
                    <option value="security">Security</option>
                    <option value="testing">Testing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Technical Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tool/Technology
                  </label>
                  <select
                    value={problem.tool}
                    onChange={(e) => updateProblem("tool", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Tool</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="react">React</option>
                    <option value="nodejs">Node.js</option>
                    <option value="sql">SQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="docker">Docker</option>
                    <option value="kubernetes">Kubernetes</option>
                    <option value="aws">AWS</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technology Stack
                  </label>
                  <select
                    value={problem.technologyStack}
                    onChange={(e) =>
                      updateProblem("technologyStack", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="full-stack">Full Stack</option>
                    <option value="mobile">Mobile</option>
                    <option value="data">Data</option>
                    <option value="devops">DevOps</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <select
                    value={problem.domain}
                    onChange={(e) => updateProblem("domain", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Domain</option>
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="ai-ml">AI/ML</option>
                    <option value="data">Data</option>
                    <option value="cloud">Cloud</option>
                    <option value="security">Security</option>
                    <option value="gaming">Gaming</option>
                    <option value="fintech">FinTech</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Context */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Professional Context
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={problem.skillLevel}
                    onChange={(e) =>
                      updateProblem("skillLevel", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role
                  </label>
                  <select
                    value={problem.jobRole}
                    onChange={(e) => updateProblem("jobRole", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Job Role</option>
                    <option value="frontend-developer">
                      Frontend Developer
                    </option>
                    <option value="backend-developer">Backend Developer</option>
                    <option value="full-stack-developer">
                      Full Stack Developer
                    </option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="data-engineer">Data Engineer</option>
                    <option value="devops-engineer">DevOps Engineer</option>
                    <option value="mobile-developer">Mobile Developer</option>
                    <option value="software-engineer">Software Engineer</option>
                    <option value="system-architect">System Architect</option>
                    <option value="qa-engineer">QA Engineer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Type
                  </label>
                  <select
                    value={problem.companyType}
                    onChange={(e) =>
                      updateProblem("companyType", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Company Type</option>
                    <option value="tech">Tech</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="consulting">Consulting</option>
                    <option value="startup">Startup</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="government">Government</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Test Cases */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Cases *
              </label>
              <textarea
                value={problem.testCases}
                onChange={(e) => updateProblem("testCases", e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='[{"input": "[2,7,11,15], 9", "output": "[0,1]"}]'
              />
              <p className="text-sm text-gray-500 mt-1">
                Use JSON format with input and output pairs
              </p>
            </div>

            {/* Solution and Hints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution
                </label>
                <textarea
                  value={problem.solution}
                  onChange={(e) => updateProblem("solution", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the solution approach..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hints
                </label>
                <textarea
                  value={problem.hints}
                  onChange={(e) => updateProblem("hints", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide helpful hints..."
                />
              </div>
            </div>

            {/* Tags and Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={problem.tags}
                  onChange={(e) => updateProblem("tags", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="arrays, hash-table, two-pointers"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Comma-separated tags
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Companies
                </label>
                <input
                  type="text"
                  value={problem.companies}
                  onChange={(e) => updateProblem("companies", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Google, Amazon, Microsoft"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Companies that ask this type of question
                </p>
              </div>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={problem.priority}
                  onChange={(e) => updateProblem("priority", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={problem.status}
                  onChange={(e) => updateProblem("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Result */}
        {result && (
          <Card
            className={`border-2 ${
              result.success
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    result.success ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`text-lg font-semibold mb-2 ${
                      result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.success
                      ? "🎉 Problem Saved Successfully!"
                      : "❌ Failed to Save Problem"}
                  </h4>
                  <p
                    className={`text-base ${
                      result.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {result.message || result.error}
                  </p>
                  {result.success && (
                    <div className="mt-4">
                      <Button
                        onClick={() =>
                          (window.location.href = "/admin/problems")
                        }
                        variant="outline"
                        className="mr-3"
                      >
                        View All Problems
                      </Button>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                      >
                        Add Another Problem
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

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
  FileText,
  CheckCircle,
  AlertCircle,
  Brain,
} from "lucide-react";

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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
  difficulty: "easy" | "medium" | "hard";
  tags?: string;
  companies?: string;
  priority: "high" | "medium" | "low";
  status: "draft" | "active" | "archived";
}

export default function AddMCQPage() {
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
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
    if (
      !mcq.question ||
      mcq.options.some((opt) => !opt.trim()) ||
      mcq.options.length < 2
    ) {
      alert("Please fill in the question and at least 2 options");
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
          type: "mcq",
          data: [mcq],
        }),
      });

      const result = await response.json();
      setResult(result);

      if (result.success) {
        // Reset form on success
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
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Failed to save MCQ",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAIContentGenerated = (content: GeneratedContent[]) => {
    // Handle AI generated content
    console.log('AI generated content:', content);
  };

  const handleSaveAIContentToDatabase = async (content: GeneratedContent[]) => {
    try {
      // Convert AI generated content to MCQ format
      const mcqData = content.map(item => ({
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
        throw new Error(result.error || 'Failed to save AI generated content');
      }

      return result;
    } catch (error) {
      console.error('Error saving AI content:', error);
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
                onClick={() => (window.location.href = "/admin/mcq")}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to MCQs
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-purple-600" />
                Add New MCQ
              </h1>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                variant="outline"
                className="flex items-center"
              >
                <Brain className="w-4 h-4 mr-2" />
                {showAIGenerator ? 'Hide AI Generator' : 'AI Generator'}
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
                    Save MCQ
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Create a new MCQ question with comprehensive categorization and
            details.
          </p>
        </div>

        {/* AI Generator */}
        {showAIGenerator && (
          <Card className="mb-6">
            <AIGenerator
              type="mcq"
              onContentGenerated={handleAIContentGenerated}
              onSaveToDatabase={handleSaveAIContentToDatabase}
            />
          </Card>
        )}

        {/* Form */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              MCQ Details
            </h2>

            {/* Question */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                value={mcq.question}
                onChange={(e) => updateMCQ("question", e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the MCQ question..."
              />
            </div>

            {/* Options */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Options *
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  disabled={mcq.options.length >= 6}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {mcq.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={mcq.correctAnswer === index}
                      onChange={() => updateMCQ("correctAnswer", index)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    {mcq.options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Select the correct answer by clicking the radio button next to
                the option
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={mcq.difficulty}
                  onChange={(e) => updateMCQ("difficulty", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={mcq.category}
                  onChange={(e) => updateMCQ("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {/* Technical Categories */}
                  <optgroup label="Technical Categories">
                    <option value="Programming">Programming</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Database">Database</option>
                    <option value="System Design">System Design</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Machine Learning">Machine Learning</option>
                  </optgroup>
                  {/* Non-Technical Categories */}
                  <optgroup label="Non-Technical Categories">
                    <option value="Aptitude">Aptitude</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                    <option value="Verbal Ability">Verbal Ability</option>
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="English Language">English Language</option>
                    <option value="Business Communication">Business Communication</option>
                    <option value="Problem Solving">Problem Solving</option>
                    <option value="Critical Thinking">Critical Thinking</option>
                    <option value="Team Management">Team Management</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Project Management">Project Management</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Categorization */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Categorization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={mcq.subject}
                    onChange={(e) => updateMCQ("subject", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {/* Technical Subjects */}
                    <optgroup label="Technical Subjects">
                      <option value="programming">Programming</option>
                      <option value="data-science">Data Science</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-development">Mobile Development</option>
                      <option value="devops">DevOps</option>
                      <option value="ai-ml">AI/ML</option>
                      <option value="database">Database</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="system-design">System Design</option>
                    </optgroup>
                    {/* Non-Technical Subjects */}
                    <optgroup label="Non-Technical Subjects">
                      <option value="aptitude">Aptitude</option>
                      <option value="reasoning">Logical Reasoning</option>
                      <option value="verbal">Verbal Ability</option>
                      <option value="quantitative">Quantitative Aptitude</option>
                      <option value="general-knowledge">General Knowledge</option>
                      <option value="english">English Language</option>
                      <option value="communication">Business Communication</option>
                      <option value="problem-solving">Problem Solving</option>
                      <option value="critical-thinking">Critical Thinking</option>
                      <option value="leadership">Leadership</option>
                      <option value="management">Management</option>
                      <option value="business">Business</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <select
                    value={mcq.topic}
                    onChange={(e) => updateMCQ("topic", e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tool/Technology
                  </label>
                  <select
                    value={mcq.tool}
                    onChange={(e) => updateMCQ("tool", e.target.value)}
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
                    Technology Stack
                  </label>
                  <select
                    value={mcq.technologyStack}
                    onChange={(e) =>
                      updateMCQ("technologyStack", e.target.value)
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
                    value={mcq.domain}
                    onChange={(e) => updateMCQ("domain", e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={mcq.skillLevel}
                    onChange={(e) => updateMCQ("skillLevel", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
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
                    Job Role
                  </label>
                  <select
                    value={mcq.jobRole}
                    onChange={(e) => updateMCQ("jobRole", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Job Role</option>
                    {/* Technical Roles */}
                    <optgroup label="Technical Roles">
                      <option value="frontend-developer">Frontend Developer</option>
                      <option value="backend-developer">Backend Developer</option>
                      <option value="full-stack-developer">Full Stack Developer</option>
                      <option value="data-scientist">Data Scientist</option>
                      <option value="data-engineer">Data Engineer</option>
                      <option value="devops-engineer">DevOps Engineer</option>
                      <option value="mobile-developer">Mobile Developer</option>
                      <option value="software-engineer">Software Engineer</option>
                      <option value="system-architect">System Architect</option>
                      <option value="qa-engineer">QA Engineer</option>
                    </optgroup>
                    {/* Non-Technical Roles */}
                    <optgroup label="Non-Technical Roles">
                      <option value="business-analyst">Business Analyst</option>
                      <option value="project-manager">Project Manager</option>
                      <option value="product-manager">Product Manager</option>
                      <option value="marketing-executive">Marketing Executive</option>
                      <option value="sales-executive">Sales Executive</option>
                      <option value="hr-executive">HR Executive</option>
                      <option value="finance-executive">Finance Executive</option>
                      <option value="operations-manager">Operations Manager</option>
                      <option value="customer-success">Customer Success</option>
                      <option value="content-writer">Content Writer</option>
                      <option value="digital-marketing">Digital Marketing</option>
                      <option value="business-development">Business Development</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Type
                  </label>
                  <select
                    value={mcq.companyType}
                    onChange={(e) => updateMCQ("companyType", e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={mcq.interviewType}
                    onChange={(e) => updateMCQ("interviewType", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Interview Type</option>
                    {/* Technical Interview Types */}
                    <optgroup label="Technical Interview Types">
                      <option value="technical">Technical</option>
                      <option value="system-design">System Design</option>
                      <option value="coding">Coding</option>
                      <option value="data-structures">Data Structures</option>
                      <option value="algorithms">Algorithms</option>
                      <option value="database">Database</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                    </optgroup>
                    {/* Non-Technical Interview Types */}
                    <optgroup label="Non-Technical Interview Types">
                      <option value="behavioral">Behavioral</option>
                      <option value="aptitude">Aptitude</option>
                      <option value="case-study">Case Study</option>
                      <option value="group-discussion">Group Discussion</option>
                      <option value="presentation">Presentation</option>
                      <option value="assessment">Assessment</option>
                      <option value="screening">Screening</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation
              </label>
              <textarea
                value={mcq.explanation}
                onChange={(e) => updateMCQ("explanation", e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain why this is the correct answer..."
              />
            </div>

            {/* Tags and Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={mcq.tags}
                  onChange={(e) => updateMCQ("tags", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="algorithms, complexity, binary-search"
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
                  value={mcq.companies}
                  onChange={(e) => updateMCQ("companies", e.target.value)}
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
                  value={mcq.priority}
                  onChange={(e) => updateMCQ("priority", e.target.value)}
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
                  value={mcq.status}
                  onChange={(e) => updateMCQ("status", e.target.value)}
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
                      ? "🎉 MCQ Saved Successfully!"
                      : "❌ Failed to Save MCQ"}
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
                        onClick={() => (window.location.href = "/admin/mcq")}
                        variant="outline"
                        className="mr-3"
                      >
                        View All MCQs
                      </Button>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                      >
                        Add Another MCQ
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

"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Upload,
  Download,
  FileText,
  Plus,
  Trash2,
  X,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Code,
} from "lucide-react";

interface Problem {
  id?: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  testCases: string;
  solution?: string;
  hints?: string;
  tags?: string;
  companies?: string;
}

interface MCQ {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string;
  companies?: string;
}

type ContentType = "problems" | "mcq";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<ContentType>("problems");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [result, setResult] = useState<any>(null);

  // Form states
  const [problems, setProblems] = useState<Problem[]>([
    {
      title: "",
      description: "",
      difficulty: "easy",
      category: "",
      testCases: "",
      solution: "",
      hints: "",
      tags: "",
      companies: "",
    },
  ]);

  const [mcqs, setMcqs] = useState<MCQ[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "",
      difficulty: "easy",
      tags: "",
      companies: "",
    },
  ]);

  const handleUpload = async () => {
    if (uploadType === "problems") {
      const validData = problems.filter(item => item.title && item.description);
      await uploadProblems(validData);
    } else {
      const validData = mcqs.filter(item => item.question && item.options.some(opt => opt.trim()));
      await uploadMCQs(validData);
    }
  };

  const uploadProblems = async (validData: Problem[]) => {
    if (validData.length === 0) {
      alert("Please fill in at least one valid problem");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "problems",
          data: validData,
        }),
      });

      const result = await response.json();
      setResult(result);
      
      if (result.success) {
        setProblems([{
          title: "",
          description: "",
          difficulty: "easy",
          category: "",
          testCases: "",
          solution: "",
          hints: "",
          tags: "",
          companies: "",
        }]);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadMCQs = async (validData: MCQ[]) => {
    if (validData.length === 0) {
      alert("Please fill in at least one valid MCQ");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "mcq",
          data: validData,
        }),
      });

      const result = await response.json();
      setResult(result);
      
      if (result.success) {
        setMcqs([{
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          category: "",
          difficulty: "easy",
          tags: "",
          companies: "",
        }]);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const fileContent = await readFileContent(selectedFile);
      const fileType = getFileType(selectedFile.name);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: uploadType,
          fileContent,
          fileType,
        }),
      });

      const result = await response.json();
      setResult(result);
      
      if (result.success) {
        setSelectedFile(null);
        setFileInputKey((prev) => prev + 1);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "File upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "csv":
        return "csv";
      case "xlsx":
      case "xls":
        return "excel";
      case "json":
        return "json";
      default:
        return "unknown";
    }
  };

  const addProblem = () => {
    setProblems([...problems, {
      title: "",
      description: "",
      difficulty: "easy",
      category: "",
      testCases: "",
      solution: "",
      hints: "",
      tags: "",
      companies: "",
    }]);
  };

  const removeProblem = (index: number) => {
    if (problems.length > 1) {
      setProblems(problems.filter((_, i) => i !== index));
    }
  };

  const updateProblem = (index: number, field: keyof Problem, value: string) => {
    const updated = [...problems];
    updated[index] = { ...updated[index], [field]: value };
    setProblems(updated);
  };

  const addMCQ = () => {
    setMcqs([...mcqs, {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "",
      difficulty: "easy",
      tags: "",
      companies: "",
    }]);
  };

  const removeMCQ = (index: number) => {
    if (mcqs.length > 1) {
      setMcqs(mcqs.filter((_, i) => i !== index));
    }
  };

  const updateMCQ = (index: number, field: keyof MCQ, value: any) => {
    const updated = [...mcqs];
    if (field === "options") {
      updated[index] = { ...updated[index], options: value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setMcqs(updated);
  };

  const updateMCQOption = (mcqIndex: number, optionIndex: number, value: string) => {
    const updated = [...mcqs];
    updated[mcqIndex].options[optionIndex] = value;
    setMcqs(updated);
  };

  const downloadTemplate = (format: "json" | "csv") => {
    if (format === "json") {
      const template = uploadType === "problems" 
        ? `[
  {
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "difficulty": "easy",
    "category": "arrays",
    "testCases": "[{\\"input\\": \\"[2,7,11,15], 9\\", \\"output\\": \\"[0,1]\\"}]",
    "solution": "Use a hash map to store complements.",
    "hints": "Try using a hash map",
    "tags": "arrays,hash-table",
    "companies": "Google,Amazon,Microsoft"
  }
]`
        : `[
  {
    "question": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    "correctAnswer": 1,
    "explanation": "Binary search divides the search space in half with each iteration.",
    "category": "algorithms",
    "difficulty": "easy",
    "tags": "binary-search,complexity",
    "companies": "Google,Amazon,Microsoft"
  }
]`;
      
      const blob = new Blob([template], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${uploadType}-template.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const a = document.createElement("a");
      a.href = `/templates/${uploadType}-template.csv`;
      a.download = `${uploadType}-template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Upload Content</h2>
        <p className="text-blue-100">
          Add coding problems and MCQ questions to your platform.
        </p>
      </div>

      {/* Content Type Selection */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What are you uploading?</h3>
            <div className="flex space-x-6">
              <label className="flex items-center text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  value="problems"
                  checked={uploadType === "problems"}
                  onChange={(e) => setUploadType(e.target.value as ContentType)}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <Code className="w-5 h-5 mr-2" />
                <span className="font-medium">Coding Problems</span>
              </label>
              <label className="flex items-center text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  value="mcq"
                  checked={uploadType === "mcq"}
                  onChange={(e) => setUploadType(e.target.value as ContentType)}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <FileText className="w-5 h-5 mr-2" />
                <span className="font-medium">MCQ Questions</span>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate("csv")}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate("json")}
            >
              <Download className="w-4 h-4 mr-2" />
              JSON Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Upload Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Manual Entry */}
        <Card>
          <div className="flex items-center mb-4">
            <Plus className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Manual Entry</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Add content one by one using the form below.
          </p>

          {uploadType === "problems" ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Coding Problems</h4>
                <Button onClick={addProblem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Problem
                </Button>
              </div>
              
              {problems.map((problem, index) => (
                <Card key={index} className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">Problem {index + 1}</h5>
                    {problems.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProblem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={problem.title}
                          onChange={(e) => updateProblem(index, "title", e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Problem title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          value={problem.category}
                          onChange={(e) => updateProblem(index, "category", e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., arrays, strings"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={problem.description}
                        onChange={(e) => updateProblem(index, "description", e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Problem description"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty *
                        </label>
                        <select
                          value={problem.difficulty}
                          onChange={(e) => updateProblem(index, "difficulty", e.target.value as any)}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Test Cases *
                        </label>
                        <textarea
                          value={problem.testCases}
                          onChange={(e) => updateProblem(index, "testCases", e.target.value)}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder='[{"input": "[2,7,11,15], 9", "output": "[0,1]"}]'
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Solution
                        </label>
                        <textarea
                          value={problem.solution}
                          onChange={(e) => updateProblem(index, "solution", e.target.value)}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Solution approach"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={problem.tags}
                          onChange={(e) => updateProblem(index, "tags", e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="comma-separated tags"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">MCQ Questions</h4>
                <Button onClick={addMCQ} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add MCQ
                </Button>
              </div>
              
              {mcqs.map((mcq, index) => (
                <Card key={index} className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">MCQ {index + 1}</h5>
                    {mcqs.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMCQ(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question *
                      </label>
                      <textarea
                        value={mcq.question}
                        onChange={(e) => updateMCQ(index, "question", e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MCQ question"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options *
                      </label>
                      {mcq.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3 mb-2">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={mcq.correctAnswer === optionIndex}
                            onChange={() => updateMCQ(index, "correctAnswer", optionIndex)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateMCQOption(index, optionIndex, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          value={mcq.category}
                          onChange={(e) => updateMCQ(index, "category", e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., algorithms, data-structures"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty *
                        </label>
                        <select
                          value={mcq.difficulty}
                          onChange={(e) => updateMCQ(index, "difficulty", e.target.value as any)}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Explanation
                      </label>
                      <textarea
                        value={mcq.explanation}
                        onChange={(e) => updateMCQ(index, "explanation", e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Explanation for the correct answer"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-6"
          >
            {uploading ? (
              <Loading size="sm" text="Uploading..." />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {uploadType === "problems" ? "Problems" : "MCQs"}
              </>
            )}
          </Button>
        </Card>

        {/* Method 2: File Upload */}
        <Card>
          <div className="flex items-center mb-4">
            <FileSpreadsheet className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Bulk Upload</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Upload CSV, Excel, or JSON files with multiple items.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-400 transition-colors">
            <input
              key={fileInputKey}
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-2">
                {selectedFile ? selectedFile.name : "Choose a file"}
              </span>
              <span className="text-sm text-gray-500">
                {selectedFile
                  ? `Size: ${(selectedFile.size / 1024).toFixed(1)} KB`
                  : "CSV, Excel, or JSON files up to 10MB"}
              </span>
            </label>
          </div>

          {selectedFile && (
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{selectedFile.name}</p>
                    <p className="text-sm text-green-700">
                      Type: {getFileType(selectedFile.name).toUpperCase()} • 
                      Size: {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileInputKey((prev) => prev + 1);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleFileUpload}
            disabled={uploading || !selectedFile}
            className="w-full mt-6"
          >
            {uploading ? (
              <Loading size="sm" text="Uploading..." />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </Card>
      </div>

      {/* Result Display */}
      {result && (
        <Card>
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {result.success ? (
                <Check className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <h4
                className={`font-semibold ${
                  result.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {result.success ? "Upload Successful" : "Upload Failed"}
              </h4>
            </div>
            <p className="text-sm mt-2">{result.message}</p>
            {result.data?.imported !== undefined && (
              <p className="text-sm">Imported: {result.data.imported}</p>
            )}
            {result.data?.skipped !== undefined && (
              <p className="text-sm">
                Skipped (Duplicates): {result.data.skipped}
              </p>
            )}
            {result.data?.errors && result.data.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Errors:</p>
                <ul className="text-sm list-disc list-inside">
                  {result.data.errors.map(
                    (error: string, index: number) => (
                      <li key={index}>{error}</li>
                    )
                  )}
                </ul>
              </div>
            )}
            {result.data?.duplicates &&
              result.data.duplicates.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Duplicates Found:</p>
                  <ul className="text-sm list-disc list-inside">
                    {result.data.duplicates.map(
                      (dup: string, index: number) => (
                        <li key={index}>{dup}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        </Card>
      )}
    </div>
  );
}

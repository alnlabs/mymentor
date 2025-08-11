"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<"problems" | "mcq">("problems");
  const [jsonData, setJsonData] = useState("");
  const [result, setResult] = useState<any>(null);

  const problemTemplate = `[
  {
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "difficulty": "easy",
    "category": "arrays",
    "testCases": "[{\\"input\\": \\"[2,7,11,15], 9\\", \\"output\\": \\"[0,1]\\"}, {\\"input\\": \\"[3,2,4], 6\\", \\"output\\": \\"[1,2]\\"}]",
    "solution": "Use a hash map to store complements. For each number, check if its complement exists in the map.",
    "hints": "[\\"Try using a hash map\\", \\"Think about complement pairs\\"]",
    "tags": "[\\"arrays\\", \\"hash-table\\"]",
    "companies": "[\\"Google\\", \\"Amazon\\", \\"Microsoft\\"]"
  }
]`;

  const mcqTemplate = `[
  {
    "question": "What is the time complexity of binary search?",
    "options": "[\\"O(n)\\", \\"O(log n)\\", \\"O(n²)\\", \\"O(1)\\"]]",
    "correctAnswer": 1,
    "explanation": "Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity.",
    "category": "algorithms",
    "difficulty": "easy",
    "tags": "[\\"binary-search\\", \\"complexity\\"]",
    "companies": "[\\"Google\\", \\"Amazon\\", \\"Microsoft\\"]"
  }
]`;

  const handleUpload = async () => {
    if (!jsonData.trim()) {
      alert("Please enter JSON data");
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
          type: uploadType,
          data: JSON.parse(jsonData),
        }),
      });

      const result = await response.json();
      setResult(result);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const loadTemplate = () => {
    setJsonData(uploadType === "problems" ? problemTemplate : mcqTemplate);
  };

  const clearData = () => {
    setJsonData("");
    setResult(null);
  };

  const copyTemplate = () => {
    const template = uploadType === "problems" ? problemTemplate : mcqTemplate;
    navigator.clipboard.writeText(template);
    alert("Template copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Upload Content</h2>
        <p className="text-green-100">
          Upload coding problems and MCQ questions to expand your platform's
          content library.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <h3 className="text-xl font-semibold mb-6">📤 Upload Content</h3>

          <div className="space-y-6">
            {/* Upload Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="problems"
                    checked={uploadType === "problems"}
                    onChange={(e) =>
                      setUploadType(e.target.value as "problems" | "mcq")
                    }
                    className="mr-2"
                  />
                  Problems
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mcq"
                    checked={uploadType === "mcq"}
                    onChange={(e) =>
                      setUploadType(e.target.value as "problems" | "mcq")
                    }
                    className="mr-2"
                  />
                  MCQ Questions
                </label>
              </div>
            </div>

            {/* JSON Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JSON Data
              </label>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                rows={15}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste your JSON data here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button onClick={loadTemplate} variant="outline">
                Load Template
              </Button>
              <Button onClick={copyTemplate} variant="outline">
                Copy Template
              </Button>
              <Button onClick={clearData} variant="outline">
                Clear
              </Button>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={uploading || !jsonData.trim()}
              className="w-full"
            >
              {uploading ? (
                <Loading size="sm" text="Uploading..." />
              ) : (
                "Upload Content"
              )}
            </Button>

            {/* Result Display */}
            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <h4
                  className={`font-semibold ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.success ? "Upload Successful" : "Upload Failed"}
                </h4>
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
            )}
          </div>
        </Card>

        {/* Template Section */}
        <Card>
          <h3 className="text-xl font-semibold mb-6">📋 Template & Tips</h3>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                {uploadType === "problems"
                  ? "Problem Template"
                  : "MCQ Template"}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {uploadType === "problems" ? problemTemplate : mcqTemplate}
                </pre>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">💡 Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• IDs are automatically generated from title/question</li>
                <li>• Duplicates are automatically detected and skipped</li>
                <li>• Escape quotes in JSON strings with backslashes</li>
                <li>• Test your JSON format before uploading</li>
                <li>• You can upload multiple items in one array</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">
                ⚠️ Important:
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Make sure JSON is properly formatted</li>
                <li>• All required fields must be present</li>
                <li>• Arrays should be properly escaped</li>
                <li>• Test with a small sample first</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

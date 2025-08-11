'use client';

import React, { useState } from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';

export default function AdminPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'problems' | 'mcq'>('problems');
  const [jsonData, setJsonData] = useState('');
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
  },
  {
    "title": "Reverse String",
    "description": "Write a function that reverses a string. The input string is given as an array of characters s.",
    "difficulty": "easy",
    "category": "strings",
    "testCases": "[{\\"input\\": \\"['h','e','l','l','o']\\", \\"output\\": \\"['o','l','l','e','h']\\"}]",
    "solution": "Use two pointers approach. Swap characters from both ends until pointers meet in the middle.",
    "hints": "[\\"Use two pointers\\", \\"Swap from both ends\\"]",
    "tags": "[\\"strings\\", \\"two-pointers\\"]",
    "companies": "[\\"Microsoft\\", \\"Apple\\"]"
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
  },
  {
    "question": "Which data structure uses LIFO (Last In, First Out) principle?",
    "options": "[\\"Queue\\", \\"Stack\\", \\"Tree\\", \\"Graph\\"]]",
    "correctAnswer": 1,
    "explanation": "Stack follows LIFO principle where the last element added is the first one to be removed.",
    "category": "data-structures",
    "difficulty": "easy",
    "tags": "[\\"stack\\", \\"lifo\\"]",
    "companies": "[\\"Microsoft\\", \\"Apple\\"]"
  }
]`;

  const handleUpload = async () => {
    if (!jsonData.trim()) {
      alert('Please enter JSON data');
      return;
    }

    setUploading(true);
    try {
      const data = JSON.parse(jsonData);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: uploadType,
          data,
        }),
      });

      const result = await response.json();
      setResult(result);
      
      if (result.success) {
        alert(`Upload completed: ${result.data.imported} imported, ${result.data.skipped} skipped (duplicates), ${result.data.errors?.length || 0} errors`);
        setJsonData('');
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      alert('Invalid JSON data');
    } finally {
      setUploading(false);
    }
  };

  const loadTemplate = () => {
    const template = uploadType === 'problems' ? problemTemplate : mcqTemplate;
    setJsonData(template);
  };

  const clearData = () => {
    setJsonData('');
    setResult(null);
  };

  const copyTemplate = () => {
    const template = uploadType === 'problems' ? problemTemplate : mcqTemplate;
    navigator.clipboard.writeText(template);
    alert('Template copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MyMentor Admin</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
              ← Back to MyMentor
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Upload Content</h2>
            
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
                      checked={uploadType === 'problems'}
                      onChange={(e) => setUploadType(e.target.value as 'problems' | 'mcq')}
                      className="mr-2"
                    />
                    Problems
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="mcq"
                      checked={uploadType === 'mcq'}
                      onChange={(e) => setUploadType(e.target.value as 'problems' | 'mcq')}
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                  placeholder="Paste your JSON data here..."
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={loadTemplate} variant="outline" size="sm">
                  Load Template
                </Button>
                <Button onClick={clearData} variant="outline" size="sm">
                  Clear
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? <Loading size="sm" text="Uploading..." /> : 'Upload'}
                </Button>
              </div>

              {/* Result */}
              {result && (
                <div className={`p-4 rounded-lg ${
                  result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <h4 className={`font-semibold ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Upload Results' : 'Upload Failed'}
                  </h4>
                  <p className="text-sm mt-2">
                    {result.message}
                  </p>
                  
                  {/* Import Summary */}
                  {result.data && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">✅ Imported:</span>
                        <span className="font-medium">{result.data.imported || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-700">⚠️ Skipped (duplicates):</span>
                        <span className="font-medium">{result.data.skipped || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">❌ Errors:</span>
                        <span className="font-medium">{result.data.errors?.length || 0}</span>
                      </div>
                    </div>
                  )}

                  {/* Duplicate Details */}
                  {result.data?.duplicates && result.data.duplicates.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-yellow-800">Duplicates Found:</p>
                      <ul className="text-sm list-disc list-inside text-yellow-700 mt-1">
                        {result.data.duplicates.map((duplicate: string, index: number) => (
                          <li key={index}>{duplicate}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Error Details */}
                  {result.data?.errors && result.data.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-red-800">Errors:</p>
                      <ul className="text-sm list-disc list-inside text-red-700 mt-1">
                        {result.data.errors.map((error: string, index: number) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Template Section */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {uploadType === 'problems' ? 'Problem' : 'MCQ'} Template
              </h2>
              <Button onClick={copyTemplate} variant="outline" size="sm">
                Copy Template
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">🎉 Auto-Generated IDs!</h3>
                <p className="text-sm text-green-800">
                  You don't need to provide IDs anymore! The system will automatically generate unique IDs based on the title/question.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">🛡️ Duplicate Protection!</h3>
                <p className="text-sm text-blue-800">
                  The system automatically detects and skips duplicate questions/problems based on title/question content. No more accidental duplicates!
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Required Fields:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {uploadType === 'problems' ? (
                    <>
                      <li><code className="bg-gray-200 px-1 rounded">title</code> - Problem title</li>
                      <li><code className="bg-gray-200 px-1 rounded">description</code> - Problem description</li>
                      <li><code className="bg-gray-200 px-1 rounded">difficulty</code> - easy/medium/hard</li>
                      <li><code className="bg-gray-200 px-1 rounded">category</code> - arrays/strings/algorithms</li>
                      <li><code className="bg-gray-200 px-1 rounded">testCases</code> - JSON string of test cases</li>
                      <li><code className="bg-gray-200 px-1 rounded">solution</code> - Solution explanation</li>
                      <li><code className="bg-gray-200 px-1 rounded">hints</code> - JSON string of hints</li>
                      <li><code className="bg-gray-200 px-1 rounded">tags</code> - JSON string of tags</li>
                      <li><code className="bg-gray-200 px-1 rounded">companies</code> - JSON string of companies</li>
                    </>
                  ) : (
                    <>
                      <li><code className="bg-gray-200 px-1 rounded">question</code> - MCQ question text</li>
                      <li><code className="bg-gray-200 px-1 rounded">options</code> - JSON string of options</li>
                      <li><code className="bg-gray-200 px-1 rounded">correctAnswer</code> - Index of correct option (0-based)</li>
                      <li><code className="bg-gray-200 px-1 rounded">explanation</code> - Answer explanation</li>
                      <li><code className="bg-gray-200 px-1 rounded">category</code> - algorithms/data-structures</li>
                      <li><code className="bg-gray-200 px-1 rounded">difficulty</code> - easy/medium/hard</li>
                      <li><code className="bg-gray-200 px-1 rounded">tags</code> - JSON string of tags</li>
                      <li><code className="bg-gray-200 px-1 rounded">companies</code> - JSON string of companies</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Example Template:</h3>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {uploadType === 'problems' ? problemTemplate : mcqTemplate}
                </pre>
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
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

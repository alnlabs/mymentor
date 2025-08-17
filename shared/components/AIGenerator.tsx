"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import {
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Download,
  Copy,
} from "lucide-react";
import {
  AIGenerationRequest,
  AIGenerationResponse,
  GeneratedContent,
  aiService,
} from "@/shared/lib/aiService";

interface AIGeneratorProps {
  type: "exam" | "interview" | "mcq" | "problem";
  onContentGenerated?: (content: GeneratedContent[]) => void;
  onSaveToDatabase?: (content: GeneratedContent[]) => Promise<void>;
  className?: string;
  currentSettings?: {
    category?: string;
    subject?: string;
    topic?: string;
    tool?: string;
    technologyStack?: string;
    domain?: string;
    difficulty?: string;
    skillLevel?: string;
    tags?: string;
  };
  clearContent?: boolean;
}

interface GenerationConfig {
  language: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  count: number;
  context?: string;
}

export default function AIGenerator({
  type,
  onContentGenerated,
  onSaveToDatabase,
  className = "",
  currentSettings,
  clearContent = false,
}: AIGeneratorProps) {
  const [config, setConfig] = useState<GenerationConfig>({
    language: currentSettings?.tool || "JavaScript",
    topic: currentSettings?.topic || "General",
    difficulty: (currentSettings?.difficulty === "easy"
      ? "beginner"
      : currentSettings?.difficulty === "medium"
      ? "intermediate"
      : currentSettings?.difficulty === "hard"
      ? "advanced"
      : "intermediate") as "beginner" | "intermediate" | "advanced",
    count: 5,
    context: currentSettings
      ? `Subject: ${currentSettings.subject || ""}, Domain: ${
          currentSettings.domain || ""
        }, Category: ${currentSettings.category || ""}, Tags: ${
          currentSettings.tags || ""
        }`
      : undefined,
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>(
    []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "TypeScript",
    "Go",
    "Rust",
    "PHP",
  ];
  const topics = [
    "General",
    "Algorithms",
    "Data Structures",
    "Web Development",
    "Database",
    "System Design",
    "Machine Learning",
    "DevOps",
  ];
  const difficulties = ["beginner", "intermediate", "advanced"];

  useEffect(() => {
    if (currentSettings) {
      setConfig((prev) => ({
        ...prev,
        language: currentSettings.tool || "JavaScript",
        topic: currentSettings.topic || "General",
        difficulty: (currentSettings.difficulty === "easy"
          ? "beginner"
          : currentSettings.difficulty === "medium"
          ? "intermediate"
          : currentSettings.difficulty === "hard"
          ? "advanced"
          : "intermediate") as "beginner" | "intermediate" | "advanced",
        count: prev.count || 5, // Ensure count is preserved
        context: currentSettings
          ? `Subject: ${currentSettings.subject || ""}, Domain: ${
              currentSettings.domain || ""
            }, Category: ${currentSettings.category || ""}, Tags: ${
              currentSettings.tags || ""
            }`
          : undefined,
      }));
    }
  }, [currentSettings]);

  // Clear generated content when clearContent prop is true
  useEffect(() => {
    if (clearContent) {
      setGeneratedContent([]);
      setMessage(null);
    }
  }, [clearContent]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage(null);

    try {
      const request: AIGenerationRequest = {
        type,
        language: config.language,
        topic: config.topic,
        difficulty: config.difficulty,
        count: config.count,
        context: config.context,
      };

      const response: AIGenerationResponse = await aiService.generateContent(
        request
      );

      if (response.success && response.content) {
        console.log(
          "AI Generator received content:",
          response.content.length,
          "items"
        );
        console.log(
          "First few items:",
          response.content
            .slice(0, 3)
            .map((item) => ({ id: item.id, title: item.title }))
        );
        setGeneratedContent(response.content);
        onContentGenerated?.(response.content);
        setMessage({
          type: "success",
          text: `Successfully generated ${response.content.length} ${type} items!`,
        });
      } else {
        throw new Error(response.error || "Generation failed");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to generate content",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!onSaveToDatabase || generatedContent.length === 0) return;

    setIsSaving(true);
    try {
      await onSaveToDatabase(generatedContent);
      setMessage({
        type: "success",
        text: "Content saved to database successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save content",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = (content: GeneratedContent) => {
    const textToCopy = `${content.title}\n\n${content.content}`;
    navigator.clipboard.writeText(textToCopy);
    setMessage({
      type: "success",
      text: "Content copied to clipboard!",
    });
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(generatedContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-generated-${type}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI Content Generator
            </h3>
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {type.toUpperCase()}
            </span>
          </div>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={currentSettings?.tool || config.language}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              value={currentSettings?.topic || config.topic}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, topic: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={
                currentSettings?.difficulty === "easy"
                  ? "beginner"
                  : currentSettings?.difficulty === "medium"
                  ? "intermediate"
                  : currentSettings?.difficulty === "hard"
                  ? "advanced"
                  : config.difficulty
              }
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  difficulty: e.target.value as any,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Count
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.count || 5}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 100) {
                  setConfig((prev) => ({
                    ...prev,
                    count: value,
                  }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={
              currentSettings
                ? `Subject: ${currentSettings.subject || ""}, Domain: ${
                    currentSettings.domain || ""
                  }, Category: ${currentSettings.category || ""}, Tags: ${
                    currentSettings.tags || ""
                  }`
                : config.context || ""
            }
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, context: e.target.value }))
            }
            placeholder="Add specific requirements or context for the AI..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <Loading size="sm" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </Card>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Content ({generatedContent.length} items)
            </h3>
            <div className="flex space-x-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              {onSaveToDatabase && (
                <Button
                  onClick={handleSaveToDatabase}
                  disabled={isSaving}
                  size="sm"
                  className="flex items-center"
                >
                  {isSaving ? (
                    <>
                      <Loading size="sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Save to DB
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {generatedContent.map((content, index) => (
              <div
                key={content.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{content.title}</h4>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleCopyToClipboard(content)}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mr-2">
                    {content.difficulty}
                  </span>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs mr-2">
                    {content.category}
                  </span>
                  {content.language && (
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {content.language}
                    </span>
                  )}
                </div>

                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {content.content}
                  </pre>
                </div>

                {content.options && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Options:
                    </h5>
                    <div className="space-y-1">
                      {content.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`text-sm p-2 rounded ${
                            option === content.correctAnswer
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {content.explanation && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Explanation:
                    </h5>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                      {content.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

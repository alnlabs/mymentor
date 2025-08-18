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
  onSaveToDatabase?: (content: GeneratedContent[]) => Promise<any>;
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
  questionTypes?: {
    mcq: boolean;
    problem: boolean;
  };
}

interface GenerationConfig {
  language: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  count?: number;
  context?: string;
  mixTypes?: boolean;
}

export default function AIGenerator({
  type,
  onContentGenerated,
  onSaveToDatabase,
  className = "",
  currentSettings,
  clearContent = false,
  questionTypes,
}: AIGeneratorProps) {
  // Form persistence key
  const formKey = `ai-generator-${type}`;

  // Load saved form data from localStorage
  const loadSavedForm = (): GenerationConfig | null => {
    try {
      const saved = localStorage.getItem(formKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error loading saved form data:", error);
      return null;
    }
  };

  // Save form data to localStorage
  const saveFormData = (data: GenerationConfig) => {
    try {
      localStorage.setItem(formKey, JSON.stringify(data));
      console.log(`Form data saved for ${type}:`, data);
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const [config, setConfig] = useState<GenerationConfig>(() => {
    // Try to load saved form data first
    const savedForm = loadSavedForm();

    if (savedForm) {
      return {
        ...savedForm,
        // Override with currentSettings if available
        language: currentSettings?.tool || savedForm.language,
        topic: currentSettings?.topic || savedForm.topic,
        difficulty: (currentSettings?.difficulty === "easy"
          ? "beginner"
          : currentSettings?.difficulty === "medium"
          ? "intermediate"
          : currentSettings?.difficulty === "hard"
          ? "advanced"
          : savedForm.difficulty) as "beginner" | "intermediate" | "advanced",
        context: currentSettings
          ? `Subject: ${currentSettings.subject || ""}, Domain: ${
              currentSettings.domain || ""
            }, Category: ${currentSettings.category || ""}, Tags: ${
              currentSettings.tags || ""
            }`
          : savedForm.context,
      };
    }

    // Default values if no saved data
    return {
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
      mixTypes: false,
    };
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

  // Update config and save to localStorage
  const updateConfig = (updates: Partial<GenerationConfig>) => {
    const newConfig = { ...config, ...updates };
    console.log(`Updating config for ${type}:`, {
      current: config,
      updates,
      new: newConfig,
    });
    setConfig(newConfig);
    saveFormData(newConfig);
  };

  useEffect(() => {
    if (currentSettings) {
      // Only update if we don't have saved form data, or if currentSettings has new values
      const savedForm = loadSavedForm();
      const shouldUpdate =
        !savedForm ||
        (currentSettings.tool && currentSettings.tool !== savedForm.language) ||
        (currentSettings.topic && currentSettings.topic !== savedForm.topic) ||
        (currentSettings.difficulty &&
          ((currentSettings.difficulty === "easy" &&
            savedForm.difficulty !== "beginner") ||
            (currentSettings.difficulty === "medium" &&
              savedForm.difficulty !== "intermediate") ||
            (currentSettings.difficulty === "hard" &&
              savedForm.difficulty !== "advanced")));

      if (shouldUpdate) {
        const updatedConfig = {
          language: currentSettings.tool || config.language,
          topic: currentSettings.topic || config.topic,
          difficulty: (currentSettings.difficulty === "easy"
            ? "beginner"
            : currentSettings.difficulty === "medium"
            ? "intermediate"
            : currentSettings.difficulty === "hard"
            ? "advanced"
            : config.difficulty) as "beginner" | "intermediate" | "advanced",
          count: config.count || 5, // Preserve user's count preference
          context:
            currentSettings.subject ||
            currentSettings.domain ||
            currentSettings.category ||
            currentSettings.tags
              ? `Subject: ${currentSettings.subject || ""}, Domain: ${
                  currentSettings.domain || ""
                }, Category: ${currentSettings.category || ""}, Tags: ${
                  currentSettings.tags || ""
                }`
              : config.context, // Preserve user's context if no currentSettings context
        };

        setConfig(updatedConfig);
        saveFormData(updatedConfig);
      }
    }
  }, [currentSettings]);

  // Clear generated content and reset form when clearContent prop is true
  useEffect(() => {
    if (clearContent) {
      setGeneratedContent([]);
      setMessage(null);

      // Reset form to default values
      const defaultConfig: GenerationConfig = {
        language: currentSettings?.tool || "JavaScript",
        topic: currentSettings?.topic || "General",
        difficulty: (currentSettings?.difficulty === "easy"
          ? "beginner"
          : currentSettings?.difficulty === "medium"
          ? "intermediate"
          : currentSettings?.difficulty === "hard"
          ? "advanced"
          : "intermediate") as "beginner" | "intermediate" | "advanced",
        count: 5, // Reset count to default
        context: currentSettings
          ? `Subject: ${currentSettings.subject || ""}, Domain: ${
              currentSettings.domain || ""
            }, Category: ${currentSettings.category || ""}, Tags: ${
              currentSettings.tags || ""
            }`
          : undefined,
        mixTypes: false, // Reset mix types to default
      };

      setConfig(defaultConfig);
      saveFormData(defaultConfig);
    }
  }, [clearContent, currentSettings]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage(null);

    try {
      // Use currentSettings if available, otherwise fall back to config
      const request: AIGenerationRequest = {
        type,
        language: currentSettings?.tool || config.language,
        topic: currentSettings?.topic || config.topic,
        difficulty: (currentSettings?.difficulty === "easy"
          ? "beginner"
          : currentSettings?.difficulty === "medium"
          ? "intermediate"
          : currentSettings?.difficulty === "hard"
          ? "advanced"
          : config.difficulty) as "beginner" | "intermediate" | "advanced",
        count: config.count || 5,
        context: currentSettings
          ? `Subject: ${currentSettings.subject || ""}, Domain: ${
              currentSettings.domain || ""
            }, Category: ${currentSettings.category || ""}, Tags: ${
              currentSettings.tags || ""
            }`
          : config.context,
        mixTypes: questionTypes
          ? questionTypes.mcq && questionTypes.problem
          : config.mixTypes,
      };

      console.log("AI Generation Request:", {
        type,
        language: request.language,
        topic: request.topic,
        difficulty: request.difficulty,
        count: request.count,
        context: request.context,
        currentSettings,
        config,
      });

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
    setMessage(null);

    try {
      const result = await onSaveToDatabase(generatedContent);

      // Check if result has detailed data
      if (result && result.data) {
        const { imported, skipped, errors, totalProcessed } = result.data;
        setMessage({
          type: "success",
          text: `Saved to database: ${imported}/${totalProcessed} items saved${
            skipped > 0 ? `, ${skipped} skipped` : ""
          }${errors.length > 0 ? `, ${errors.length} errors` : ""}`,
        });
      } else {
        setMessage({
          type: "success",
          text: "Content saved to database successfully!",
        });
      }
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

        {/* Mix Question Types Option - Moved to top */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="mixTypes"
              checked={config.mixTypes || false}
              onChange={(e) => updateConfig({ mixTypes: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label
              htmlFor="mixTypes"
              className="text-sm font-medium text-gray-700"
            >
              Mix Question Types
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-7">
            Generate a mix of different question types (MCQ, Problems, etc.) for
            the selected language
          </p>
        </div>

        <div
          className={`grid gap-4 mb-6 ${
            config.mixTypes
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={config.language}
              onChange={(e) => updateConfig({ language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {!config.mixTypes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={config.topic}
                onChange={(e) => updateConfig({ topic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!config.mixTypes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={config.difficulty}
                onChange={(e) =>
                  updateConfig({
                    difficulty: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced",
                  })
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
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Count
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.count || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  // Allow empty value temporarily
                  updateConfig({ count: undefined });
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
                    updateConfig({ count: numValue });
                  }
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  isNaN(parseInt(value)) ||
                  parseInt(value) < 1
                ) {
                  updateConfig({ count: 5 });
                } else if (parseInt(value) > 100) {
                  updateConfig({ count: 100 });
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
            value={config.context || ""}
            onChange={(e) => updateConfig({ context: e.target.value })}
            placeholder="Add specific requirements or context for the AI..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center"
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

          <Button
            onClick={() => {
              if (
                confirm("Are you sure you want to clear the AI Generator form?")
              ) {
                const defaultConfig: GenerationConfig = {
                  language: currentSettings?.tool || "JavaScript",
                  topic: currentSettings?.topic || "General",
                  difficulty: (currentSettings?.difficulty === "easy"
                    ? "beginner"
                    : currentSettings?.difficulty === "medium"
                    ? "intermediate"
                    : currentSettings?.difficulty === "hard"
                    ? "advanced"
                    : "intermediate") as
                    | "beginner"
                    | "intermediate"
                    | "advanced",
                  count: 5,
                  context: currentSettings
                    ? `Subject: ${currentSettings.subject || ""}, Domain: ${
                        currentSettings.domain || ""
                      }, Category: ${currentSettings.category || ""}, Tags: ${
                        currentSettings.tags || ""
                      }`
                    : undefined,
                  mixTypes: false,
                };

                setConfig(defaultConfig);
                saveFormData(defaultConfig);
                setGeneratedContent([]);
                setMessage({
                  type: "success",
                  text: "Form reset to default values!",
                });
              }
            }}
            variant="outline"
            className="px-4"
            title="Clear Form"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
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
              {type === "exam"
                ? `Create Exam (${generatedContent.length} questions)`
                : `Generated Content (${generatedContent.length} items)`}
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
              {onSaveToDatabase && type !== "exam" && (
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
              {type === "exam" && (
                <Button
                  onClick={() => {
                    // Trigger exam creation by calling onSaveToDatabase with the generated content
                    if (onSaveToDatabase) {
                      onSaveToDatabase(generatedContent);
                    }
                  }}
                  disabled={isSaving}
                  size="sm"
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <Loading size="sm" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Save Exam
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

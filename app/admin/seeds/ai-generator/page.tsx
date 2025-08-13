"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Brain,
  Plus,
  Save,
  Download,
  RefreshCw,
  Zap,
  BookOpen,
  Target,
  Code,
  Database,
  FileText,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Layers,
} from "lucide-react";

interface GenerationConfig {
  language: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  count: number;
  includeExplanation: boolean;
  includeTags: boolean;
  includeCompanies: boolean;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  tags?: string[];
  companies?: string[];
  difficulty: string;
  topic: string;
}

interface SeedData {
  language: string;
  concepts: Array<{
    name: string;
    difficulty: string;
    questionCount: number;
    type: string;
    inDatabase: boolean;
    questionsInDB: number;
    problemsInDB: number;
    questions: any[];
    problems: any[];
  }>;
  totalQuestions: number;
  inDatabaseCount: number;
}

interface LanguageStats {
  totalQuestions: number;
  totalInDB: number;
  beginner: number;
  intermediate: number;
  advanced: number;
  concepts: string[];
  topics: string[];
}

export default function AIGeneratorPage() {
  const [config, setConfig] = useState<GenerationConfig>({
    language: "",
    topic: "",
    difficulty: "intermediate",
    count: 10,
    includeExplanation: true,
    includeTags: true,
    includeCompanies: true,
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  const [seedData, setSeedData] = useState<SeedData[]>([]);
  const [selectedLanguageStats, setSelectedLanguageStats] =
    useState<LanguageStats | null>(null);

  const difficulties = [
    { value: "beginner", label: "Beginner", color: "text-green-600" },
    { value: "intermediate", label: "Intermediate", color: "text-yellow-600" },
    { value: "advanced", label: "Advanced", color: "text-red-600" },
  ];

  // Map difficulty levels from seed files to our standard format
  const mapDifficulty = (difficulty: string): string => {
    const mapping: { [key: string]: string } = {
      easy: "beginner",
      beginner: "beginner",
      medium: "intermediate",
      intermediate: "intermediate",
      hard: "advanced",
      advanced: "advanced",
    };
    return mapping[difficulty?.toLowerCase()] || "intermediate";
  };

  // Calculate language stats from seed data
  const languageStats = useMemo(() => {
    const stats: { [key: string]: LanguageStats } = {};

    seedData.forEach((seed) => {
      const difficultyCounts = { beginner: 0, intermediate: 0, advanced: 0 };
      const concepts = new Set<string>();
      const topics = new Set<string>();

      seed.concepts.forEach((concept) => {
        concepts.add(concept.name);
        // Use concept name as topic - they're the same in our current structure
        topics.add(concept.name);

        // Count questions by difficulty
        const conceptQuestions = concept.questions || [];
        const conceptProblems = concept.problems || [];

        // Count MCQ questions by difficulty
        conceptQuestions.forEach((q: any) => {
          if (q.difficulty) {
            const mappedDifficulty = mapDifficulty(q.difficulty);
            if (
              difficultyCounts[
                mappedDifficulty as keyof typeof difficultyCounts
              ] !== undefined
            ) {
              difficultyCounts[
                mappedDifficulty as keyof typeof difficultyCounts
              ]++;
            }
          }
        });

        // Count problems by difficulty
        conceptProblems.forEach((p: any) => {
          if (p.difficulty) {
            const mappedDifficulty = mapDifficulty(p.difficulty);
            if (
              difficultyCounts[
                mappedDifficulty as keyof typeof difficultyCounts
              ] !== undefined
            ) {
              difficultyCounts[
                mappedDifficulty as keyof typeof difficultyCounts
              ]++;
            }
          }
        });

        // If questions don't have individual difficulty, use concept difficulty
        const questionsWithoutDifficulty = conceptQuestions.filter(
          (q: any) => !q.difficulty
        ).length;
        const problemsWithoutDifficulty = conceptProblems.filter(
          (p: any) => !p.difficulty
        ).length;

        if (questionsWithoutDifficulty > 0 || problemsWithoutDifficulty > 0) {
          const totalWithoutDifficulty =
            questionsWithoutDifficulty + problemsWithoutDifficulty;
          if (concept.difficulty) {
            const mappedDifficulty = mapDifficulty(concept.difficulty);
            if (
              difficultyCounts[
                mappedDifficulty as keyof typeof difficultyCounts
              ] !== undefined
            ) {
              difficultyCounts[
                mappedDifficulty as keyof typeof difficultyCounts
              ] += totalWithoutDifficulty;
            }
          }
        }
      });

      console.log(`Stats for ${seed.language}:`, {
        totalQuestions: seed.totalQuestions,
        totalInDB: seed.inDatabaseCount,
        difficultyCounts,
        conceptsCount: concepts.size,
        topicsCount: topics.size,
        concepts: seed.concepts.map((c: any) => ({
          name: c.name,
          questionCount: c.questionCount,
          questions: c.questions?.length || 0,
          problems: c.problems?.length || 0,
          difficulty: c.difficulty,
        })),
      });

      stats[seed.language] = {
        totalQuestions: seed.totalQuestions,
        totalInDB: seed.inDatabaseCount,
        beginner: difficultyCounts.beginner,
        intermediate: difficultyCounts.intermediate,
        advanced: difficultyCounts.advanced,
        concepts: Array.from(concepts),
        topics: Array.from(topics), // Using Set automatically removes duplicates
      };
    });

    return stats;
  }, [seedData]);

  // Get available languages and topics
  const availableLanguages = useMemo(
    () => Object.keys(languageStats),
    [languageStats]
  );
  const availableTopics = useMemo(() => {
    const topics: { [key: string]: string[] } = {};
    availableLanguages.forEach((lang) => {
      const langTopics = languageStats[lang]?.topics || [];
      // Remove any duplicates that might have slipped through
      const uniqueTopics = Array.from(new Set(langTopics));
      topics[lang] = uniqueTopics;

      // Debug: Log if we find duplicates
      if (langTopics.length !== uniqueTopics.length) {
        console.warn(`Found duplicate topics for ${lang}:`, {
          original: langTopics,
          unique: uniqueTopics,
        });
      }
    });
    return topics;
  }, [availableLanguages, languageStats]);

  // Load seed data
  const loadSeedData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/seeds");
      const data = await response.json();

      if (data.success) {
        console.log("Seed data loaded:", data.data);
        setSeedData(data.data);

        // Set initial language and topic if not set
        if (!config.language && data.data.length > 0) {
          const firstLanguage = data.data[0].language;
          const firstTopic = data.data[0].concepts[0]?.name || "";
          setConfig((prev) => ({
            ...prev,
            language: firstLanguage,
            topic: firstTopic,
          }));
        }
      } else {
        setMessage({ type: "error", text: "Failed to load seed data" });
      }
    } catch (error) {
      console.error("Error loading seed data:", error);
      setMessage({ type: "error", text: "Failed to load seed data" });
    } finally {
      setIsLoading(false);
    }
  };

  // Update selected language stats when config changes
  useEffect(() => {
    if (config.language && languageStats[config.language]) {
      setSelectedLanguageStats(languageStats[config.language]);
    }
  }, [config.language, languageStats]);

  // Load data on mount
  useEffect(() => {
    loadSeedData();
  }, []);

  const generateQuestions = async () => {
    setIsGenerating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/seeds/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setGeneratedQuestions(data.questions);
        setMessage({
          type: "success",
          text: `Successfully generated ${data.questions.length} questions!`,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Unknown error occurred",
        });
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to generate questions",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToDatabase = async () => {
    if (generatedQuestions.length === 0) {
      setMessage({ type: "error", text: "No questions to save" });
      return;
    }

    console.log("🔄 Starting save process...", {
      questionsCount: generatedQuestions.length,
      language: config.language,
      topic: config.topic,
    });

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/seeds/save-generated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: generatedQuestions,
          language: config.language,
          topic: config.topic,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("✅ Save successful!", data);

        // Success case with detailed feedback
        let successMessage = `✅ Successfully saved ${data.savedCount} out of ${data.totalQuestions} questions to database!`;

        if (data.errors && data.errors.length > 0) {
          successMessage += `\n⚠️ ${data.errors.length} questions had issues (duplicates or errors).`;
          console.log("⚠️ Save errors:", data.errors);
        }

        setMessage({
          type: "success",
          text: successMessage,
        });

        // Clear generated questions only if all were saved successfully
        if (data.savedCount === data.totalQuestions) {
          setGeneratedQuestions([]);
        } else {
          // Keep questions that failed to save for retry
          setMessage({
            type: "warning",
            text: `${successMessage}\n\nSome questions failed to save. You can try saving again or export the remaining questions.`,
          });
        }

        // Reload data to update stats
        loadSeedData();
      } else {
        // Error case
        console.error("❌ Save failed:", data);
        setMessage({
          type: "error",
          text: `❌ Save failed: ${data.error || "Unknown error occurred"}`,
        });
      }
    } catch (error: any) {
      console.error("Save error:", error);
      setMessage({
        type: "error",
        text: `❌ Network error: ${
          error.message || "Failed to connect to server"
        }`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportToSeeds = async () => {
    if (generatedQuestions.length === 0) {
      setMessage({ type: "error", text: "No questions to export" });
      return;
    }

    console.log("🔄 Starting export to seeds...", {
      questionsCount: generatedQuestions.length,
      language: config.language,
      topic: config.topic,
    });

    setIsExporting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/seeds/export-to-seeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: generatedQuestions,
          language: config.language,
          topic: config.topic,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log("✅ Export successful!", data);
        setMessage({
          type: "success",
          text: `✅ Successfully exported ${data.exportedCount} questions to ${data.filePath}!`,
        });

        // Reload data to update stats
        loadSeedData();
      } else {
        console.error("❌ Export failed:", data);
        setMessage({
          type: "error",
          text: `❌ Export failed: ${data.error || "Unknown error occurred"}`,
        });
      }
    } catch (error: any) {
      console.error("Export error:", error);
      setMessage({
        type: "error",
        text: `❌ Export error: ${
          error.message || "Failed to export questions"
        }`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const updateConfig = (field: keyof GenerationConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading AI Generator..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Brain className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Question Generator
                </h1>
              </div>
              <p className="text-gray-600">
                Generate high-quality MCQ questions using AI for your interview
                platform
              </p>
            </div>
            <Button
              onClick={loadSeedData}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : message.type === "warning"
                ? "bg-yellow-50 text-yellow-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <Zap className="w-4 h-4 mr-2" />
              ) : message.type === "warning" ? (
                <AlertCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              <div className="whitespace-pre-line">{message.text}</div>
            </div>
          </div>
        )}

        {/* Selected Language Stats */}
        {selectedLanguageStats && (
          <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {config.language} - Database Statistics
              </h3>
              <div className="text-sm text-gray-600 font-medium">
                Total: {selectedLanguageStats.totalQuestions} questions
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-800 mb-1">
                  {selectedLanguageStats.totalInDB}
                </div>
                <div className="text-sm text-blue-900 font-medium">
                  In Database
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-800 mb-1">
                  {selectedLanguageStats.beginner}
                </div>
                <div className="text-sm text-green-900 font-medium">
                  Beginner
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-800 mb-1">
                  {selectedLanguageStats.intermediate}
                </div>
                <div className="text-sm text-yellow-900 font-medium">
                  Intermediate
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-800 mb-1">
                  {selectedLanguageStats.advanced}
                </div>
                <div className="text-sm text-red-900 font-medium">Advanced</div>
              </div>
            </div>
            {/* Debug info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <div className="font-medium mb-1">Debug Info:</div>
              <div>Concepts: {selectedLanguageStats.concepts.length}</div>
              <div>Topics: {selectedLanguageStats.topics.length}</div>
              <div>
                Total by difficulty:{" "}
                {selectedLanguageStats.beginner +
                  selectedLanguageStats.intermediate +
                  selectedLanguageStats.advanced}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="font-medium">Difficulty Breakdown:</div>
                <div>Beginner: {selectedLanguageStats.beginner}</div>
                <div>Intermediate: {selectedLanguageStats.intermediate}</div>
                <div>Advanced: {selectedLanguageStats.advanced}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Generation Settings
              </h2>

              <div className="space-y-3">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Programming Language
                  </label>
                  <select
                    value={config.language}
                    onChange={(e) => updateConfig("language", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Language</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <select
                    value={config.topic}
                    onChange={(e) => updateConfig("topic", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={
                      !config.language || !availableTopics[config.language]
                    }
                  >
                    <option value="">Select Topic</option>
                    {/* Using index in key to handle potential duplicate topic names */}
                    {availableTopics[config.language]?.map((topic, index) => (
                      <option key={`${topic}-${index}`} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <div className="space-y-1">
                    {difficulties.map((diff) => (
                      <label key={diff.value} className="flex items-center">
                        <input
                          type="radio"
                          name="difficulty"
                          value={diff.value}
                          checked={config.difficulty === diff.value}
                          onChange={(e) =>
                            updateConfig("difficulty", e.target.value)
                          }
                          className="mr-2"
                        />
                        <span className={diff.color}>{diff.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={config.count || 10}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      updateConfig(
                        "count",
                        isNaN(value) ? 10 : Math.max(1, Math.min(50, value))
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <input
                      type="checkbox"
                      checked={config.includeExplanation}
                      onChange={(e) =>
                        updateConfig("includeExplanation", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Include Explanations
                  </label>
                  <label className="flex items-center text-gray-700 font-medium">
                    <input
                      type="checkbox"
                      checked={config.includeTags}
                      onChange={(e) =>
                        updateConfig("includeTags", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Include Tags
                  </label>
                  <label className="flex items-center text-gray-700 font-medium">
                    <input
                      type="checkbox"
                      checked={config.includeCompanies}
                      onChange={(e) =>
                        updateConfig("includeCompanies", e.target.checked)
                      }
                      className="mr-2"
                    />
                    Include Company Tags
                  </label>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateQuestions}
                  disabled={isGenerating || !config.language || !config.topic}
                  className="w-full flex items-center justify-center"
                >
                  {isGenerating ? (
                    <Loading size="sm" />
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Generated Questions */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              {/* Current Config Stats */}
              {selectedLanguageStats && config.language && config.topic && (
                <div className="mb-4 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800 mb-1">
                      {(() => {
                        const difficultyKey = config.difficulty as keyof typeof selectedLanguageStats;
                        const count = selectedLanguageStats[difficultyKey] || 0;
                        console.log('Generation Config Stats Debug:', {
                          configDifficulty: config.difficulty,
                          difficultyKey,
                          selectedLanguageStats,
                          count
                        });
                        return count;
                      })()}
                    </div>
                    <div className="text-sm text-gray-800 font-medium mb-2">
                      {config.difficulty} questions available
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                        <span className="text-blue-800 font-medium">
                          {config.language}
                        </span>
                      </div>
                      <div className="text-gray-500">•</div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mr-1"></div>
                        <span className="text-purple-800 font-medium">
                          {config.topic}
                        </span>
                      </div>
                      <div className="text-gray-500">•</div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-rose-600 rounded-full mr-1"></div>
                        <span className="text-rose-800 font-medium capitalize">
                          {config.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Generated Questions ({generatedQuestions.length})
                </h2>
                {generatedQuestions.length > 0 && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={saveToDatabase}
                      disabled={generatedQuestions.length === 0 || isSaving}
                      variant="outline"
                      size="sm"
                    >
                      {isSaving ? (
                        <>
                          <Loading size="sm" />
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4 mr-2" />
                          Save to DB
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={exportToSeeds}
                      disabled={generatedQuestions.length === 0 || isExporting}
                      variant="outline"
                      size="sm"
                    >
                      {isExporting ? (
                        <>
                          <Loading size="sm" />
                          <span className="ml-2">Exporting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export to Seeds
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {generatedQuestions.length === 0 ? (
                <div className="text-center py-6">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    No Questions Generated
                  </h3>
                  <p className="text-sm text-gray-700">
                    Configure your settings and click "Generate Questions" to
                    create new MCQs
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {generatedQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-3 bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          Question {index + 1}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            question.difficulty === "beginner"
                              ? "bg-green-100 text-green-800"
                              : question.difficulty === "intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2 text-sm font-medium">
                        {question.question}
                      </p>
                      <div className="space-y-1 mb-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-xs ${
                              option === question.correctAnswer
                                ? "text-green-800 font-semibold"
                                : "text-gray-800"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="text-xs text-gray-700 mb-2 bg-gray-50 p-2 rounded">
                          <strong className="text-gray-800">
                            Explanation:
                          </strong>{" "}
                          {question.explanation}
                        </div>
                      )}
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {question.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

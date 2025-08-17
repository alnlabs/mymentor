"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Loading } from "@/shared/components/Loading";
import {
  Database,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Upload,
  RefreshCw,
  Brain,
} from "lucide-react";

interface SeedFile {
  file: string;
  category: string;
  language: string;
  concepts: Array<{
    name: string;
    difficulty: string;
    questionCount: number;
    type: string;
    inDatabase: boolean;
    questionsInDB: number;
    problemsInDB: number;
  }>;
  totalQuestions: number;
  inDatabaseCount: number;
}

export default function SeedsManagementPage() {
  const {
    user,
    loading: authLoading,
    isAdmin,
    isSuperAdmin,
  } = useAuthContext();
  const [seeds, setSeeds] = useState<SeedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeeds, setSelectedSeeds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Section filter states - one for each language
  const [sectionFilters, setSectionFilters] = useState<{
    [key: string]: {
      status: string;
      search: string;
    };
  }>({});

  useEffect(() => {
    if (!authLoading && (isAdmin || isSuperAdmin)) {
      loadSeeds();
    }
  }, [authLoading, isAdmin, isSuperAdmin]);

  // Helper function to get filter for a specific section
  const getSectionFilter = (language: string) => {
    return sectionFilters[language] || { status: "all", search: "" };
  };

  // Helper function to set filter for a specific section
  const setSectionFilter = (
    language: string,
    filterType: "status" | "search",
    value: string
  ) => {
    setSectionFilters((prev) => ({
      ...prev,
      [language]: {
        ...getSectionFilter(language),
        [filterType]: value,
      },
    }));
  };

  // Filter concepts within a section
  const getFilteredConcepts = (seed: SeedFile) => {
    const filter = getSectionFilter(seed.language);

    return seed.concepts.filter((concept) => {
      // Status filter
      if (filter.status !== "all") {
        const hasQuestions =
          concept.questionsInDB > 0 || concept.problemsInDB > 0;
        const hasContent = concept.questionCount > 0;

        if (filter.status === "in-database" && !hasQuestions) return false;
        if (filter.status === "available" && (hasQuestions || !hasContent))
          return false;
        if (filter.status === "no-questions" && hasContent) return false;
      }

      // Search filter
      if (filter.search.trim()) {
        const searchLower = filter.search.toLowerCase();
        if (!concept.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  };

  const loadSeeds = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/seeds");
      const data = await response.json();
      if (data.success) {
        setSeeds(data.data);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to load seeds",
        });
      }
    } catch (error) {
      console.error("Error loading seeds:", error);
      setMessage({ type: "error", text: "Failed to load seeds" });
    } finally {
      setLoading(false);
    }
  };

  const addSeedsToDatabase = async (concepts: string[]) => {
    try {
      setActionLoading(true);

      const response = await fetch("/api/admin/seeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ concepts }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: data.data.message });
        loadSeeds(); // Refresh the list
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add seeds" });
    } finally {
      setActionLoading(false);
    }
  };

  const removeSeedsFromDatabase = async (language: string) => {
    if (
      !confirm(
        `Are you sure you want to remove all ${language} questions from the database?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      // Get all categories for this language from the current seeds data
      const languageSeed = seeds.find((seed) => seed.language === language);
      if (!languageSeed) {
        setMessage({ type: "error", text: "Language not found" });
        return;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Delete from all categories for this language
      const categories = languageSeed.category.split(", ");
      let totalDeleted = 0;

      for (const category of categories) {
        const response = await fetch(
          `/api/admin/seeds?category=${category.trim()}`,
          {
            method: "DELETE",
            headers,
          }
        );
        const data = await response.json();
        if (data.success) {
          totalDeleted += data.data.deletedCount;
        }
      }

      setMessage({
        type: "success",
        text: `Removed ${totalDeleted} items from ${language} database`,
      });
      loadSeeds(); // Refresh the list
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove seeds" });
    } finally {
      setActionLoading(false);
    }
  };

  const addAllFromCategory = (seedFile: SeedFile) => {
    const availableConcepts = seedFile.concepts
      .filter(
        (concept) =>
          concept.questionCount > 0 &&
          !(concept.questionsInDB > 0 || concept.problemsInDB > 0)
      )
      .map((c) => c.name);
    console.log(availableConcepts, "availableConcepts");
    addSeedsToDatabase(availableConcepts);
  };

  const addSelectedConcepts = () => {
    if (selectedSeeds.length === 0) {
      setMessage({ type: "error", text: "Please select concepts to add" });
      return;
    }
    // Extract concept names from the unique keys (remove language prefix)
    const conceptNames = selectedSeeds.map((key) =>
      key.split("-").slice(1).join("-")
    );
    addSeedsToDatabase(conceptNames);
    setSelectedSeeds([]);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect non-admin users
  if (!authLoading && !isAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You need admin privileges to access this page.
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading Seeds..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Database className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Seed Management
                </h1>
              </div>
              <p className="text-gray-600">
                Add or remove question seeds from the database
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() =>
                  (window.location.href = "/admin/seeds/ai-generator")
                }
                className="flex items-center"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Generator
              </Button>
              <Button
                onClick={loadSeeds}
                variant="outline"
                disabled={actionLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {selectedSeeds.length > 0 && (
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {selectedSeeds.length} concepts selected
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={addSelectedConcepts}
                  disabled={actionLoading}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Selected ({selectedSeeds.length})
                </Button>
                <Button
                  onClick={() => setSelectedSeeds([])}
                  variant="outline"
                  size="sm"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Seeds List */}
        <div className="space-y-6">
          {loading ? (
            <Card className="p-8 text-center">
              <Loading size="lg" />
              <p className="text-gray-600">Loading seeds...</p>
            </Card>
          ) : seeds.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No seeds found
                </h3>
                <p className="text-gray-600 mb-4">
                  No seed files found in the data/seeds directory.
                </p>
                <Button onClick={loadSeeds} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </Card>
          ) : (
            seeds.map((seed) => {
              const filteredConcepts = getFilteredConcepts(seed);
              const sectionFilter = getSectionFilter(seed.language);

              return (
                <Card key={seed.language} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {seed.language}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Categories: {seed.category}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          Total: {seed.totalQuestions} questions
                        </span>
                        <span className="text-gray-600">
                          In DB: {seed.inDatabaseCount} questions
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            seed.inDatabaseCount === 0
                              ? "bg-gray-100 text-gray-800"
                              : seed.inDatabaseCount === seed.totalQuestions
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {seed.inDatabaseCount === 0
                            ? "Not Added"
                            : seed.inDatabaseCount === seed.totalQuestions
                            ? "Complete"
                            : "Partial"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {(() => {
                        const availableConcepts = seed.concepts.filter(
                          (concept) =>
                            concept.questionCount > 0 &&
                            !(
                              concept.questionsInDB > 0 ||
                              concept.problemsInDB > 0
                            )
                        );
                        // Only show Add All button when filter is set to "available"
                        return availableConcepts.length > 0 &&
                          sectionFilter.status === "available" ? (
                          <Button
                            onClick={() => addAllFromCategory(seed)}
                            disabled={actionLoading}
                            size="sm"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Add All Available ({availableConcepts.length})
                          </Button>
                        ) : null;
                      })()}
                      {seed.inDatabaseCount > 0 && (
                        <Button
                          onClick={() => removeSeedsFromDatabase(seed.language)}
                          disabled={actionLoading}
                          variant="danger"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove All
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Section Filters */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={sectionFilter.status}
                          onChange={(e) =>
                            setSectionFilter(
                              seed.language,
                              "status",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Status</option>
                          <option value="in-database">In Database</option>
                          <option value="available">Available</option>
                          <option value="no-questions">No Questions</option>
                        </select>
                      </div>

                      {/* Search Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Search Concepts
                        </label>
                        <input
                          type="text"
                          value={sectionFilter.search}
                          onChange={(e) =>
                            setSectionFilter(
                              seed.language,
                              "search",
                              e.target.value
                            )
                          }
                          placeholder="Search concepts..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Clear Filters */}
                      <div className="flex items-end">
                        <Button
                          onClick={() => {
                            setSectionFilter(seed.language, "status", "all");
                            setSectionFilter(seed.language, "search", "");
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>

                    {/* Filter Summary */}
                    {filteredConcepts.length !== seed.concepts.length && (
                      <div className="mt-2 text-xs text-gray-600">
                        Showing {filteredConcepts.length} of{" "}
                        {seed.concepts.length} concepts
                      </div>
                    )}
                  </div>

                  {/* Concepts */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        Concepts
                      </h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>In Database</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 text-yellow-600" />
                          <span>Available</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>No Questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredConcepts.length === 0 ? (
                        <div className="col-span-full p-4 text-center text-gray-500">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">
                            No concepts match the current filters
                          </p>
                        </div>
                      ) : (
                        filteredConcepts.map((concept) => (
                          <div
                            key={`${seed.language}-${concept.name}`}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              concept.questionCount > 0
                                ? concept.questionsInDB > 0 ||
                                  concept.problemsInDB > 0
                                  ? "border-green-200 bg-green-50"
                                  : "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
                                : "border-red-200 bg-red-50 opacity-60"
                            } ${
                              selectedSeeds.includes(
                                `${seed.language}-${concept.name}`
                              )
                                ? "border-blue-300 bg-blue-50"
                                : ""
                            }`}
                            onClick={() => {
                              if (
                                concept.questionCount > 0 &&
                                !(
                                  concept.questionsInDB > 0 ||
                                  concept.problemsInDB > 0
                                )
                              ) {
                                const uniqueKey = `${seed.language}-${concept.name}`;
                                setSelectedSeeds((prev) =>
                                  prev.includes(uniqueKey)
                                    ? prev.filter((s) => s !== uniqueKey)
                                    : [...prev, uniqueKey]
                                );
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {concept.name}
                              </span>
                              {concept.questionCount > 0 ? (
                                concept.questionsInDB > 0 ||
                                concept.problemsInDB > 0 ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                )
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="capitalize">
                                {concept.difficulty}
                              </span>
                              <span
                                className={`font-medium ${
                                  concept.questionCount === 0
                                    ? "text-red-600"
                                    : concept.questionsInDB > 0 ||
                                      concept.problemsInDB > 0
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {concept.questionCount === 0
                                  ? "No questions"
                                  : concept.questionsInDB > 0
                                  ? `${concept.questionsInDB}/${concept.questionCount} questions`
                                  : concept.problemsInDB > 0
                                  ? `${concept.problemsInDB}/${concept.questionCount} problems`
                                  : `${concept.questionCount} ${concept.type}s available`}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {seeds.length === 0 && (
          <Card className="p-8 text-center">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Seeds Found
            </h3>
            <p className="text-gray-600 mb-4">
              No seed files found in the data/seeds directory.
            </p>
            <Button onClick={loadSeeds} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

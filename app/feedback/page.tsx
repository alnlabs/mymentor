"use client";

import React, { useState } from "react";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  MessageSquare,
  Send,
  Eye,
  EyeOff,
  Star,
  CheckCircle,
  AlertCircle,
  LogOut,
  Home,
  Code,
  BookOpen,
  Target as TargetIcon,
  BarChart3,
  Settings,
} from "lucide-react";

interface FeedbackForm {
  isAnonymous: boolean;
  type: string;
  category: string;
  subject: string;
  message: string;
  rating: number | null;
}

export default function FeedbackPage() {
  const { user, loading, isAdmin, isSuperAdmin, signOutUser } =
    useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<FeedbackForm>({
    isAnonymous: false,
    type: "",
    category: "",
    subject: "",
    message: "",
    rating: null,
  });

  const feedbackTypes = [
    { value: "general", label: "General Feedback", icon: "💬" },
    { value: "bug", label: "Bug Report", icon: "🐛" },
    { value: "feature", label: "Feature Request", icon: "✨" },
    { value: "suggestion", label: "Suggestion", icon: "💡" },
    { value: "complaint", label: "Complaint", icon: "😞" },
    { value: "praise", label: "Praise", icon: "👏" },
  ];

  const feedbackCategories = [
    { value: "platform", label: "Platform Experience" },
    { value: "content", label: "Content Quality" },
    { value: "interface", label: "User Interface" },
    { value: "performance", label: "Performance" },
    { value: "mobile", label: "Mobile Experience" },
    { value: "other", label: "Other" },
  ];

  const updateFeedback = (field: keyof FeedbackForm, value: any) => {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !feedback.type ||
      !feedback.category ||
      !feedback.subject ||
      !feedback.message
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedback),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFeedback({
          isAnonymous: false,
          type: "",
          category: "",
          subject: "",
          message: "",
          rating: null,
        });
      } else {
        setError(
          result.error || "Failed to submit feedback. Please try again."
        );
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Feedback
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6">
                  <a
                    href="/dashboard"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                  <a
                    href="/problems"
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    <span>Problems</span>
                  </a>
                  <a
                    href="/mcq"
                    className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>MCQs</span>
                  </a>
                  <a
                    href="/interviews"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <TargetIcon className="w-4 h-4" />
                    <span>Interviews</span>
                  </a>
                </nav>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {isSuperAdmin
                        ? "S"
                        : user?.displayName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium hidden sm:block">
                    {isSuperAdmin
                      ? "SuperAdmin"
                      : user?.displayName || user?.email || "User"}
                  </span>
                </div>

                {/* Sign Out Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOutUser}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <div className="text-green-600">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Your feedback has been submitted successfully. We appreciate you
                taking the time to help us improve!
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {feedback.isAnonymous
                    ? "Your feedback was submitted anonymously."
                    : "We'll review your feedback and get back to you if needed."}
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Submit Another Feedback</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Feedback
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
                <a
                  href="/problems"
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  <span>Problems</span>
                </a>
                <a
                  href="/mcq"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>MCQs</span>
                </a>
                <a
                  href="/interviews"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <TargetIcon className="w-4 h-4" />
                  <span>Interviews</span>
                </a>
              </nav>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {isSuperAdmin
                      ? "S"
                      : user?.displayName?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        "U"}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block">
                  {isSuperAdmin
                    ? "SuperAdmin"
                    : user?.displayName || user?.email || "User"}
                </span>
              </div>

              {/* Sign Out Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={signOutUser}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Share Your Feedback
          </h2>
          <p className="text-gray-600 text-lg">
            Help us improve your learning experience! Your feedback is valuable
            to us.
          </p>
        </div>

        {/* Feedback Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {feedback.isAnonymous ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    Submit Anonymously
                  </h3>
                  <p className="text-sm text-gray-500">
                    {feedback.isAnonymous
                      ? "Your feedback will be submitted without your name (we still collect user details for internal reference)"
                      : "Your name will be visible to administrators"}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={feedback.isAnonymous}
                  onChange={(e) =>
                    updateFeedback("isAnonymous", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Feedback Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {feedbackTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      feedback.type === type.value
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={feedback.type === type.value}
                      onChange={(e) => updateFeedback("type", e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Feedback Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={feedback.category}
                onChange={(e) => updateFeedback("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {feedbackCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={feedback.subject}
                onChange={(e) => updateFeedback("subject", e.target.value)}
                placeholder="Brief description of your feedback"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating (Optional)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateFeedback("rating", star)}
                    className={`p-1 rounded transition-colors ${
                      feedback.rating && feedback.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                {feedback.rating && (
                  <span className="text-sm text-gray-500 ml-2">
                    {feedback.rating} out of 5
                  </span>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Message *
              </label>
              <textarea
                value={feedback.message}
                onChange={(e) => updateFeedback("message", e.target.value)}
                rows={6}
                placeholder="Please share your detailed feedback, suggestions, or concerns. Be as specific as possible to help us understand and address your needs."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Feel free to share any opinions, suggestions, or concerns. Your
                feedback helps us improve!
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2"
              >
                {submitting ? (
                  <Loading size="sm" text="Submitting..." />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Secret:</strong> We always collect user details in the
            background for internal reference, even when submitted anonymously.
            This helps us provide better support and track feedback patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

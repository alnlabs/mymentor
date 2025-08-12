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

              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Share Your Feedback
          </h2>
                    <p className="text-gray-600 text-lg">
            Help us improve your learning experience! Your feedback is valuable
            to us.
          </p>
        </div>

                {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Feedback Form - Left Side */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Anonymous Toggle - HIGHLIGHTED */}
                <div
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    feedback.isAnonymous
                      ? "bg-purple-50 border-purple-200 shadow-lg"
                      : "bg-blue-50 border-blue-200 shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          feedback.isAnonymous
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {feedback.isAnonymous ? (
                          <EyeOff className="w-6 h-6" />
                        ) : (
                          <Eye className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3
                            className={`text-lg font-bold ${
                              feedback.isAnonymous
                                ? "text-purple-800"
                                : "text-blue-800"
                            }`}
                          >
                            {feedback.isAnonymous
                              ? "🔒 ANONYMOUS MODE"
                              : "👤 NAMED MODE"}
                          </h3>
                          {feedback.isAnonymous && (
                            <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-bold rounded-full">
                              PRIVATE
                            </span>
                          )}
                        </div>
                         <p
                           className={`text-sm font-medium ${
                             feedback.isAnonymous
                               ? "text-purple-700"
                               : "text-blue-700"
                           }`}
                         >
                           {feedback.isAnonymous
                             ? "✅ Your feedback will be submitted WITHOUT your name - completely anonymous!"
                             : "📝 Your name will be visible to administrators for better support"}
                         </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feedback.isAnonymous}
                          onChange={(e) =>
                            updateFeedback("isAnonymous", e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all ${
                            feedback.isAnonymous
                              ? "peer-checked:bg-purple-600"
                              : "peer-checked:bg-blue-600"
                          }`}
                        ></div>
                      </label>
                      <span
                        className={`text-xs font-bold ${
                          feedback.isAnonymous ? "text-purple-600" : "text-blue-600"
                        }`}
                      >
                        {feedback.isAnonymous ? "ON" : "OFF"}
                      </span>
                    </div>
                  </div>
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
          </div>

          {/* Right Sidebar - Compact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* What is Feedback - Compact */}
              <Card className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                  💡 What is Feedback?
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <p>
                    Your honest opinion about our platform, content, and learning experience.
                  </p>
                  <p><strong>Examples:</strong></p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-xs">
                    <li>"Problems too difficult"</li>
                    <li>"Love interview practice!"</li>
                    <li>"App crashes on mobile"</li>
                    <li>"Need more JavaScript"</li>
                  </ul>
                </div>
              </Card>

              {/* How Your Feedback Helps - Compact */}
              <Card className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                  🎯 How It Helps
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="space-y-1">
                    <div className="flex items-start space-x-1">
                      <span className="text-green-600 font-bold text-xs">✓</span>
                      <span>Add new features</span>
                    </div>
                    <div className="flex items-start space-x-1">
                      <span className="text-green-600 font-bold text-xs">✓</span>
                      <span>Fix bugs & issues</span>
                    </div>
                    <div className="flex items-start space-x-1">
                      <span className="text-green-600 font-bold text-xs">✓</span>
                      <span>Improve content</span>
                    </div>
                    <div className="flex items-start space-x-1">
                      <span className="text-green-600 font-bold text-xs">✓</span>
                      <span>Enhance UI/UX</span>
                    </div>
                  </div>
                  <p className="text-blue-700 font-medium text-xs">
                    <strong>Your voice shapes the platform!</strong>
                  </p>
                </div>
              </Card>

              {/* Anonymous Mode - Compact */}
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                  🔒 Anonymous Mode
                </h3>
                <div className="space-y-2 text-xs text-gray-700">
                  <p>
                    Share feedback without revealing your identity.
                  </p>
                  <div className="bg-white p-2 rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800 text-xs mb-1">✅ Anonymous Benefits:</h4>
                    <ul className="space-y-0.5 text-xs">
                      <li>• Share without fear</li>
                      <li>• Express concerns freely</li>
                      <li>• Report issues safely</li>
                    </ul>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 text-xs mb-1">📝 Named Benefits:</h4>
                    <ul className="space-y-0.5 text-xs">
                      <li>• Get follow-up support</li>
                      <li>• Track feedback status</li>
                      <li>• Build relationships</li>
                    </ul>
                  </div>
                  <p className="text-purple-700 font-medium text-xs">
                    <strong>Choose what's comfortable!</strong>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Share Freely:</strong> Your honest feedback helps us
            improve. Choose anonymous mode to share without any concerns about
            privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

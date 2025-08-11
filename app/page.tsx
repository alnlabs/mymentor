"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { AuthButton } from "@/shared/components/AuthButton";
import { SuperAdminLogin } from "@/shared/components/SuperAdminLogin";
import { useAuthContext } from "@/shared/components/AuthContext";

import { ProblemCard } from "@/modules/problems/components/ProblemCard";
import { MCQCard } from "@/modules/mcq/components/MCQCard";
import { Problem, MCQQuestion } from "@/shared/types/common";

export default function HomePage() {
  const { user, userRole, isAdmin, isSuperAdmin, loading: authLoading } = useAuthContext();
  const [activeTab, setActiveTab] = useState<"problems" | "mcq" | "interviews">(
    "problems"
  );
  const [problems, setProblems] = useState<Problem[]>([]);
  const [mcqQuestions, setMCQQuestions] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuperAdminLogin, setShowSuperAdminLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && (user || isSuperAdmin)) {
      console.log("Homepage: User authenticated, redirecting to dashboard");
      window.location.href = '/dashboard';
    }
  }, [user, isSuperAdmin, authLoading]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [problemsRes, mcqRes] = await Promise.all([
        fetch("/api/problems"),
        fetch("/api/mcq"),
      ]);

      const problemsData = await problemsRes.json();
      const mcqData = await mcqRes.json();

      if (problemsData.success) setProblems(problemsData.data);
      if (mcqData.success) setMCQQuestions(mcqData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    window.location.href = `/problems/${problem.id}`;
  };

  const handleMCQSelect = (question: MCQQuestion) => {
    window.location.href = `/mcq/${question.id}`;
  };

  const handleSuperAdminSuccess = (superAdminUser: any) => {
    localStorage.setItem("superAdminUser", JSON.stringify(superAdminUser));
    setShowSuperAdminLogin(false);
    window.location.reload();
  };

  const handleSignOut = () => {
    localStorage.removeItem("superAdminUser");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading MyMentor..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MyMentor
              </h1>
            </div>

            {/* Navigation Menu */}
            {(user || isSuperAdmin) && (
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </a>
                {(isAdmin || isSuperAdmin) && (
                  <a
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>⚙️</span>
                    <span>Admin Panel</span>
                  </a>
                )}
              </nav>
            )}

            {/* Mobile menu button */}
            {(user || isSuperAdmin) && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <div className="flex items-center space-x-4">
              {user || isSuperAdmin ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {isSuperAdmin ? "S" : user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {isSuperAdmin ? "SuperAdmin" : user?.name || "User"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (window.location.href = "/admin")}
                    >
                      Admin Panel
                    </Button>
                  )}
                  {!isSuperAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSuperAdminLogin(true)}
                    >
                      Switch to SuperAdmin
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <AuthButton />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (user || isSuperAdmin) && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              {(isAdmin || isSuperAdmin) && (
                <a
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>⚙️</span>
                  <span>Admin Panel</span>
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-white font-bold text-3xl">M</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Master Technical
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Interviews
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Your personal AI-powered mentor for technical interview
              preparation. Practice coding problems, solve MCQs, and track your
              progress with
              <span className="font-semibold text-blue-600"> MyMentor</span>.
            </p>
            {!user && !isSuperAdmin ? (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/login")}
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  �� Get Started Free
                </Button>
                <AuthButton
                  size="lg"
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  size="lg"
                  onClick={() => setActiveTab("problems")}
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  💻 Start Coding
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setActiveTab("mcq")}
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ❓ Take MCQ Quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MyMentor?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive interview preparation platform designed for modern
              tech professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Coding Problems
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Practice with real-world coding challenges from top tech
                companies. Get instant feedback and detailed solutions.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">❓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                MCQ Questions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Test your knowledge with carefully curated multiple-choice
                questions covering all major technical concepts.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Progress Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your performance with detailed analytics. Track
                improvement over time and identify weak areas.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Company Specific
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Practice problems specifically designed for your target
                companies. Get familiar with their interview patterns.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Real-time Feedback
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant feedback on your solutions. Learn from detailed
                explanations and optimize your approach.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Mock Interviews
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Practice with realistic interview scenarios. Take timed mock
                interviews with questions from top tech companies.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is secure and private. Practice with confidence
                knowing your progress is protected.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of developers who have improved their interview
              skills with MyMentor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Coding Problems</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-100">MCQ Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section for Logged-in Users */}
      {(user || isSuperAdmin) && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg mb-12 max-w-3xl mx-auto">
              <button
                onClick={() => setActiveTab("problems")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === "problems"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                💻 Coding Problems ({problems.length})
              </button>
              <button
                onClick={() => setActiveTab("mcq")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === "mcq"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                ❓ MCQ Questions ({mcqQuestions.length})
              </button>
              <button
                onClick={() => setActiveTab("interviews")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === "interviews"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                🎯 Mock Interviews
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeTab === "problems" ? (
                problems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    onSelect={handleProblemSelect}
                  />
                ))
              ) : activeTab === "mcq" ? (
                mcqQuestions.map((question) => (
                  <MCQCard
                    key={question.id}
                    question={question}
                    onSelect={handleMCQSelect}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-white text-2xl">🎯</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Mock Interviews
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Practice with realistic interview scenarios. Take timed
                      mock interviews with questions from top tech companies.
                    </p>
                    <Button
                      onClick={() =>
                        (window.location.href = "/admin/interviews")
                      }
                      className="w-full"
                    >
                      Manage Mock Interviews
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section for Non-logged Users */}
      {!user && !isSuperAdmin && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="p-12 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">🚀</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Ace Your Interviews?
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join thousands of developers who have improved their interview
                  skills and landed their dream jobs with MyMentor.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/login")}
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🚀 Start Your Journey
                </Button>
                <AuthButton
                  size="lg"
                  className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>

              <div className="mt-8 text-sm text-gray-500">
                No credit card required • Free forever • Start practicing in
                seconds
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-xl font-bold">MyMentor</span>
              </div>
              <p className="text-gray-400">
                Your personal AI-powered mentor for technical interview
                preparation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Coding Problems
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    MCQ Questions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Progress Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 MyMentor. All rights reserved. Built with ❤️ for
              developers.
            </p>
          </div>
        </div>
      </footer>

      {/* SuperAdmin Login Modal */}
      {showSuperAdminLogin && (
        <SuperAdminLogin
          onSuccess={handleSuperAdminSuccess}
          onCancel={() => setShowSuperAdminLogin(false)}
        />
      )}
    </div>
  );
}

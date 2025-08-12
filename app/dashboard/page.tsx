"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  BookOpen,
  Code,
  Target,
  Users,
  Settings,
  BarChart3,
  LogOut,
  TrendingUp,
  Clock,
  Award,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Trophy,
  Zap,
  Play,
  Bookmark,
  Eye,
  ArrowRight,
  Plus,
  Target as TargetIcon,
  Home,
} from "lucide-react";

interface UserStats {
  problemsSolved: number;
  mcqCompleted: number;
  interviewsTaken: number;
  totalSubmissions: number;
  successRate: number;
  recentActivity: Array<{
    id: string;
    problemTitle: string;
    status: string;
    score: number;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const { user, loading, isAdmin, isSuperAdmin, signOutUser } =
    useAuthContext();
  const [userStats, setUserStats] = useState<UserStats>({
    problemsSolved: 0,
    mcqCompleted: 0,
    interviewsTaken: 0,
    totalSubmissions: 0,
    successRate: 0,
    recentActivity: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch user statistics
  React.useEffect(() => {
    if (user && !isSuperAdmin) {
      fetchUserStats();
    } else if (isSuperAdmin) {
      setStatsLoading(false);
    }
  }, [user, isSuperAdmin]);

  // Redirect to homepage if not authenticated (with delay to prevent immediate redirects)
  React.useEffect(() => {
    if (!loading && !user && !isSuperAdmin) {
      console.log("Dashboard: User not authenticated, redirecting to homepage");
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 1000); // 1 second delay
      return () => clearTimeout(timer);
    }
  }, [user, loading, isSuperAdmin]);

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/user/stats", {
        headers: {
          "x-user-id": user?.uid || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserStats(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Dashboard..." />
      </div>
    );
  }

  // Show loading while redirecting
  if (!user && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Redirecting to homepage..." />
      </div>
    );
  }

  const dashboardItems = [
    {
              title: "Interviews",
      description: "Practice with realistic interview scenarios",
      icon: Target,
      href: "/admin/interviews",
      color: "bg-blue-500",
      adminOnly: true,
    },
    {
      title: "Coding Problems",
      description: "Solve algorithmic and coding challenges",
      icon: Code,
      href: "/problems",
      color: "bg-green-500",
    },
    {
      title: "MCQ Questions",
      description: "Test your knowledge with multiple choice questions",
      icon: BookOpen,
      href: "/mcq",
      color: "bg-purple-500",
    },
    {
      title: "User Management",
      description: "Manage users and their roles",
      icon: Users,
      href: "/admin/users",
      color: "bg-orange-500",
      adminOnly: true,
    },
    {
      title: "Analytics",
      description: "View performance metrics and insights",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-red-500",
      adminOnly: true,
    },
    {
      title: "Settings",
      description: "Configure your account and preferences",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
      adminOnly: true,
    },
  ];

  const filteredItems = dashboardItems.filter(
    (item) => !item.adminOnly || isAdmin || isSuperAdmin
  );

  const getLevel = (problemsSolved: number) => {
    if (problemsSolved >= 50)
      return { level: "Expert", color: "text-purple-600", bg: "bg-purple-100" };
    if (problemsSolved >= 25)
      return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-100" };
    if (problemsSolved >= 10)
      return {
        level: "Intermediate",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (problemsSolved >= 5)
      return {
        level: "Beginner",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return { level: "Newbie", color: "text-gray-600", bg: "bg-gray-100" };
  };

  const level = getLevel(userStats.problemsSolved);

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
                MyMentor Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Home
                </a>
                <a
                  href="/problems"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Problems
                </a>
                <a
                  href="/mcq"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  MCQs
                </a>
                {(isAdmin || isSuperAdmin) && (
                  <a
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Admin
                  </a>
                )}
              </nav>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
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

        {/* Mobile Navigation Menu */}
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2">
            <div className="grid grid-cols-4 gap-2">
              <a
                href="/"
                className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md text-xs"
              >
                <Home className="w-4 h-4 mb-1" />
                Home
              </a>
              <a
                href="/problems"
                className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md text-xs"
              >
                <Code className="w-4 h-4 mb-1" />
                Problems
              </a>
              <a
                href="/mcq"
                className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md text-xs"
              >
                <BookOpen className="w-4 h-4 mb-1" />
                MCQs
              </a>
              {(isAdmin || isSuperAdmin) && (
                <a
                  href="/admin"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md text-xs"
                >
                  <Settings className="w-4 h-4 mb-1" />
                  Admin
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back,{" "}
                    {isSuperAdmin
                      ? "SuperAdmin"
                      : user?.displayName || user?.email || "User"}
                    ! 👋
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Ready to level up your coding skills?
                  </p>
                </div>
                {!isSuperAdmin && (
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${level.bg} ${level.color}`}
                    >
                      <Trophy className="w-4 h-4 mr-1" />
                      {level.level}
                    </div>
                    <p className="text-blue-100 text-sm mt-1">
                      {userStats.problemsSolved} problems solved
                    </p>
                  </div>
                )}
              </div>

              {!isSuperAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {userStats.problemsSolved}
                    </div>
                    <div className="text-blue-100 text-sm">Problems</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {userStats.mcqCompleted}
                    </div>
                    <div className="text-blue-100 text-sm">MCQs</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {userStats.interviewsTaken}
                    </div>
                    <div className="text-blue-100 text-sm">Interviews</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">
                      {userStats.successRate}%
                    </div>
                    <div className="text-blue-100 text-sm">Success Rate</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            Quick Start
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-green-200">
              <div
                className="p-6 text-center"
                onClick={() => (window.location.href = "/problems")}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Start Coding
                </h3>
                <p className="text-gray-600 mb-4">
                  Solve algorithmic challenges and improve your problem-solving
                  skills
                </p>
                <Button className="w-full group-hover:bg-green-600 transition-colors">
                  <Play className="w-4 h-4 mr-2" />
                  Begin Practice
                </Button>
              </div>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-purple-200">
              <div
                className="p-6 text-center"
                onClick={() => (window.location.href = "/mcq")}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Take MCQ Test
                </h3>
                <p className="text-gray-600 mb-4">
                  Test your knowledge with multiple choice questions
                </p>
                <Button className="w-full group-hover:bg-purple-600 transition-colors">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </Card>

            {(isAdmin || isSuperAdmin) && (
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-200">
                <div
                  className="p-6 text-center"
                  onClick={() => (window.location.href = "/admin/interviews")}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Interview
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Practice with realistic interview scenarios
                  </p>
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    <Eye className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            All Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-gray-200"
                onClick={() => (window.location.href = item.href)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl ${item.color} text-white group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {!isSuperAdmin && userStats.recentActivity.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <Card className="p-6">
              <div className="space-y-4">
                {userStats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {activity.status === "accepted" ? (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      ) : activity.status === "rejected" ? (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {activity.problemTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          activity.status === "accepted"
                            ? "text-green-600"
                            : activity.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {activity.status.charAt(0).toUpperCase() +
                          activity.status.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Score: {activity.score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Progress Insights */}
        {!isSuperAdmin && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Your Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Success Rate
                  </h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {userStats.successRate}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${userStats.successRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {userStats.problemsSolved} out of {userStats.totalSubmissions}{" "}
                  problems solved successfully
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Learning Streak
                  </h4>
                  <div className="text-2xl font-bold text-green-600">
                    {userStats.recentActivity.length > 0
                      ? "🔥 Active"
                      : "Start Today"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Problems this week
                    </span>
                    <span className="font-semibold">
                      {userStats.recentActivity.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total practice time
                    </span>
                    <span className="font-semibold">
                      ~{Math.round(userStats.totalSubmissions * 15)} min
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

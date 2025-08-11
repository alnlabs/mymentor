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

  // Debug authentication state
  console.log("Dashboard: Auth state:", {
    user: user ? { email: user.email, displayName: user.displayName } : null,
    loading,
    isAdmin,
    isSuperAdmin,
  });

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
      title: "Mock Interviews",
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {isSuperAdmin
              ? "SuperAdmin"
              : user?.displayName || user?.email || "User"}
            ! 👋
          </h2>
          <p className="text-gray-600">
            Ready to continue your learning journey? Choose from the options
            below.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => (window.location.href = item.href)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${item.color} text-white`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Open {item.title}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* User Statistics */}
        {!isSuperAdmin && (
          <div className="mt-12 space-y-8">
            {/* Stats Overview */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Your Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Problems Solved
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? "..." : userStats.problemsSolved}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {userStats.totalSubmissions > 0 &&
                          `${userStats.successRate}% success rate`}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Code className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        MCQ Completed
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? "..." : userStats.mcqCompleted}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Knowledge questions
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Interviews Taken
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? "..." : userStats.interviewsTaken}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mock interviews
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Submissions
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? "..." : userStats.totalSubmissions}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code submissions
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Activity className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            {userStats.recentActivity.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </h3>
                <Card className="p-6">
                  <div className="space-y-4">
                    {userStats.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {activity.status === "accepted" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : activity.status === "rejected" ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {activity.problemTitle}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                activity.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${
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

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => (window.location.href = "/problems")}
                  className="flex items-center justify-center space-x-2 h-16 text-lg"
                >
                  <Code className="w-5 h-5" />
                  <span>Start Coding</span>
                </Button>
                <Button
                  onClick={() => (window.location.href = "/mcq")}
                  className="flex items-center justify-center space-x-2 h-16 text-lg"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Take MCQ</span>
                </Button>
                {(isAdmin || isSuperAdmin) && (
                  <Button
                    onClick={() => (window.location.href = "/admin/interviews")}
                    className="flex items-center justify-center space-x-2 h-16 text-lg"
                  >
                    <Target className="w-5 h-5" />
                    <span>Mock Interview</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { StudentHeader } from "@/shared/components/StudentHeader";
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
  MessageSquare,
  FileText,
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
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, []);

  // Fetch user statistics
  useEffect(() => {
    if (user && !isSuperAdmin) {
      fetchUserStats();
    } else {
      setStatsLoading(false);
    }
  }, [user, isSuperAdmin]);

  // Handle redirects
  useEffect(() => {
    if (!loading) {
      if (!user && !isSuperAdmin) {
        window.location.href = "/";
      } else if ((isAdmin || isSuperAdmin) && user) {
        window.location.href = "/admin";
      }
    }
  }, [user, loading, isAdmin, isSuperAdmin]);

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

  // Show loading while authentication is being checked
  if (loading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show fallback if loading times out
  if (loading && loadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Authentication Issue
          </h2>
          <p className="text-gray-600 mb-4">
            Please try refreshing the page or signing in again.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go to Homepage
            </button>
          </div>
        </div>
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

  // Show loading while redirecting admin
  if ((isAdmin || isSuperAdmin) && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Redirecting to admin..." />
      </div>
    );
  }

  const dashboardItems = [
    {
      title: "Interviews",
      description: "Practice with realistic interview scenarios",
      icon: Target,
      href: "/student/interviews",
      color: "bg-blue-500",
    },
    {
      title: "Exams",
      description: "Take comprehensive practice exams",
      icon: FileText,
      href: "/student/exams",
      color: "bg-purple-500",
    },
    {
      title: "Admin Interviews",
      description: "Manage interview templates (Admin Only)",
      icon: Target,
      href: "/admin/interviews",
      color: "bg-blue-500",
      adminOnly: true,
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
      <StudentHeader title="MyMentor Dashboard" currentPage="dashboard" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {isSuperAdmin
              ? "SuperAdmin"
              : user?.displayName || user?.email || "Student"}
            !
          </h2>
          <p className="text-gray-600">
            Ready to continue your learning journey? Let's get started!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Problems Solved
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.problemsSolved}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  MCQs Completed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.mcqCompleted}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Interviews Taken
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.interviewsTaken}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.successRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Level Badge */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 ${level.bg} rounded-full flex items-center justify-center`}
              >
                <Trophy className={`w-8 h-8 ${level.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Current Level: {level.level}
                </h3>
                <p className="text-gray-600">
                  You've solved {userStats.problemsSolved} problems. Keep going!
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.title}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => (window.location.href = item.href)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {userStats.recentActivity.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <Card className="p-6">
              <div className="space-y-4">
                {userStats.recentActivity.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {activity.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : activity.status === "failed" ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.problemTitle}
                        </p>
                        <p className="text-sm text-gray-600">
                          Score: {activity.score} •{" "}
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

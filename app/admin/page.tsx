"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { useAuthContext } from "@/shared/components/AuthContext";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { ApiErrorBoundary } from "@/shared/components/ApiErrorBoundary";
import {
  Users,
  Code,
  BookOpen,
  FileText,
  Target,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Settings,
  Upload,
  Eye,
  ArrowRight,
  UserPlus,
  Award,
  Zap,
  Globe,
  Database,
  Shield,
  Calendar,
  Star,
  LogOut,
} from "lucide-react";

interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalProblems: number;
    totalMCQs: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    totalInterviews: number;
    completedInterviews: number;
    successRate: number;
    interviewCompletionRate: number;
    userEngagementRate: number;
  };
  recentActivity: {
    recentUsers: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      joinedAt: string;
    }>;
    recentSubmissions: Array<{
      id: string;
      userName: string;
      userEmail: string;
      problemTitle: string;
      status: string;
      score: number;
      submittedAt: string;
    }>;
    recentInterviews: Array<{
      id: string;
      userName: string;
      userEmail: string;
      templateTitle: string;
      status: string;
      score: number;
      startedAt: string;
    }>;
  };
  analytics: {
    userStats: Record<string, number>;
    problemStats: Record<string, number>;
    submissionStats: Record<string, number>;
  };
}

export default function AdminDashboard() {
  const {
    user,
    loading: authLoading,
    isAdmin,
    isSuperAdmin,
  } = useAuthContext();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug logging
  console.log("Admin Dashboard - User:", user?.email);
  console.log("Admin Dashboard - isAdmin:", isAdmin);
  console.log("Admin Dashboard - isSuperAdmin:", isSuperAdmin);

  // Redirect non-admin users
  React.useEffect(() => {
    if (!authLoading && (!user || (!isAdmin && !isSuperAdmin))) {
      console.log(
        "Admin Dashboard: User not authorized, redirecting to homepage"
      );
      window.location.href = "/";
    }
  }, [user, isAdmin, isSuperAdmin, authLoading]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "completed":
        return "text-green-600 bg-green-100";
      case "rejected":
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loading size="lg" text="Loading Admin Dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary componentName="AdminDashboard">
      <ApiErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Welcome back, {user?.displayName || user?.email}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>{isSuperAdmin ? "Super Admin" : "Admin"} Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loading size="lg" />
                  <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
              </div>
            ) : !stats ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to Load Dashboard
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Unable to load dashboard statistics.
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Users
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.overview.totalUsers.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">
                        {stats.overview.activeUsers} active
                      </span>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Problems
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.overview.totalProblems.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Code className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <BookOpen className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-blue-600">
                        {stats.overview.totalMCQs} MCQs
                      </span>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Submissions
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.overview.totalSubmissions.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">
                        {stats.overview.successRate.toFixed(1)}% success rate
                      </span>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Interviews
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.overview.totalInterviews.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Clock className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-blue-600">
                        {stats.overview.interviewCompletionRate.toFixed(1)}%
                        completion
                      </span>
                    </div>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {/* Recent Users */}
                    {stats.recentActivity.recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(user.joinedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Recent Submissions */}
                    {stats.recentActivity.recentSubmissions.map(
                      (submission) => (
                        <div
                          key={submission.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Code className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {submission.userName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {submission.problemTitle}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(
                                submission.submittedAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                submission.status
                              )}`}
                            >
                              {submission.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Score: {submission.score}
                            </p>
                          </div>
                        </div>
                      )
                    )}

                    {/* Recent Interviews */}
                    {stats.recentActivity.recentInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {interview.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {interview.templateTitle}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(interview.startedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              interview.status
                            )}`}
                          >
                            {interview.status}
                          </span>
                          {interview.score > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Score: {interview.score}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {stats.recentActivity.recentUsers.length === 0 &&
                      stats.recentActivity.recentSubmissions.length === 0 &&
                      stats.recentActivity.recentInterviews.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No recent activity</p>
                        </div>
                      )}
                  </div>
                </Card>

                {/* System Status */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    System Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Database</p>
                        <p className="text-sm text-gray-600">Online</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">API</p>
                        <p className="text-sm text-gray-600">Operational</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Authentication
                        </p>
                        <p className="text-sm text-gray-600">Active</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Code Execution
                        </p>
                        <p className="text-sm text-gray-600">Ready</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </ApiErrorBoundary>
    </ErrorBoundary>
  );
}

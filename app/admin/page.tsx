"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
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
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your technical interview platform
              </p>
            </div>
            
            {/* Header Menu */}
            <div className="flex items-center space-x-6">
              {/* Quick Access Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  onClick={() => (window.location.href = "/admin/interviews")}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Mock Interviews
                </Button>
                
                <Button
                  onClick={() => (window.location.href = "/admin/upload")}
                  variant="outline"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                
                <Button
                  onClick={() => (window.location.href = "/admin/users")}
                  variant="outline"
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Button>
                
                <Button
                  onClick={() => (window.location.href = "/admin/analytics")}
                  variant="outline"
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
              
              {/* System Status */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
              
              {/* User Menu */}
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">S</span>
                  </div>
                  <span className="hidden sm:inline">SuperAdmin</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">SuperAdmin</div>
                      <div className="text-gray-500">superadmin@mymentor.com</div>
                    </div>
                    
                    <Button
                      onClick={() => (window.location.href = "/admin/settings")}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-4 py-2 text-sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    
                    <Button
                      onClick={() => (window.location.href = "/")}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-4 py-2 text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Site
                    </Button>
                    
                    <div className="border-t border-gray-100">
                      <Button
                        onClick={() => {
                          localStorage.removeItem("superAdminUser");
                          window.location.href = "/";
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden mt-4">
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => (window.location.href = "/admin/interviews")}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                <Target className="w-3 h-3 mr-1" />
                Interviews
              </Button>
              
              <Button
                onClick={() => (window.location.href = "/admin/upload")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </Button>
              
              <Button
                onClick={() => (window.location.href = "/admin/users")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Users className="w-3 h-3 mr-1" />
                Users
              </Button>
              
              <Button
                onClick={() => (window.location.href = "/admin/analytics")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Button
              onClick={() => (window.location.href = "/")}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Button>
            <span>/</span>
            <span className="text-gray-900 font-medium">Admin Dashboard</span>
          </nav>
        </div>

        {/* Navigation Links */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Platform Navigation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button
                onClick={() => (window.location.href = "/admin/interviews")}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto hover:bg-blue-50 hover:border-blue-300"
              >
                <Target className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Mock Interviews</span>
                <span className="text-xs text-gray-500 mt-1">Templates & Sessions</span>
              </Button>

              <Button
                onClick={() => (window.location.href = "/admin/upload")}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto hover:bg-green-50 hover:border-green-300"
              >
                <Upload className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium">Upload Content</span>
                <span className="text-xs text-gray-500 mt-1">Problems & MCQs</span>
              </Button>

              <Button
                onClick={() => (window.location.href = "/admin/users")}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto hover:bg-purple-50 hover:border-purple-300"
              >
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
                <span className="text-xs text-gray-500 mt-1">Accounts & Roles</span>
              </Button>

              <Button
                onClick={() => (window.location.href = "/admin/analytics")}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto hover:bg-orange-50 hover:border-orange-300"
              >
                <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Analytics</span>
                <span className="text-xs text-gray-500 mt-1">Performance Data</span>
              </Button>

              <Button
                onClick={() => (window.location.href = "/admin/settings")}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto hover:bg-gray-50 hover:border-gray-300"
              >
                <Settings className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Settings</span>
                <span className="text-xs text-gray-500 mt-1">System Config</span>
              </Button>

              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto hover:bg-indigo-50 hover:border-indigo-300"
              >
                <Eye className="w-6 h-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium">View Site</span>
                <span className="text-xs text-gray-500 mt-1">Public Pages</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.totalUsers}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.overview.activeUsers} active (
                  {stats.overview.userEngagementRate}%)
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Coding Problems
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.totalProblems}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.analytics.problemStats.easy || 0} easy,{" "}
                  {stats.analytics.problemStats.medium || 0} medium,{" "}
                  {stats.analytics.problemStats.hard || 0} hard
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
                  MCQ Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.totalMCQs}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Knowledge assessment
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
                <p className="text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overview.totalSubmissions}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.overview.successRate}% success rate
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Success Rate
              </h3>
              <div className="text-2xl font-bold text-green-600">
                {stats.overview.successRate}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.overview.successRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.overview.acceptedSubmissions} out of{" "}
              {stats.overview.totalSubmissions} submissions accepted
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Interview Completion
              </h3>
              <div className="text-2xl font-bold text-blue-600">
                {stats.overview.interviewCompletionRate}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.overview.interviewCompletionRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.overview.completedInterviews} out of{" "}
              {stats.overview.totalInterviews} interviews completed
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                User Engagement
              </h3>
              <div className="text-2xl font-bold text-purple-600">
                {stats.overview.userEngagementRate}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.overview.userEngagementRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.overview.activeUsers} active users in last 30 days
            </p>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Button
                onClick={() => (window.location.href = "/admin/interviews")}
                className="w-full justify-start h-12 text-left bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Target className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">Mock Interviews</div>
                  <div className="text-sm text-blue-100">
                    Manage interview templates and sessions
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                onClick={() => (window.location.href = "/admin/upload")}
                className="w-full justify-start h-12 text-left"
              >
                <Upload className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">Upload New Content</div>
                  <div className="text-sm text-gray-500">
                    Add problems, MCQs, or interview templates
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/users")}
                className="w-full justify-start h-12 text-left"
              >
                <Users className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">Manage Users</div>
                  <div className="text-sm text-gray-500">
                    View and manage user accounts
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/analytics")}
                className="w-full justify-start h-12 text-left"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-gray-500">
                    Detailed performance insights
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/settings")}
                className="w-full justify-start h-12 text-left"
              >
                <Settings className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-medium">System Settings</div>
                  <div className="text-sm text-gray-500">
                    Configure platform settings
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
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
                    <p className="text-xs text-gray-500">
                      {user.email} • {user.role}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(user.joinedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Recent Submissions */}
              {stats.recentActivity.recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(submission.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{submission.userName}</p>
                    <p className="text-xs text-gray-500">
                      {submission.problemTitle}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(submission.submittedAt).toLocaleDateString(
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
              ))}

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
                    <p className="text-sm font-medium">{interview.userName}</p>
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
        </div>

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
                <p className="font-medium text-gray-900">Authentication</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Code Execution</p>
                <p className="text-sm text-gray-600">Ready</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

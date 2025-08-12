"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Users,
  Code,
  BookOpen,
  Target,
  TrendingUp,
  BarChart3,
  Clock,
  Activity,
} from "lucide-react";

interface Analytics {
  totalUsers: number;
  totalProblems: number;
  totalMCQs: number;
  totalSubmissions: number;
  activeUsers: number;
  completionRate: number;
  averageScore: number;
  topCategories: { name: string; count: number }[];
  recentActivity: {
    type: string;
    description: string;
    time: string;
  }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch real analytics data
      const [userStats, problemStats, mcqStats, submissionStats, categoryStats, activityStats] = await Promise.all([
        fetch("/api/user/stats").then(res => res.json()),
        fetch("/api/problems").then(res => res.json()),
        fetch("/api/mcq").then(res => res.json()),
        fetch("/api/submissions").then(res => res.json()),
        fetch("/api/analytics/categories").then(res => res.json()),
        fetch("/api/analytics/activity").then(res => res.json())
      ]);

      const totalUsers = userStats.success ? userStats.data.totalUsers : 0;
      const totalProblems = problemStats.success ? problemStats.data.length : 0;
      const totalMCQs = mcqStats.success ? mcqStats.data.length : 0;
      const totalSubmissions = submissionStats.success ? submissionStats.data.length : 0;
      
      // Calculate active users (users with submissions in last 7 days)
      const activeUsers = userStats.success ? userStats.data.activeUsers || 0 : 0;
      
      // Calculate completion rate based on actual data
      const completionRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
      
      // Calculate average score from actual submissions
      const averageScore = submissionStats.success && submissionStats.data.length > 0 
        ? Math.round(submissionStats.data.reduce((sum: number, sub: any) => sum + (sub.score || 0), 0) / submissionStats.data.length)
        : 0;

      // Get real top categories
      const topCategories = categoryStats.success ? categoryStats.data : [];

      // Get real recent activity
      const recentActivity = activityStats.success ? activityStats.data : [];

      setAnalytics({
        totalUsers,
        totalProblems,
        totalMCQs,
        totalSubmissions,
        activeUsers,
        completionRate,
        averageScore,
        topCategories,
        recentActivity,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
            <p className="text-indigo-100">
              Track platform performance, user engagement, and content
              effectiveness.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimeRange("7d")}
              className={
                timeRange === "7d"
                  ? "bg-white text-indigo-600"
                  : "text-white border-white"
              }
            >
              7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimeRange("30d")}
              className={
                timeRange === "30d"
                  ? "bg-white text-indigo-600"
                  : "text-white border-white"
              }
            >
              30 Days
            </Button>
          </div>
        </div>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Problems</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalProblems.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">MCQ Questions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalMCQs.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalSubmissions.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.activeUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.completionRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.averageScore}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Top Categories & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Categories
              </h3>
              <div className="space-y-3">
                {analytics.topCategories.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-gray-500 font-medium">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

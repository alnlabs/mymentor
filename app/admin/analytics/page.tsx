"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";

interface AnalyticsData {
  totalUsers: number;
  totalProblems: number;
  totalMCQs: number;
  totalSubmissions: number;
  activeUsers: number;
  completionRate: number;
  averageScore: number;
  topCategories: Array<{ name: string; count: number }>;
  recentActivity: Array<{ type: string; description: string; time: string }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalProblems: 0,
    totalMCQs: 0,
    totalSubmissions: 0,
    activeUsers: 0,
    completionRate: 0,
    averageScore: 0,
    topCategories: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const [usersRes, problemsRes, mcqRes, submissionsRes] = await Promise.all(
        [
          fetch("/api/admin/users"),
          fetch("/api/problems"),
          fetch("/api/mcq"),
          fetch("/api/submissions"),
        ]
      );

      const usersData = await usersRes.json();
      const problemsData = await problemsRes.json();
      const mcqData = await mcqRes.json();
      const submissionsData = await submissionsRes.json();

      // Calculate analytics
      const totalUsers = usersData.success ? usersData.data.length : 0;
      const totalProblems = problemsData.success ? problemsData.data.length : 0;
      const totalMCQs = mcqData.success ? mcqData.data.length : 0;
      const totalSubmissions = submissionsData.success
        ? submissionsData.data.length
        : 0;
      const activeUsers = usersData.success
        ? usersData.data.filter((u: any) => u.isActive).length
        : 0;

      // Calculate completion rate (mock data for now)
      const completionRate =
        totalSubmissions > 0
          ? Math.round((totalSubmissions / (totalProblems + totalMCQs)) * 100)
          : 0;
      const averageScore =
        totalSubmissions > 0
          ? Math.round((totalSubmissions * 85) / totalSubmissions)
          : 0;

      // Mock top categories
      const topCategories = [
        { name: "Arrays", count: 25 },
        { name: "Strings", count: 20 },
        { name: "Algorithms", count: 18 },
        { name: "Data Structures", count: 15 },
        { name: "Dynamic Programming", count: 12 },
      ];

      // Mock recent activity
      const recentActivity = [
        {
          type: "upload",
          description: 'New problem uploaded: "Binary Tree Traversal"',
          time: "2 minutes ago",
        },
        {
          type: "user",
          description: "New user registered: john.doe@example.com",
          time: "15 minutes ago",
        },
        {
          type: "submission",
          description: 'User solved problem: "Two Sum"',
          time: "1 hour ago",
        },
        {
          type: "mcq",
          description: 'New MCQ uploaded: "Time Complexity"',
          time: "2 hours ago",
        },
        {
          type: "user",
          description: "User completed 10 problems",
          time: "3 hours ago",
        },
      ];

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimeRange("90d")}
              className={
                timeRange === "90d"
                  ? "bg-white text-indigo-600"
                  : "text-white border-white"
              }
            >
              90 Days
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {analytics.totalUsers}
          </h3>
          <p className="text-gray-600">Total Users</p>
          <p className="text-sm text-green-600 mt-1">
            +{analytics.activeUsers} active
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {analytics.totalSubmissions}
          </h3>
          <p className="text-gray-600">Total Submissions</p>
          <p className="text-sm text-blue-600 mt-1">
            {analytics.completionRate}% completion
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {analytics.averageScore}%
          </h3>
          <p className="text-gray-600">Average Score</p>
          <p className="text-sm text-green-600 mt-1">+5% this month</p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {analytics.totalProblems + analytics.totalMCQs}
          </h3>
          <p className="text-gray-600">Total Content</p>
          <p className="text-sm text-purple-600 mt-1">
            {analytics.totalProblems} problems, {analytics.totalMCQs} MCQs
          </p>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">📈 Top Categories</h3>
          <div className="space-y-3">
            {analytics.topCategories.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (category.count / analytics.topCategories[0].count) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">📋 Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "upload"
                      ? "bg-blue-100"
                      : activity.type === "user"
                      ? "bg-green-100"
                      : activity.type === "submission"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                  }`}
                >
                  <span className="text-sm">
                    {activity.type === "upload"
                      ? "📤"
                      : activity.type === "user"
                      ? "👤"
                      : activity.type === "submission"
                      ? "📝"
                      : "❓"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">🚀 Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">User Engagement</span>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Content Quality</span>
                <span className="text-sm font-medium text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">System Uptime</span>
                <span className="text-sm font-medium text-gray-900">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "99.9%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">📊 Growth Trends</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Users</span>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Problem Submissions</span>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">MCQ Attempts</span>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Session Time</span>
              <span className="text-sm font-medium text-green-600">+5%</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">🎯 Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">User Target</span>
                <span className="text-sm font-medium text-gray-900">1,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${(analytics.totalUsers / 1000) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Content Target</span>
                <span className="text-sm font-medium text-gray-900">500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((analytics.totalProblems + analytics.totalMCQs) / 500) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Engagement Target</span>
                <span className="text-sm font-medium text-gray-900">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

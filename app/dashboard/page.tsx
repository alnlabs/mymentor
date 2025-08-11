"use client";

import React from "react";
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
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading, isAdmin, isSuperAdmin, signOutUser } =
    useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Dashboard..." />
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
                    {isSuperAdmin ? "S" : user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block">
                  {isSuperAdmin ? "SuperAdmin" : user?.name || "User"}
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
            Welcome back, {isSuperAdmin ? "SuperAdmin" : user?.name || "User"}!
            👋
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

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Problems Solved
                  </p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    MCQ Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
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
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

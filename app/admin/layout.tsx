"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { RouteGuard } from "@/shared/components/RouteGuard";
import { useAuthContext } from "@/shared/components/AuthContext";
import {
  BarChart3,
  Upload,
  Users,
  Settings,
  Target,
  FileText,
  Home,
  LogOut,
  Menu,
  X,
  Eye,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    description: "Overview & Statistics",
  },
  {
    name: "Mock Interviews",
    href: "/admin/interviews",
    icon: Target,
    description: "Templates & Sessions",
  },
  {
    name: "Upload Content",
    href: "/admin/upload",
    icon: Upload,
    description: "Problems & MCQs",
  },
  {
    name: "Coding Problems",
    href: "/admin/problems",
    icon: FileText,
    description: "View & Manage Problems",
  },
  {
    name: "MCQ Questions",
    href: "/admin/mcq",
    icon: FileText,
    description: "View & Manage MCQs",
  },
  {
    name: "Manage Users",
    href: "/admin/users",
    icon: Users,
    description: "User Accounts",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Performance Data",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System Config",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, userRole, isAdmin, isSuperAdmin, signOutUser } =
    useAuthContext();

  const handleSignOut = async () => {
    await signOutUser();
  };

  // Get user display info
  const getUserDisplayInfo = () => {
    if (isSuperAdmin) {
      return {
        name: "SuperAdmin",
        email: user?.email || "superadmin@mymentor.com",
        avatar: "S",
        role: "superadmin",
      };
    }
    return {
      name: user?.displayName || user?.email?.split("@")[0] || "Admin",
      email: user?.email || "admin@mymentor.com",
      avatar: user?.displayName?.charAt(0) || user?.email?.charAt(0) || "A",
      role: userRole,
    };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <RouteGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MyMentor</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                    title={item.description}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500 font-normal">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userInfo.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userInfo.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar - aligned with sidebar navigation */}
          <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Page title */}
              <div className="flex-1 lg:flex-none">
                <h1 className="text-lg font-semibold text-gray-900">
                  {navigation.find((item) => item.href === pathname)?.name ||
                    "Admin Panel"}
                </h1>
              </div>

              {/* Header Menu for all admin users */}
              <div className="flex items-center space-x-4">
                {/* Quick Access Menu */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    onClick={() => (window.location.href = "/admin/interviews")}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Interviews
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/admin/upload")}
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/admin/users")}
                    variant="outline"
                    size="sm"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Users
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/admin/analytics")}
                    variant="outline"
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Analytics
                  </Button>
                </div>

                {/* System Status */}
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {userInfo.avatar}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{userInfo.name}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">{userInfo.name}</div>
                        <div className="text-gray-500">{userInfo.email}</div>
                      </div>

                      <Button
                        onClick={() =>
                          (window.location.href = "/admin/settings")
                        }
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
                          onClick={handleSignOut}
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
          </div>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
}

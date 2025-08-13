"use client";

import React from "react";
import { useAuthContext } from "./AuthContext";
import { Button } from "./Button";
import { LogOut } from "lucide-react";

interface StudentHeaderProps {
  title: string;
  currentPage?: string;
}

export function StudentHeader({ title, currentPage }: StudentHeaderProps) {
  const { user, isAdmin, isSuperAdmin, signOutUser } = useAuthContext();

  const navItems = [
    {
      href: "/student/dashboard",
      label: "Dashboard",
      current: currentPage === "dashboard",
    },
    {
      href: "/student/interviews",
      label: "Interviews",
      current: currentPage === "interviews",
    },
    {
      href: "/student/exams",
      label: "Exams",
      current: currentPage === "exams",
    },
    {
      href: "/student/feedback",
      label: "Feedback",
      current: currentPage === "feedback",
    },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {title}
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
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    item.current
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </a>
              ))}
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
              onClick={signOutUser}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { AuthButton } from "@/shared/components/AuthButton";
import { ApiResponse } from "@/shared/types/common";
import { useAuthContext } from "@/shared/components/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    user,
    isSuperAdmin,
    loading: authLoading,
    updateUserRole,
  } = useAuthContext();

  // Redirect authenticated users to appropriate area
  React.useEffect(() => {
    if (!authLoading && (user || isSuperAdmin)) {
      if (isSuperAdmin) {
        console.log("Login page: SuperAdmin authenticated, redirecting to admin");
        window.location.href = "/admin";
      } else if (user) {
        console.log("Login page: User authenticated, redirecting to student area");
        window.location.href = "/student";
      }
    }
  }, [user, isSuperAdmin, authLoading]);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the SuperAdmin API route
      const response = await fetch("/api/auth/superadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data?.user) {
        // Store SuperAdmin session
        localStorage.setItem(
          "superAdminUser",
          JSON.stringify(result.data.user)
        );

        // Update AuthContext
        updateUserRole("superadmin");

        // Show success message
        alert("SuperAdmin login successful! Redirecting to admin panel...");

        // Redirect to admin panel
        window.location.href = "/admin";
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (error: any) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Don't render login form if user is authenticated (will redirect)
  if (user || isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Redirecting..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to MyMentor
          </h2>
          <p className="text-gray-600">
            Sign in to access your personalized interview preparation
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <div className="space-y-6">
            {/* Google Login - Top */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Quick and secure sign-in with Google
              </p>
              <AuthButton className="w-full" />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form Login */}
            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address or Username
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email or username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loading size="sm" text="Signing in..." />
                ) : (
                  "Sign In with Email"
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => (window.location.href = "/")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Go to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

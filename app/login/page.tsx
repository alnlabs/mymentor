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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isSuperAdmin, loading: authLoading } = useAuthContext();

  // Redirect authenticated users to appropriate area
  React.useEffect(() => {
    if (!authLoading && (user || isSuperAdmin)) {
      if (isSuperAdmin) {
        console.log(
          "Login page: SuperAdmin authenticated, redirecting to admin"
        );
        window.location.href = "/admin";
      } else if (user) {
        console.log(
          "Login page: User authenticated, redirecting to student area"
        );
        window.location.href = "/student";
      }
    }
  }, [user, isSuperAdmin, authLoading]);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First try regular user login
      const userResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const userResult: ApiResponse = await userResponse.json();

      if (userResult.success && userResult.data?.user) {
        const user = userResult.data.user;

        if (user.role === "superadmin") {
          // Store SuperAdmin session
          localStorage.setItem("superAdminUser", JSON.stringify(user));
          alert("SuperAdmin login successful! Redirecting to admin panel...");
          window.location.href = "/admin";
        } else {
          // Store regular user session
          localStorage.setItem("userSession", JSON.stringify(user));
          alert("Login successful! Redirecting to student area...");
          window.location.href = "/student";
        }
      } else {
        setError(userResult.error || "Invalid credentials");
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
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    // If it looks like a username (no @), also set username
                    if (!value.includes("@")) {
                      setUsername(value);
                    } else {
                      setUsername("");
                    }
                  }}
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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
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

"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("admin@mymentor.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/superadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Store SuperAdmin session
        localStorage.setItem("superAdminUser", JSON.stringify(data.data.user));
        alert("SuperAdmin login successful! You can now access admin pages.");
        window.location.href = "/admin/exams";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              SuperAdmin Login
            </h1>
            <p className="text-gray-600 mt-2">Access the admin panel</p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Login Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                You can now access the admin panel.
              </p>
              <Button
                onClick={() => (window.location.href = "/admin/exams")}
                className="w-full"
              >
                Go to Admin Panel
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@mymentor.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter SuperAdmin password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Default Credentials:</strong>
                  <br />
                  Email: admin@mymentor.com
                  <br />
                  Password: MyMentor2024!
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loading size="sm" text="Logging in..." />
                  </div>
                ) : (
                  "Login as SuperAdmin"
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (window.location.href = "/test-api")}
                  className="w-full"
                >
                  Or Test API Directly
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}

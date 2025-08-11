"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { RouteGuard } from "@/shared/components/RouteGuard";

function SettingsPageContent() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      // Call API to update SuperAdmin credentials
      const response = await fetch("/api/admin/settings/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUsername: "superadmin", // Default SuperAdmin username
          currentPassword,
          newUsername: newUsername || "superadmin",
          newPassword: newPassword || currentPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text:
            result.message ||
            "SuperAdmin credentials updated successfully! Your new credentials are now active.",
        });

        // Clear form
        setCurrentPassword("");
        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({
          type: "error",
          text:
            result.error || "Failed to update credentials. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update credentials. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-orange-100">
          Manage SuperAdmin credentials and platform configuration.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SuperAdmin Credentials */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">
              ⚡ SuperAdmin Credentials
            </h2>
            <form onSubmit={handleUpdateCredentials} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label
                  htmlFor="newUsername"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Username
                </label>
                <input
                  id="newUsername"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new username"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loading size="sm" text="Updating..." />
                ) : (
                  "Update SuperAdmin Credentials"
                )}
              </Button>
            </form>
          </Card>

          {/* Security Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">
              🔒 Security Information
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Current SuperAdmin
                </h3>
                <p className="text-sm text-blue-800">
                  Username: superadmin
                  <br />
                  Status: Active
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="font-medium text-green-900 mb-2">
                  ✅ Best Practices
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Change credentials regularly</li>
                  <li>• Use unique passwords for different services</li>
                  <li>• Enable two-factor authentication if available</li>
                  <li>• Monitor login attempts</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RouteGuard requiredRole="superadmin">
      <SettingsPageContent />
    </RouteGuard>
  );
}

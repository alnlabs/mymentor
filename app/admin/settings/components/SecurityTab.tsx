"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType } from "../types";

interface SecurityTabProps {
  context: SettingsContextType;
}

export default function SecurityTab({ context }: SecurityTabProps) {
  const { getSettingValue, updateSettings, setMessage } = context;

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const response = await fetch("/api/admin/settings/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername || "superadmin",
          newPassword: newPassword || currentPassword,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({
          type: "success",
          text: "SuperAdmin credentials updated successfully!",
        });
        setCurrentPassword("");
        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update credentials",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update credentials" });
    }
  };

  return (
    <div className="space-y-6">
      {/* SuperAdmin Credentials */}
      <Card>
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ⚡ SuperAdmin Credentials
        </h3>
        <form onSubmit={handleUpdateCredentials} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Username (optional)
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Leave empty to keep current"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                  placeholder="Leave empty to keep current"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            🔐 Update Credentials
          </Button>
        </form>
      </Card>

      {/* Security Settings */}
      <Card>
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🔒 Security Settings
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await updateSettings([
              {
                key: "session_timeout",
                value: formData.get("session_timeout") as string,
                category: "security",
              },
              {
                key: "max_login_attempts",
                value: formData.get("max_login_attempts") as string,
                category: "security",
              },
              {
                key: "password_min_length",
                value: formData.get("password_min_length") as string,
                category: "security",
              },
              {
                key: "require_2fa",
                value: formData.get("require_2fa") as string,
                category: "security",
              },
              {
                key: "enable_audit_log",
                value: formData.get("enable_audit_log") as string,
                category: "security",
              },
            ]);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                name="session_timeout"
                defaultValue={getSettingValue("session_timeout", "30")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="5"
                max="1440"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                name="max_login_attempts"
                defaultValue={getSettingValue("max_login_attempts", "5")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="3"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                name="password_min_length"
                defaultValue={getSettingValue("password_min_length", "8")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="6"
                max="20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Require 2FA
              </label>
              <select
                name="require_2fa"
                defaultValue={getSettingValue("require_2fa", "false")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Required</option>
                <option value="false">Optional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enable Audit Log
              </label>
              <select
                name="enable_audit_log"
                defaultValue={getSettingValue("enable_audit_log", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              💾 Save Security Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

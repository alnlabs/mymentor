"use client";

import React from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType } from "../types";

interface SystemTabProps {
  context: SettingsContextType;
}

export default function SystemTab({ context }: SystemTabProps) {
  const { getSettingValue, updateSettings } = context;

  return (
    <div className="space-y-6">
      {/* System Settings */}
      <Card>
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ⚙️ System Settings
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await updateSettings([
              {
                key: "database_backup_frequency",
                value: formData.get("database_backup_frequency") as string,
                category: "system",
              },
              {
                key: "log_retention_days",
                value: formData.get("log_retention_days") as string,
                category: "system",
              },
              {
                key: "auto_cleanup_enabled",
                value: formData.get("auto_cleanup_enabled") as string,
                category: "system",
              },
              {
                key: "cleanup_interval_days",
                value: formData.get("cleanup_interval_days") as string,
                category: "system",
              },
              {
                key: "performance_monitoring",
                value: formData.get("performance_monitoring") as string,
                category: "system",
              },
              {
                key: "error_reporting",
                value: formData.get("error_reporting") as string,
                category: "system",
              },
            ]);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Backup Frequency
              </label>
              <select
                name="database_backup_frequency"
                defaultValue={getSettingValue("database_backup_frequency", "daily")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Retention (days)
              </label>
              <select
                name="log_retention_days"
                defaultValue={getSettingValue("log_retention_days", "30")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto Cleanup
              </label>
              <select
                name="auto_cleanup_enabled"
                defaultValue={getSettingValue("auto_cleanup_enabled", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cleanup Interval (days)
              </label>
              <select
                name="cleanup_interval_days"
                defaultValue={getSettingValue("cleanup_interval_days", "7")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="1">Daily</option>
                <option value="7">Weekly</option>
                <option value="30">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Monitoring
              </label>
              <select
                name="performance_monitoring"
                defaultValue={getSettingValue("performance_monitoring", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Reporting
              </label>
              <select
                name="error_reporting"
                defaultValue={getSettingValue("error_reporting", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              💾 Save System Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

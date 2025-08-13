"use client";

import React from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType } from "../types";

interface PlatformTabProps {
  context: SettingsContextType;
}

export default function PlatformTab({ context }: PlatformTabProps) {
  const { getSettingValue, updateSettings } = context;

  return (
    <div className="space-y-6">
      {/* Platform Settings */}
      <Card>
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🚀 Platform Settings
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await updateSettings([
              {
                key: "maintenance_mode",
                value: formData.get("maintenance_mode") as string,
                category: "platform",
              },
              {
                key: "debug_mode",
                value: formData.get("debug_mode") as string,
                category: "platform",
              },
              {
                key: "log_level",
                value: formData.get("log_level") as string,
                category: "platform",
              },
              {
                key: "cache_enabled",
                value: formData.get("cache_enabled") as string,
                category: "platform",
              },
              {
                key: "rate_limiting",
                value: formData.get("rate_limiting") as string,
                category: "platform",
              },
              {
                key: "max_requests_per_minute",
                value: formData.get("max_requests_per_minute") as string,
                category: "platform",
              },
            ]);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Mode
              </label>
              <select
                name="maintenance_mode"
                defaultValue={getSettingValue("maintenance_mode", "false")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Debug Mode
              </label>
              <select
                name="debug_mode"
                defaultValue={getSettingValue("debug_mode", "false")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Level
              </label>
              <select
                name="log_level"
                defaultValue={getSettingValue("log_level", "info")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Enabled
              </label>
              <select
                name="cache_enabled"
                defaultValue={getSettingValue("cache_enabled", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate Limiting
              </label>
              <select
                name="rate_limiting"
                defaultValue={getSettingValue("rate_limiting", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Requests per Minute
              </label>
              <input
                type="number"
                name="max_requests_per_minute"
                defaultValue={getSettingValue("max_requests_per_minute", "100")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="10"
                max="1000"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              💾 Save Platform Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

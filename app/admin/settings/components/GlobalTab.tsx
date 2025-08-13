"use client";

import React from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType } from "../types";

interface GlobalTabProps {
  context: SettingsContextType;
}

export default function GlobalTab({ context }: GlobalTabProps) {
  const { getSettingValue, updateSettings } = context;

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🌍 Global Settings
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await updateSettings([
              {
                key: "page_size",
                value: formData.get("page_size") as string,
                category: "global",
              },
              {
                key: "enable_search",
                value: formData.get("enable_search") as string,
                category: "global",
              },
              {
                key: "enable_analytics",
                value: formData.get("enable_analytics") as string,
                category: "global",
              },
              {
                key: "max_file_upload_size",
                value: formData.get("max_file_upload_size") as string,
                category: "global",
              },
              {
                key: "feature_beta_mode",
                value: formData.get("feature_beta_mode") as string,
                category: "global",
              },
              {
                key: "auto_refresh_interval",
                value: formData.get("auto_refresh_interval") as string,
                category: "global",
              },
            ]);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Page Size
              </label>
              <select
                name="page_size"
                defaultValue={getSettingValue("page_size", "20")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="10">10 items</option>
                <option value="20">20 items</option>
                <option value="50">50 items</option>
                <option value="100">100 items</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enable Search
              </label>
              <select
                name="enable_search"
                defaultValue={getSettingValue("enable_search", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enable Analytics
              </label>
              <select
                name="enable_analytics"
                defaultValue={getSettingValue("enable_analytics", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max File Upload Size (MB)
              </label>
              <select
                name="max_file_upload_size"
                defaultValue={getSettingValue("max_file_upload_size", "10")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="5">5 MB</option>
                <option value="10">10 MB</option>
                <option value="25">25 MB</option>
                <option value="50">50 MB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beta Features
              </label>
              <select
                name="feature_beta_mode"
                defaultValue={getSettingValue("feature_beta_mode", "false")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto Refresh Interval (seconds)
              </label>
              <select
                name="auto_refresh_interval"
                defaultValue={getSettingValue("auto_refresh_interval", "30")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              💾 Save Global Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

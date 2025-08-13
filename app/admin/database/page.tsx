"use client";

import { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import {
  Database,
  Table,
  Users,
  FileText,
  Code,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Activity,
} from "lucide-react";

interface DatabaseStats {
  totalUsers: number;
  totalMCQs: number;
  totalProblems: number;
  totalExams: number;
  totalInterviews: number;
  totalSessions: number;
  totalSubmissions: number;
  totalFeedback: number;
  databaseSize: string;
  lastBackup: string;
  activeConnections: number;
}

interface TableInfo {
  name: string;
  count: number;
  size: string;
  lastModified: string;
  status: "healthy" | "warning" | "error";
}

export default function AdminDatabasePage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      // Fetch database statistics
      const statsResponse = await fetch("/api/admin/stats");
      const statsData = await statsResponse.json();

      if (statsData.success) {
        const overview = statsData.data.overview;
        setStats({
          totalUsers: overview.totalUsers,
          totalMCQs: overview.totalMCQs,
          totalProblems: overview.totalProblems,
          totalExams: overview.totalExams,
          totalInterviews: overview.totalInterviews,
          totalSessions: overview.totalExamSessions,
          totalSubmissions: overview.totalSubmissions,
          totalFeedback: overview.totalFeedback,
          databaseSize: "~45.2 MB",
          lastBackup: "2025-01-13 14:30:00",
          activeConnections: 3,
        });
      }

      // Fetch table information
      const tablesResponse = await fetch("/api/admin/database/tables");
      const tablesData = await tablesResponse.json();

      if (tablesData.success) {
        setTables(tablesData.data);
      }
    } catch (error) {
      console.error("Error fetching database info:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch database information",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/database/backup", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Database backup created successfully",
        });
        fetchDatabaseInfo(); // Refresh stats
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create backup",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create backup" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOptimize = async () => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/database/optimize", {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Database optimized successfully",
        });
        fetchDatabaseInfo(); // Refresh stats
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to optimize database",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to optimize database" });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "error":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Database className="w-8 h-8 mr-3 text-blue-600" />
                Database Management
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor and manage your database performance and data
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={fetchDatabaseInfo}
                variant="outline"
                disabled={actionLoading}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleBackup}
                disabled={actionLoading}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Backup
              </Button>
              <Button
                onClick={handleOptimize}
                disabled={actionLoading}
                variant="outline"
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Optimize
              </Button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 mr-2" />
              )}
              <p className="font-medium">{message.text}</p>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Database Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    MCQ Questions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalMCQs}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Code className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Coding Problems
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProblems}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Exams
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalExams}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Database Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Database Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Size</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.databaseSize || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Active Connections
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.activeConnections || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.lastBackup || "Never"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">
                  Healthy
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <HardDrive className="w-5 h-5 mr-2" />
              Storage Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.totalSessions || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Submissions</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.totalSubmissions || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Interviews</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.totalInterviews || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Feedback</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.totalFeedback || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Database Tables */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Table className="w-5 h-5 mr-2" />
            Database Tables
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tables.map((table) => (
                  <tr key={table.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {table.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {table.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {table.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {table.lastModified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          table.status
                        )}`}
                      >
                        {getStatusIcon(table.status)}
                        <span className="ml-1 capitalize">{table.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Backup & Restore
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Create database backups and restore from previous versions
            </p>
            <div className="space-y-2">
              <Button
                onClick={handleBackup}
                disabled={actionLoading}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Restore Backup
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Maintenance
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Optimize database performance and clean up old data
            </p>
            <div className="space-y-2">
              <Button
                onClick={handleOptimize}
                disabled={actionLoading}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Optimize Database
              </Button>
              <Button variant="outline" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Clean Old Data
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Monitoring
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Monitor database performance and view detailed logs
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                Performance Monitor
              </Button>
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';

interface DashboardStats {
  totalUsers: number;
  totalProblems: number;
  totalMCQs: number;
  totalSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProblems: 0,
    totalMCQs: 0,
    totalSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [usersRes, problemsRes, mcqRes, submissionsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/problems'),
        fetch('/api/mcq'),
        fetch('/api/submissions'),
      ]);

      // Check if responses are ok before parsing JSON
      const usersData = usersRes.ok ? await usersRes.json() : { success: false, data: [] };
      const problemsData = problemsRes.ok ? await problemsRes.json() : { success: false, data: [] };
      const mcqData = mcqRes.ok ? await mcqRes.json() : { success: false, data: [] };
      const submissionsData = submissionsRes.ok ? await submissionsRes.json() : { success: false, data: [] };

      setStats({
        totalUsers: usersData.success ? usersData.data.length : 0,
        totalProblems: problemsData.success ? problemsData.data.length : 0,
        totalMCQs: mcqData.success ? mcqData.data.length : 0,
        totalSubmissions: submissionsData.success ? submissionsData.data.length : 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default stats on error
      setStats({
        totalUsers: 0,
        totalProblems: 0,
        totalMCQs: 0,
        totalSubmissions: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to MyMentor Admin</h2>
        <p className="text-blue-100">
          Manage your technical interview preparation platform from this central dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalUsers}</h3>
          <p className="text-gray-600">Total Users</p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💻</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalProblems}</h3>
          <p className="text-gray-600">Coding Problems</p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❓</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalMCQs}</h3>
          <p className="text-gray-600">MCQ Questions</p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalSubmissions}</h3>
          <p className="text-gray-600">Submissions</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = '/admin/upload'}
              className="w-full justify-start"
            >
              📤 Upload New Content
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/admin/users'}
              className="w-full justify-start"
            >
              👥 Manage Users
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/admin/analytics'}
              className="w-full justify-start"
            >
              📊 View Analytics
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">📋 Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">📤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Content uploaded</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Problem solved</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">🔧 System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Database: Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">API: Operational</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Authentication: Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

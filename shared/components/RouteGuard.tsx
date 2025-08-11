'use client';

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/shared/components/AuthContext';
import { Loading } from '@/shared/components/Loading';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'superadmin';
  fallback?: React.ReactNode;
}

export function RouteGuard({ children, requiredRole = 'admin', fallback }: RouteGuardProps) {
  const { user, loading, isAdmin, isSuperAdmin } = useAuthContext();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);

  // Show loading while checking authentication
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Checking access..." />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">🔒</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You must be logged in to access this page.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Check role requirements
  const hasRequiredRole = requiredRole === 'superadmin' ? isSuperAdmin : isAdmin;

  if (!hasRequiredRole) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Insufficient Permissions</h2>
            <p className="text-gray-600 mb-6">
              You need {requiredRole === 'superadmin' ? 'SuperAdmin' : 'Admin'} access to view this page.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/admin'}
              >
                Admin Panel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // User has required role, show the protected content
  return <>{children}</>;
}

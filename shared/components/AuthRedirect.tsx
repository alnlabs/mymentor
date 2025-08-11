'use client';

import React, { useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { Loading } from './Loading';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthRedirect({ children, redirectTo = '/dashboard' }: AuthRedirectProps) {
  const { user, loading, isAdmin, isSuperAdmin } = useAuthContext();

  useEffect(() => {
    // Only redirect if not loading and user is logged in
    if (!loading && (user || isSuperAdmin)) {
      console.log('User is logged in, redirecting to:', redirectTo);
      window.location.href = redirectTo;
    }
  }, [user, loading, isSuperAdmin, redirectTo]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // If user is logged in, show loading while redirecting
  if (user || isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Redirecting to dashboard..." />
      </div>
    );
  }

  // If not logged in, show the children (current page content)
  return <>{children}</>;
}

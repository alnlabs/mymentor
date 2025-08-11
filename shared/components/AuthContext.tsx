'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  userRole: 'superadmin' | 'admin' | 'user' | 'guest';
  isAdmin: boolean;
  isSuperAdmin: boolean;
  updateUserRole: (role: 'superadmin' | 'admin' | 'user' | 'guest') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'superadmin' | 'admin' | 'user' | 'guest'>('guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const checkSuperAdminSession = useCallback(() => {
    const superAdminSession = localStorage.getItem('superAdminUser');
    if (superAdminSession) {
      try {
        const superAdminData = JSON.parse(superAdminSession);
        if (superAdminData.role === 'superadmin') {
          setUserRole('superadmin');
          setIsAdmin(true);
          setIsSuperAdmin(true);
          setUser(superAdminData); // Set user data for SuperAdmin
          return true;
        }
      } catch (e) {
        console.error("Failed to parse superAdminSession from localStorage", e);
        localStorage.removeItem('superAdminUser');
      }
    }
    return false;
  }, []);

  const fetchUserRole = useCallback(async (firebaseUser: any | null) => {
    if (!firebaseUser) {
      setUserRole('guest');
      setIsAdmin(false);
      setIsSuperAdmin(false);
      return;
    }

    // Check for SuperAdmin session first
    if (checkSuperAdminSession()) {
      return;
    }

    // If not SuperAdmin via session, fetch role from database
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'x-user-id': firebaseUser.uid,
        },
      });
      const result = await response.json();
      if (result.success && result.data && result.data.role) {
        const role = result.data.role.toLowerCase();
        setUserRole(role);
        setIsAdmin(role === 'admin' || role === 'superadmin');
        setIsSuperAdmin(role === 'superadmin');
      } else {
        setUserRole('user');
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
      setIsAdmin(false);
      setIsSuperAdmin(false);
    }
  }, [checkSuperAdminSession]);

  useEffect(() => {
    // Check for SuperAdmin session on mount
    if (checkSuperAdminSession()) {
      setLoading(false);
      return;
    }

    // For now, we'll skip Firebase initialization to avoid errors
    // In a real app, you'd initialize Firebase here
    setLoading(false);
  }, [checkSuperAdminSession]);

  const signInWithGoogle = useCallback(async () => {
    // For now, we'll show a message that Google login is not implemented
    alert('Google Sign-In is not implemented in this demo. Please use SuperAdmin login.');
  }, []);

  const signOutUser = useCallback(async () => {
    try {
      localStorage.removeItem('superAdminUser');
      setUser(null);
      setUserRole('guest');
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  }, []);

  const updateUserRole = useCallback((role: 'superadmin' | 'admin' | 'user' | 'guest') => {
    setUserRole(role);
    setIsAdmin(role === 'admin' || role === 'superadmin');
    setIsSuperAdmin(role === 'superadmin');
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
    userRole,
    isAdmin,
    isSuperAdmin,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

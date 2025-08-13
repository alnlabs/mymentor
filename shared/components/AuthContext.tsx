"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, onAuthStateChange } from "@/shared/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Check for existing sessions
  const checkExistingSessions = () => {
    // Check for SuperAdmin session
    const superAdminSession = localStorage.getItem("superAdminUser");
    if (superAdminSession) {
      try {
        const superAdminData = JSON.parse(superAdminSession);
        if (superAdminData.role === "superadmin") {
          setUser(superAdminData);
          setIsAdmin(true);
          setIsSuperAdmin(true);
          setLoading(false);
          return true;
        }
      } catch (e) {
        console.error("Failed to parse superAdminSession from localStorage", e);
        localStorage.removeItem("superAdminUser");
      }
    }

    // Check for regular user session
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        if (userData.role && userData.role !== "superadmin") {
          setUser(userData);
          setIsAdmin(userData.role === "admin");
          setIsSuperAdmin(false);
          setLoading(false);
          return true;
        }
      } catch (e) {
        console.error("Failed to parse userSession from localStorage", e);
        localStorage.removeItem("userSession");
      }
    }

    return false;
  };

  useEffect(() => {
    // Check for existing sessions first
    if (checkExistingSessions()) {
      return;
    }

    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        fetchUserRole(firebaseUser);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setLoading(false);
      }
    });

    // Simple timeout - stop loading after 2 seconds
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchUserRole = async (firebaseUser: User) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          "x-user-id": firebaseUser.uid,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAdmin(data.data.role === "admin");
          setIsSuperAdmin(data.data.role === "superadmin");
        } else {
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import(
        "firebase/auth"
      );
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOutUser = async () => {
    try {
      // Clear all sessions
      localStorage.removeItem("superAdminUser");
      localStorage.removeItem("userSession");

      // Sign out from Firebase
      await auth.signOut();

      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSuperAdmin,
        signOutUser,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

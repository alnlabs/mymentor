"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "firebase/auth";
import {
  auth,
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  onAuthStateChange,
} from "@/shared/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  userRole: "superadmin" | "admin" | "user" | "guest";
  isAdmin: boolean;
  isSuperAdmin: boolean;
  updateUserRole: (role: "superadmin" | "admin" | "user" | "guest") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<
    "superadmin" | "admin" | "user" | "guest"
  >("guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const checkSuperAdminSession = useCallback(() => {
    const superAdminSession = localStorage.getItem("superAdminUser");
    if (superAdminSession) {
      try {
        const superAdminData = JSON.parse(superAdminSession);
        if (superAdminData.role === "superadmin") {
          setUserRole("superadmin");
          setIsAdmin(true);
          setIsSuperAdmin(true);
          setUser(superAdminData);
          return true;
        }
      } catch (e) {
        console.error("Failed to parse superAdminSession from localStorage", e);
        localStorage.removeItem("superAdminUser");
      }
    }
    return false;
  }, []);

  const fetchUserRole = useCallback(
    async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        console.log("No Firebase user, setting guest role");
        setUserRole("guest");
        setIsAdmin(false);
        setIsSuperAdmin(false);
        return;
      }

      console.log("Fetching user role for:", firebaseUser.email);

      // Check for SuperAdmin session first
      if (checkSuperAdminSession()) {
        return;
      }

      // If not SuperAdmin via session, fetch role from database
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            "x-user-id": firebaseUser.uid,
          },
        });
        const result = await response.json();
        console.log("User role API response:", result);
        if (result.success && result.data && result.data.role) {
          const role = result.data.role.toLowerCase();
          console.log("Setting user role to:", role);
          setUserRole(role);
          setIsAdmin(role === "admin" || role === "superadmin");
          setIsSuperAdmin(role === "superadmin");
        } else {
          console.log("No role found, setting default user role");
          setUserRole("user");
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("user");
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
    },
    [checkSuperAdminSession]
  );

  useEffect(() => {
    // Check for SuperAdmin session on mount
    if (checkSuperAdminSession()) {
      setLoading(false);
      return;
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser?.email);
      setUser(firebaseUser);
      fetchUserRole(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [checkSuperAdminSession, fetchUserRole]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const result = await firebaseSignInWithGoogle();

      // Get additional profile information from Google
      const profileData = {
        uid: result.uid,
        email: result.email,
        name: result.displayName,
        photoURL: result.photoURL,
        // Additional profile fields
        firstName: result.displayName?.split(' ')[0] || '',
        lastName: result.displayName?.split(' ').slice(1).join(' ') || '',
        emailVerified: result.emailVerified || false,
        phoneNumber: result.phoneNumber || null,
        // Get additional info from browser
        locale: navigator.language || 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };

      // Create or update user in database
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user in database");
      }

      // Manually trigger user role fetch after successful sign-in
      await fetchUserRole(result);

      // Force a small delay to ensure state updates
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchUserRole]);

  const signOutUser = useCallback(async () => {
    try {
      console.log("Starting sign out process...");
      
      // Clear SuperAdmin session
      localStorage.removeItem("superAdminUser");

      // Sign out from Firebase
      await firebaseSignOut();
      
      console.log("Firebase sign out completed");
      
      // Force page reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error("Sign-Out Error:", error);
      // Even if there's an error, try to clear local state and reload
      localStorage.removeItem("superAdminUser");
      window.location.reload();
    }
  }, []);

  const updateUserRole = useCallback(
    (role: "superadmin" | "admin" | "user" | "guest") => {
      setUserRole(role);
      setIsAdmin(role === "admin" || role === "superadmin");
      setIsSuperAdmin(role === "superadmin");
    },
    []
  );

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
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

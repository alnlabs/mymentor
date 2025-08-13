"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Loading } from "@/shared/components/Loading";

export default function StudentPage() {
  const {
    user,
    loading: authLoading,
    isAdmin,
    isSuperAdmin,
  } = useAuthContext();

  // Debug logging
  console.log("Student page - User:", user?.email);
  console.log("Student page - isAdmin:", isAdmin);
  console.log("Student page - isSuperAdmin:", isSuperAdmin);
  console.log("Student page - Auth Loading:", authLoading);

  // Handle redirects
  useEffect(() => {
    if (!authLoading) {
      if (!user && !isSuperAdmin) {
        console.log("Student page: Not authenticated, redirecting to homepage");
        window.location.href = "/";
      } else if ((isAdmin || isSuperAdmin) && user) {
        console.log(
          "Student page: Admin/SuperAdmin detected, redirecting to admin"
        );
        window.location.href = "/admin";
      } else if (user && !isAdmin && !isSuperAdmin) {
        console.log("Student page: Redirecting to student dashboard");
        window.location.href = "/student/dashboard";
      }
    }
  }, [user, authLoading, isAdmin, isSuperAdmin]);

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Loading size="lg" text="Redirecting..." />
    </div>
  );
}

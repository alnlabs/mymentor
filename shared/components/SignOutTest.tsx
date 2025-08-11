"use client";

import React from "react";
import { Button } from "./Button";
import { useAuthContext } from "./AuthContext";

export function SignOutTest() {
  const { user, signOutUser } = useAuthContext();

  const handleSignOut = async () => {
    console.log("SignOutTest: Sign out button clicked");
    console.log("SignOutTest: Current user:", user);
    console.log("SignOutTest: User email:", user?.email);
    console.log("SignOutTest: User display name:", user?.displayName);

    try {
      console.log("SignOutTest: Calling signOutUser function...");
      await signOutUser();
      console.log("SignOutTest: Sign out completed");
    } catch (error) {
      console.error("SignOutTest: Sign out error:", error);
    }
  };

  if (!user) {
    return <div>No user logged in</div>;
  }

  return (
    <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
      <h3 className="font-bold text-red-800 mb-2">Sign Out Test</h3>
      <p className="text-red-700 mb-2">User: {user.email || user.name}</p>
      <Button onClick={handleSignOut} variant="danger" size="sm">
        Test Sign Out
      </Button>
    </div>
  );
}

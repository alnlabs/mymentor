'use client';

import React from 'react';
import { Button } from './Button';
import { useAuthContext } from './AuthContext';
import { Loading } from './Loading';

export const AuthButton: React.FC = () => {
  const { user, loading, signInWithGoogle, signOut } = useAuthContext();

  const handleAuth = async () => {
    try {
      if (user) {
        await signOut();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  if (loading) {
    return <Loading size="sm" text="" />;
  }

  return (
    <Button
      onClick={handleAuth}
      variant={user ? 'outline' : 'primary'}
      size="sm"
    >
      {user ? `Sign Out (${user.displayName})` : 'Sign In with Google'}
    </Button>
  );
};

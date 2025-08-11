'use client';

import React from 'react';
import { Button } from './Button';
import { useAuthContext } from './AuthContext';

interface AuthButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AuthButton({ className = '', size = 'md' }: AuthButtonProps) {
  const { user, loading, signInWithGoogle, signOutUser } = useAuthContext();

  const handleClick = async () => {
    if (user) {
      await signOutUser();
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={className}
      size={size}
    >
      {user ? `Sign Out (${user.name || 'User'})` : 'Sign In with Google'}
    </Button>
  );
}

'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { useAuthContext } from './AuthContext';

interface NavigationProps {
  onSignOut?: () => void;
  onSuperAdminLogin?: () => void;
}

export function Navigation({ onSignOut, onSuperAdminLogin }: NavigationProps) {
  const { user, isAdmin, isSuperAdmin } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MyMentor
            </h1>
          </div>
          
          {/* Desktop Navigation Menu */}
          {(user || isSuperAdmin) && (
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </a>
              {(isAdmin || isSuperAdmin) && (
                <a
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1"
                >
                  <span>⚙️</span>
                  <span>Admin Panel</span>
                </a>
              )}
            </nav>
          )}
          
          {/* Mobile menu button */}
          {(user || isSuperAdmin) && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user || isSuperAdmin ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {isSuperAdmin ? 'S' : (user?.name?.charAt(0) || 'U')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium hidden sm:block">
                    {isSuperAdmin ? 'SuperAdmin' : (user?.name || 'User')}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSignOut}
                >
                  Sign Out
                </Button>
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/admin'}
                  >
                    Admin Panel
                  </Button>
                )}
                {!isSuperAdmin && onSuperAdminLogin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onSuperAdminLogin}
                  >
                    Switch to SuperAdmin
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (user || isSuperAdmin) && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              {(isAdmin || isSuperAdmin) && (
                <a
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium flex items-center space-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>⚙️</span>
                  <span>Admin Panel</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

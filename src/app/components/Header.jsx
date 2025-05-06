"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Cog6ToothIcon, UserCircleIcon, SunIcon, MoonIcon, ArrowRightOnRectangleIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Recruiter",
    avatar: "AJ"
  };

  return (
    <header className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center">
        <Link href="/" className="flex items-center text-xl font-semibold text-brand-purple dark:text-purple-400">
          <span className="mr-2">💫</span> SearchWizard
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
        <Link href="/settings" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Cog6ToothIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </Link>
        
        {/* User profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium">
              {user.avatar}
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {profileOpen && (
            <div 
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700"
              role="menu"
              aria-orientation="vertical"
              style={{
                transform: 'none',  /* Safari fix */
                WebkitTransform: 'none',  /* Safari fix */
                display: 'block',  /* Safari fix */
                visibility: 'visible'  /* Safari fix */
              }}
            >
              {/* User info section */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-900 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-200">
                    {user.role}
                  </span>
                </div>
              </div>
              
              {/* Menu items */}
              <div className="py-1">
                <Link 
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserIcon className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Your Profile
                </Link>
                <Link 
                  href="/settings/account"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <Cog6ToothIcon className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Account Settings
                </Link>
              </div>
              
              {/* Logout section */}
              <div className="py-1">
                <Link 
                  href="/logout"
                  className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 text-red-500 dark:text-red-400" />
                  Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

interface AdminHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function AdminHeader({ onMenuClick, isSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600 sm:h-8 sm:w-8">
            <span className="text-lg font-bold text-white sm:text-xl">A</span>
          </div>
          <span className="hidden text-lg font-semibold text-gray-900 dark:text-white sm:block sm:text-xl">Admin</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          aria-label="Notifications"
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 sm:h-8 sm:w-8"></div>
      </div>
    </header>
  );
}


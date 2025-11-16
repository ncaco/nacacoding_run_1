'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';
import { isTokenExpired, logout } from '../../utils/auth';

interface AdminHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function AdminHeader({ onMenuClick, isSidebarOpen }: AdminHeaderProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const profileRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 프로필 정보 가져오기 함수
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        // 토큰이 없으면 localStorage에서 기본 정보만 가져오기
        const adminUsername = localStorage.getItem('adminUsername');
        if (adminUsername) {
          setUsername(adminUsername);
          setEmail(`${adminUsername}@admin.com`);
          setName(adminUsername);
          setAvatarUrl('');
        }
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/auth/profile/admin', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // 401 오류 발생 시 자동 로그아웃
      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const user = data.data;
        setUsername(user.username || '');
        setEmail(user.email || `${user.username || ''}@admin.com`);
        setName(user.name || user.username || '');
        setAvatarUrl(user.avatarUrl || '');
      } else {
        // API 실패 시 localStorage에서 가져오기
        const adminUsername = localStorage.getItem('adminUsername');
        if (adminUsername) {
          setUsername(adminUsername);
          setEmail(`${adminUsername}@admin.com`);
          setName(adminUsername);
          setAvatarUrl('');
        }
      }
    } catch (error) {
      console.error('프로필 조회 실패:', error);
      // 에러 발생 시 localStorage에서 가져오기
      const adminUsername = localStorage.getItem('adminUsername');
      if (adminUsername) {
        setUsername(adminUsername);
        setEmail(`${adminUsername}@admin.com`);
        setName(adminUsername);
        setAvatarUrl('');
      }
    }
  }, [router]);

  useEffect(() => {
    // 초기 프로필 정보 가져오기
    fetchProfile();

    // 프로필 업데이트 이벤트 리스너
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [fetchProfile]);

  useEffect(() => {
    // 외부 클릭 시 모달 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        // 로그아웃 API 호출
        await fetch('http://localhost:8080/api/v1/auth/logout/admin', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // 로컬 스토리지에서 토큰 및 사용자 정보 제거
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('userRole');

      // 로그인 페이지로 리다이렉트
      router.push('/admin/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 스토리지는 정리하고 리다이렉트
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('userRole');
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

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

      <div className="relative flex items-center gap-2 sm:gap-4">
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
        
        {/* 프로필 버튼 및 드롭다운 */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-600 transition-all hover:ring-2 hover:ring-green-500 hover:ring-offset-2 dark:ring-offset-gray-900 sm:h-8 sm:w-8"
            aria-label="Profile menu"
            aria-expanded={isProfileOpen}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="프로필"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-sm font-semibold text-white sm:text-base">${(name || username) ? (name || username).charAt(0).toUpperCase() : 'A'}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-sm font-semibold text-white sm:text-base">
                {(name || username) ? (name || username).charAt(0).toUpperCase() : 'A'}
              </span>
            )}
          </button>

          {/* 프로필 드롭다운 모달 */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              {/* 사용자 정보 섹션 */}
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-400 to-green-600">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="프로필"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-base font-semibold text-white">${(name || username) ? (name || username).charAt(0).toUpperCase() : 'A'}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-base font-semibold text-white">
                        {(name || username) ? (name || username).charAt(0).toUpperCase() : 'A'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {name || username || '관리자'}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {email || 'admin@example.com'}
                    </p>
                    {username && (
                      <p className="truncate text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        ID: {username}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 메뉴 항목 */}
              <div className="py-1">
                <Link
                  href="/admin/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>마이페이지</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>설정</span>
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>로그아웃 중...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>로그아웃</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


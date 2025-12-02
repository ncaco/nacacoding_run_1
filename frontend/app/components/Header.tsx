'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { getApiUrl } from '../utils/api';
import { isTokenExpired } from '../utils/auth';

interface Site {
  id: string;
  siteName: string;
  siteType?: string;
  contextPath?: string;
}

interface Menu {
  id: string;
  name: string;
  url?: string;
  parentId?: string;
  displayOrder?: number;
}

interface HeaderProps {
  onMenuLoadComplete?: () => void;
}

export default function Header({ onMenuLoadComplete }: HeaderProps = {} as HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // 로그인 상태 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || isTokenExpired(token)) {
      // 만료되었거나 없는 토큰은 정리
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      setLoggedInUsername(null);
      return;
    }

    setLoggedInUsername(username || null);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        // 백엔드 로그아웃 호출 (토큰 블랙리스트 처리)
        await fetch(getApiUrl('/auth/logout/user'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // 로그아웃 요청 실패는 무시하고 클라이언트 상태만 정리
      console.error('포털 로그아웃 실패:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
      }
      setLoggedInUsername(null);
      router.push('/');
    }
  };

  // 메뉴가 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // 프로필 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    } else {
      window.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // 통합홈페이지 메뉴 목록 가져오기 (로그인 시 MEMBER 권한, 아니면 비회원 권한)
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoadingMenus(true);
        
        // 1. contextPath로 통합홈페이지 조회 (빈 문자열은 "root"로 인코딩)
        const contextPath = '';
        const contextPathParam = contextPath === '' ? 'root' : encodeURIComponent(contextPath);
        const siteResponse = await fetch(getApiUrl(`/site/context-path/${contextPathParam}`), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!siteResponse.ok) {
          setIsLoadingMenus(false);
          if (onMenuLoadComplete) onMenuLoadComplete();
          return;
        }

        const siteData = await siteResponse.json();
        if (!siteData.success || !siteData.data) {
          setIsLoadingMenus(false);
          if (onMenuLoadComplete) onMenuLoadComplete();
          return;
        }

        const integratedHomepage: Site = siteData.data;

        // 2. 로그인 여부에 따라 Authorization 헤더 포함하여 메뉴 목록 조회
        let authToken: string | null = null;
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('token');
          if (storedToken && !isTokenExpired(storedToken)) {
            authToken = storedToken;
          }
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          (headers as Record<string, string>).Authorization = `Bearer ${authToken}`;
        }

        const menusResponse = await fetch(
          getApiUrl(`/menu/site/${integratedHomepage.id}/enabled/with-permissions`),
          {
            method: 'GET',
            headers,
          }
        );

        if (!menusResponse.ok) {
          setIsLoadingMenus(false);
          if (onMenuLoadComplete) onMenuLoadComplete();
          return;
        }

        const menusData = await menusResponse.json();
        if (!menusData.success) {
          setIsLoadingMenus(false);
          if (onMenuLoadComplete) onMenuLoadComplete();
          return;
        }

        const menus: Menu[] = menusData.data || [];
        // 부모 메뉴만 필터링 (displayOrder로 정렬)
        const parentMenus = menus
          .filter((menu) => !menu.parentId)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        
        setMenuItems(parentMenus);
      } catch (error) {
        // 에러 발생 시 빈 배열로 설정
        setMenuItems([]);
      } finally {
        setIsLoadingMenus(false);
        if (onMenuLoadComplete) onMenuLoadComplete();
      }
    };

    fetchMenus();
  }, [onMenuLoadComplete]);

  return (
    <>
      {/* Mobile Menu Overlay - 헤더 밖으로 이동하여 레이아웃 문제 해결 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ease-in-out md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu - 헤더 밖으로 이동하여 레이아웃 문제 해결 */}
      <div
        className={`fixed top-0 right-0 z-[70] h-screen w-72 max-w-[80vw] transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Menu Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-gradient-to-r from-green-50 to-white px-5 dark:border-gray-800 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-950 dark:!from-gray-900 dark:!to-gray-950">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600">
                <span className="text-xl font-bold text-white">P</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">메뉴</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="px-3 py-4">
              {menuItems.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {menuItems.map((menu) => (
                    <Link
                      key={menu.id}
                      href={menu.url || '#'}
                      className="group flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium text-gray-700 transition-all hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-green-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-green-600 dark:text-gray-500 dark:group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{menu.name}</span>
                    </Link>
                  ))}
                </div>
              ) : isLoadingMenus ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
                </div>
              ) : null}
            </div>

            {/* Mobile Menu Footer */}
            <div className="mt-auto border-t border-gray-200 bg-gray-50 px-3 py-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 shadow-sm dark:bg-gray-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">다크 모드</span>
                  <ThemeToggle />
                </div>
                {loggedInUsername ? (
                  <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-sm font-semibold text-white">
                        {loggedInUsername.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {loggedInUsername}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">포털 회원</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="ml-3 rounded-md px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>로그인</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:from-green-500 hover:to-green-700 hover:shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>시작하기</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-900/50 dark:bg-gray-950/90 dark:backdrop-blur-md md:z-50">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {menuItems.length > 0 ? (
              menuItems.map((menu) => (
                <Link
                  key={menu.id}
                  href={menu.url || '#'}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  {menu.name}
                </Link>
              ))
            ) : isLoadingMenus ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
              </div>
            ) : null}
          </div>

          {/* Auth / Profile Area */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            {loggedInUsername ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                  aria-label="Profile menu"
                  aria-expanded={isProfileOpen}
                >
                  {loggedInUsername.charAt(0).toUpperCase()}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900/95">
                    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-sm font-semibold text-white">
                          {loggedInUsername.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {loggedInUsername}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            포털 회원
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>마이페이지</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-2.5 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-green-700"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>
    </>
  );
}


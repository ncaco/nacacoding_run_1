'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getApiUrl } from '../../utils/api';

interface SubMenuItem {
  name: string;
  href: string;
  description?: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  description?: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: '대시보드',
    href: '/admin',
    description: '시스템 개요 및 통계를 확인하세요.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: '사이트 관리',
    href: '/admin/sites',
    description: '사이트를 생성, 수정, 삭제할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    name: '메뉴 관리',
    href: '/admin/menus',
    description: '메뉴를 생성, 수정, 삭제할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    ),
  },
  {
    name: '관리자 관리',
    href: '/admin/admins',
    description: '관리자를 생성, 수정, 삭제할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    name: '사용자 관리',
    href: '/admin/users',
    description: '사용자를 생성, 수정, 삭제할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    name: '공통코드 관리',
    href: '/admin/cmn-cd',
    description: '공통코드를 생성, 수정, 삭제할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    name: '아이콘 관리',
    href: '/admin/icons',
    description: '아이콘을 생성, 수정, 삭제할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    ),
  },
  {
    name: '파일 관리',
    href: '/admin/files',
    description: '파일을 업로드, 다운로드, 삭제할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: '로그 관리',
    href: '/admin/logs',
    description: '로그를 조회하고 추가할 수 있습니다.',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export { menuItems };

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ⌘K 단축키로 검색 열기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isCollapsed) {
          setShowSearch(true);
          setTimeout(() => searchInputRef.current?.focus(), 0);
        } else {
          searchInputRef.current?.focus();
        }
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        if (isCollapsed) {
          setShowSearch(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName) ? prev.filter((name) => name !== menuName) : [...prev, menuName]
    );
  };

  const handleMenuItemHover = (menuName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isCollapsed) {
      const menuItem = menuItems.find((item) => item.name === menuName);
      if (menuItem?.subItems && menuItem.subItems.length > 0) {
        const rect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({
          top: rect.top,
          left: rect.right + 8,
        });
        setHoveredMenuItem(menuName);
      }
    }
  };

  const handleMenuItemLeave = () => {
    setTimeout(() => {
      if (!document.querySelector('.floating-dropdown:hover')) {
        setHoveredMenuItem(null);
      }
    }, 100);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        await fetch(getApiUrl('/auth/logout/admin'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('userRole');

      router.push('/admin/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('userRole');
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 검색 필터링
  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subItems?.some((sub) => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ease-in-out lg:hidden"
          onClick={onClose}
          aria-hidden="true"
          style={{ zIndex: 30 }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen transform overflow-hidden bg-white transition-all duration-300 ease-in-out dark:bg-[#0f1119] ${
          // 모바일: fixed, 데스크톱: static (레이아웃에 포함)
          'fixed left-0 top-0 z-40 lg:static lg:z-auto'
        } ${
          // 너비: 모바일에서는 항상 설정, 데스크톱에서는 열려있을 때만
          isOpen 
            ? `${isCollapsed ? 'w-14' : 'w-56'} lg:shrink-0`
            : '-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden'
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-12 items-center justify-between border-b border-gray-200 px-3 dark:border-[#1f2435]">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100">
                <svg className="h-3 w-3 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7-7 7 7" />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="overflow-hidden text-sm font-semibold text-gray-900 dark:text-white">
                  <span className="block truncate whitespace-nowrap">Admin</span>
                </span>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={onToggleCollapse}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#141827] dark:hover:text-white"
                aria-label="Collapse sidebar"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Search Bar */}
          {!isCollapsed && (
            <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-8 pr-14 text-xs text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none dark:border-transparent dark:bg-[#1a1e2c] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650] dark:focus:bg-[#1f2435]"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <kbd className="hidden rounded border border-gray-300 bg-white px-1 py-0.5 text-[10px] font-semibold text-gray-500 sm:inline-block dark:border-[#303650] dark:bg-[#1a1e2c] dark:text-gray-400">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed: Toggle Button and Search Icon */}
          {isCollapsed && (
            <div className="space-y-1.5 border-b border-gray-200 px-1.5 py-2 dark:border-[#1f2435]">
              <button
                onClick={onToggleCollapse}
                className="flex w-full items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#1a1e2c] dark:hover:text-white"
                aria-label="Expand sidebar"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  setShowSearch(true);
                  setTimeout(() => searchInputRef.current?.focus(), 0);
                }}
                className="flex w-full items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#1a1e2c] dark:hover:text-white"
                aria-label="Search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2 py-2 scrollbar-hide">
            {filteredMenuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus.includes(item.name);
              const isHovered = hoveredMenuItem === item.name;

              return (
                <div key={item.href} className="relative">
                  {hasSubItems ? (
                    <>
                      {isCollapsed ? (
                        <button
                          onMouseEnter={(e) => handleMenuItemHover(item.name, e)}
                          onMouseLeave={handleMenuItemLeave}
                          className={`group relative flex w-full items-center justify-center rounded-lg px-1.5 py-2.5 text-xs font-medium transition-all duration-200 sidebar-menu-item ${
                            isActive
                              ? 'bg-gray-100 text-gray-900 dark:text-white sidebar-menu-item-selected shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1a1e2c] dark:hover:text-white'
                          }`}
                          title={item.name}
                        >
                          <span className={`shrink-0 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            <div className="h-4 w-4">{item.icon}</div>
                          </span>
                          {item.badge && (
                            <span className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 text-[9px] font-semibold text-white">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleMenu(item.name)}
                            className={`group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-xs font-medium transition-all duration-200 sidebar-menu-item ${
                              isActive
                                ? 'bg-gray-100 text-gray-900 dark:text-white sidebar-menu-item-selected shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1a1e2c] dark:hover:text-white'
                            }`}
                          >
                            <span className={`shrink-0 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              <div className="h-4 w-4">{item.icon}</div>
                            </span>
                            <span className="flex-1 overflow-hidden text-left">
                              <span className="block truncate whitespace-nowrap">{item.name}</span>
                            </span>
                            {item.badge && (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-semibold text-white">
                                {item.badge}
                              </span>
                            )}
                            <svg
                              className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {isExpanded && (
                            <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-200 pl-3 dark:border-[#1f2435]">
                              {item.subItems?.map((subItem) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    onClick={handleLinkClick}
                                    className={`block rounded-lg px-2.5 py-2 text-xs transition-all duration-200 sidebar-menu-item ${
                                      isSubActive
                                        ? 'bg-gray-100 text-gray-900 dark:text-white sidebar-menu-item-selected shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#1a1e2c] dark:hover:text-white'
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-xs font-medium transition-all duration-200 sidebar-menu-item ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 dark:text-white sidebar-menu-item-selected shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1a1e2c] dark:hover:text-white'
                      } ${isCollapsed ? 'justify-center px-1.5' : ''}`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        <div className="h-4 w-4">{item.icon}</div>
                      </span>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 overflow-hidden">
                            <span className="block truncate whitespace-nowrap">{item.name}</span>
                          </span>
                          {item.badge && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-semibold text-white">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && item.badge && (
                        <span className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 text-[9px] font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Floating Dropdown for Collapsed Mode */}
                  {isCollapsed && hasSubItems && isHovered && (
                    <div
                      className="floating-dropdown fixed z-50 min-w-[180px] rounded-lg border border-gray-200 bg-white shadow-xl dark:border-[#1f2435] dark:bg-[#141827]"
                      style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                      }}
                      onMouseEnter={() => setHoveredMenuItem(item.name)}
                      onMouseLeave={() => setHoveredMenuItem(null)}
                    >
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {item.name}
                      </div>
                      <div className="border-t border-gray-200 dark:border-[#1f2435]">
                        {item.subItems?.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => {
                                handleLinkClick();
                                setHoveredMenuItem(null);
                              }}
                              className={`block px-3 py-2.5 text-sm transition-all duration-200 first:rounded-t-lg last:rounded-b-lg sidebar-menu-item ${
                                isSubActive
                                  ? 'bg-gray-100 text-gray-900 dark:text-white sidebar-menu-item-selected shadow-sm'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1a1e2c] dark:hover:text-white'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Support Section */}
          {!isCollapsed && (
            <div className="border-t border-gray-200 px-3 py-3 dark:border-[#1f2435]">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#1a1e2c]">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">Need support?</span>
                </div>
                <p className="mb-2 text-[10px] text-gray-600 dark:text-gray-400">
                  Get in touch with our agents
                </p>
                <button className="w-full rounded-lg bg-white px-2 py-1.5 text-[10px] font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 dark:bg-[#0f1119] dark:text-white dark:hover:bg-[#1f2435]">
                  Contact us
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Search Modal (for collapsed mode) */}
      {showSearch && isCollapsed && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
            onClick={() => setShowSearch(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-[#1f2435] dark:bg-[#141827]">
              <div className="relative p-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none dark:border-transparent dark:bg-[#1a1e2c] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650] dark:focus:bg-[#1f2435]"
                  autoFocus
                />
              </div>
              {searchQuery && (
                <div className="max-h-64 overflow-y-auto border-t border-gray-200 p-2 dark:border-[#1f2435]">
                  {filteredMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                        handleLinkClick();
                      }}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1a1e2c]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

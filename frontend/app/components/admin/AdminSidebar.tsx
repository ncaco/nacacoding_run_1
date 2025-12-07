'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getApiUrl } from '../../_lib/api/client';
import { fetchWithTokenRefresh, logout } from '../../_lib/utils/auth';

interface SubMenuItem {
  id?: string;
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

interface Menu {
  id: string;
  siteId: string;
  name: string;
  url?: string;
  icon?: string;
  displayOrder: number;
  parentId?: string;
  enabled?: boolean;
}

interface Site {
  id: string;
  siteType: string;
  siteName: string;
  contextPath?: string;
  enabled?: boolean;
}

interface Icon {
  id: string;
  iconId: string;
  name: string;
  svgCode: string;
  enabled?: boolean;
}

// 기본 아이콘 (아이콘이 없을 때 사용) - 사각형 박스
const DefaultIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 5h14v14H5z"
    />
  </svg>
);

// SVG 코드를 React 컴포넌트로 변환
const renderIcon = (svgCode?: string): React.ReactNode => {
  if (!svgCode) {
    return DefaultIcon;
  }

  // SVG path 데이터인 경우 (일반적인 SVG path 패턴)
  if (svgCode.match(/^[MLHVCSQTAZmlhvcsqtaz0-9\s,.-]+$/)) {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={svgCode} />
      </svg>
    );
  }

  // 전체 SVG 코드인 경우 (dangerouslySetInnerHTML 사용)
  try {
    return <div className="h-4 w-4" dangerouslySetInnerHTML={{ __html: svgCode }} />;
  } catch {
    return DefaultIcon;
  }
};

// 메뉴를 계층 구조로 변환
const buildMenuHierarchy = (menus: Menu[], iconsMap: Map<string, Icon>): MenuItem[] => {
  // displayOrder로 정렬
  const sortedMenus = [...menus].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  
  // 부모 메뉴와 자식 메뉴 분리
  const parentMenus = sortedMenus.filter((menu) => !menu.parentId);
  const childMenus = sortedMenus.filter((menu) => menu.parentId);

  // MenuItem으로 변환
  const menuItems: MenuItem[] = parentMenus.map((menu) => {
    const subItems = childMenus
      .filter((child) => child.parentId === menu.id)
      .map((child) => ({
        id: child.id,
        name: child.name,
        href: child.url || '#',
        description: undefined,
      }));

    // 메뉴의 icon 필드(ICON_CD)로 아이콘 찾기
    const icon = menu.icon ? iconsMap.get(menu.icon) : null;
    const iconSvgCode = icon?.svgCode;

    return {
      name: menu.name,
      href: menu.url || '#',
      icon: renderIcon(iconSvgCode),
      description: undefined,
      subItems: subItems.length > 0 ? subItems : undefined,
    };
  });

  return menuItems;
};

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [, setIsLoggingOut] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);

  // 메뉴 목록 가져오기
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoadingMenus(true);
        
        // 1. 사이트 목록 조회
        const sitesResponse = await fetchWithTokenRefresh(getApiUrl('/site'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (sitesResponse.status === 401) {
          logout(router);
          return;
        }

        const sitesData = await sitesResponse.json();
        if (!sitesResponse.ok || !sitesData.success) {
          return;
        }

        const sites: Site[] = sitesData.data || [];
        // contextPath가 "admin"인 사이트 찾기
        const adminSite = sites.find((site) => site.contextPath === 'admin');
        
        if (!adminSite) {
          return;
        }

        // 2. 아이콘 목록 조회 (병렬 처리)
        const iconsResponse = await fetchWithTokenRefresh(getApiUrl('/icon/enabled'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let iconsMap = new Map<string, Icon>();
        if (iconsResponse.status !== 401) {
          const iconsData = await iconsResponse.json();
          if (iconsResponse.ok && iconsData.success) {
            const icons: Icon[] = iconsData.data || [];
            // iconId(ICON_CD)를 키로 하는 맵 생성
            iconsMap = new Map(icons.map((icon) => [icon.iconId, icon]));
          }
        }

        // 3. 백엔드에서 권한 기반으로 필터링된 활성화된 메뉴 목록 조회
        const menusResponse = await fetchWithTokenRefresh(
          getApiUrl(`/menu/site/${adminSite.id}/enabled/with-permissions`),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (menusResponse.status === 401) {
          logout(router);
          return;
        }

        const menusData = await menusResponse.json();
        if (!menusResponse.ok || !menusData.success) {
          return;
        }

        const menus: Menu[] = menusData.data || [];

        // 4. 메뉴를 계층 구조로 변환 (아이콘 맵 전달)
        const menuItemsData = buildMenuHierarchy(menus, iconsMap);
        setMenuItems(menuItemsData);
      } catch {
        // 에러 발생 시 빈 메뉴 목록 설정
        setMenuItems([]);
      } finally {
        setIsLoadingMenus(false);
      }
    };

    fetchMenus();
  }, [router]);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <Link href="/admin" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
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
            </Link>
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

          {/* Collapsed: Toggle Button */}
          {isCollapsed && (
            <div className="border-b border-gray-200 px-1.5 py-2 dark:border-[#1f2435]">
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
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2 py-2 scrollbar-hide">
            {isLoadingMenus ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-400"></div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
                메뉴가 없습니다.
              </div>
            ) : (
              menuItems.map((item) => {
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
                                    key={subItem.id || subItem.href}
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
                              key={subItem.id || subItem.href}
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
              })
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}

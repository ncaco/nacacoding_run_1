'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { isTokenExpired, logout, decodeJWT, refreshAccessToken } from '../../utils/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  
  // localStorage에서 사이드바 상태 복원 (기본값: true)
  const getInitialSidebarState = (): boolean => {
    if (typeof window === 'undefined') return true;
    // 모바일에서는 항상 닫힌 상태
    if (window.innerWidth < 1024) return false;
    const saved = localStorage.getItem('adminSidebarOpen');
    if (saved === null) return true; // 기본값
    return saved === 'true';
  };
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => getInitialSidebarState());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved === 'true';
  });
  const [isChecking, setIsChecking] = useState(true);

  // 로그인 상태 확인 및 토큰 만료 체크
  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        // 로그인 안되어 있으면 로그인 페이지로 리다이렉트
        router.push('/admin/login');
        return;
      }
      
      // 토큰 만료 확인
      if (isTokenExpired(adminToken)) {
        // 토큰이 만료되었으면 Refresh Token으로 갱신 시도
        const newToken = await refreshAccessToken();
        if (!newToken) {
          // Refresh Token으로 갱신 실패 시 자동 로그아웃
          logout(router);
          return;
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // 토큰 만료 전 자동 갱신 (만료 5분 전)
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    // 토큰 만료 시간 확인
    const decoded = decodeJWT(adminToken);
    if (!decoded || !decoded.exp) return;

    const expirationTime = decoded.exp * 1000;
    const now = Date.now();
    const timeUntilExpiration = expirationTime - now;
    const refreshBeforeExpiration = 5 * 60 * 1000; // 5분 전

    if (timeUntilExpiration <= 0) {
      // 이미 만료된 경우 Refresh Token으로 갱신 시도
      refreshAccessToken().then((newToken) => {
        if (!newToken) {
          logout(router);
        }
      });
      return;
    }

    // 만료 5분 전에 자동 갱신
    const refreshTime = Math.max(0, timeUntilExpiration - refreshBeforeExpiration);
    const refreshTimeoutId = setTimeout(async () => {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        // Refresh Token으로 갱신 실패 시 로그아웃
        logout(router);
      }
    }, refreshTime);

    // 만료 시간에 맞춰 로그아웃 (Refresh Token도 만료된 경우)
    const logoutTimeoutId = setTimeout(() => {
      logout(router);
    }, timeUntilExpiration);

    return () => {
      clearTimeout(refreshTimeoutId);
      clearTimeout(logoutTimeoutId);
    };
  }, [router]);

  useEffect(() => {
    // 모바일에서는 기본적으로 사이드바를 닫음
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        localStorage.setItem('adminSidebarOpen', 'false');
      } else {
        // 데스크톱에서는 저장된 상태 복원
        const saved = localStorage.getItem('adminSidebarOpen');
        if (saved !== null) {
          setIsSidebarOpen(saved === 'true');
        }
      }
    };

    // 초기 설정
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
      localStorage.setItem('adminSidebarOpen', 'false');
    } else {
      // 데스크톱에서는 저장된 상태 사용
      const saved = localStorage.getItem('adminSidebarOpen');
      if (saved !== null) {
        setIsSidebarOpen(saved === 'true');
      }
    }

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 사이드바 상태 변경 시 localStorage에 저장
  useEffect(() => {
    // 모바일이 아닐 때만 저장 (모바일에서는 항상 닫힘)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      localStorage.setItem('adminSidebarOpen', isSidebarOpen.toString());
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    // 즉시 localStorage에 저장
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      localStorage.setItem('adminSidebarOpen', newState.toString());
    }
  };

  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', newState.toString());
  };

  // 로그인 상태 확인 중일 때는 로딩 표시
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 animate-spin text-green-600"
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
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden border-t border-x border-gray-200 dark:border-gray-800 scrollbar-hide">{children}</main>
      </div>
    </div>
  );
}


'use client';

import { useState, ReactNode, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // 모바일에서는 기본적으로 사이드바를 닫음
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'
        }`}
      >
        <AdminHeader onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 scrollbar-hide">{children}</main>
      </div>
    </div>
  );
}


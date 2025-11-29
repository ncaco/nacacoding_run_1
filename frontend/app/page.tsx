'use client';

import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';

export default function Home() {
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  const handleMenuLoadComplete = () => {
    setIsMenuLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* 전체 화면 로딩 오버레이 */}
      {isMenuLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-green-600 dark:border-gray-600 dark:border-t-green-400"></div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">메뉴를 불러오는 중...</p>
          </div>
        </div>
      )}
      
      <Header onMenuLoadComplete={handleMenuLoadComplete} />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

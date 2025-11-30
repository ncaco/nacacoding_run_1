'use client';

import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import PortalLoading from './components/PortalLoading';

export default function Home() {
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  const handleMenuLoadComplete = () => {
    setIsMenuLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      {/* 전체 화면 로딩 오버레이 */}
      {isMenuLoading && <PortalLoading />}
      
      <Header onMenuLoadComplete={handleMenuLoadComplete} />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

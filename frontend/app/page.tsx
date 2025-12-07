'use client';

import { useState } from 'react';
import Header from './_components/layout/Header';
import Hero from './_components/layout/Hero';
import Features from './_components/layout/Features';
import Footer from './_components/layout/Footer';
import PortalLoading from './_components/ui/PortalLoading';

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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './_components/layout/Header';
import Features from './_components/layout/Features';
import Footer from './_components/layout/Footer';
import PortalLoading from './_components/ui/PortalLoading';

// Hero 섹션 컴포넌트 (모던한 디자인)
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-24 dark:bg-gray-950 sm:px-6 lg:px-8 lg:py-40">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-gray-100/50 to-transparent blur-3xl dark:from-gray-900/30"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-gray-100/50 to-transparent blur-3xl dark:from-gray-900/30"></div>
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        {/* 배지 */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-gray-700 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/90 dark:text-gray-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-400 opacity-75 dark:bg-gray-400"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gray-600 dark:bg-gray-300"></span>
          </span>
          <span>지금 바로 시작하세요</span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl lg:text-7xl">
          주말에 구축하고,
          <br />
          <span className="text-gray-900 dark:text-gray-50">
            수백만으로 확장하세요
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
          포털은 애플리케이션을 구축하기 위한 현대적인 플랫폼입니다. 인증, API, 파일 저장소 등을 포함하여
          프로젝트를 시작하세요.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-gray-800 hover:shadow-2xl hover:scale-105 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            프로젝트 시작하기
          </Link>
          <Link
            href="/docs"
            className="rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700/50 dark:bg-gray-900/50 dark:text-gray-50 dark:hover:border-gray-600/50 dark:hover:bg-gray-800/50"
          >
            문서 보기
          </Link>
        </div>
        <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          세계에서 가장 혁신적인 기업들이 신뢰합니다
        </p>
      </div>
    </section>
  );
}

// Stats 섹션 컴포넌트
function Stats() {
  const stats = [
    { label: '활성 사용자', value: '10K+', description: '전 세계 사용자' },
    { label: 'API 호출', value: '1M+', description: '월간 처리량' },
    { label: '업타임', value: '99.9%', description: '안정적인 서비스' },
    { label: '만족도', value: '4.9/5', description: '고객 평가' },
  ];

  return (
    <section className="border-y border-gray-200 bg-gray-50 px-4 py-24 dark:border-gray-700/50 dark:bg-gray-900/50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-50 sm:text-6xl lg:text-7xl">
                {stat.value}
              </div>
              <div className="mt-4 text-base font-semibold text-gray-700 dark:text-gray-200">
                {stat.label}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA 섹션 컴포넌트
function CTA() {
  return (
    <section className="relative overflow-hidden bg-gray-900 px-4 py-24 dark:bg-gray-950 sm:px-6 lg:px-8">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]"></div>
      
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white dark:text-gray-50 sm:text-4xl lg:text-5xl">
          지금 바로 시작하세요
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300 dark:text-gray-300">
          몇 분 안에 프로젝트를 시작하고, 강력한 기능들을 활용해보세요.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-xl transition-all hover:bg-gray-100 hover:shadow-2xl hover:scale-105 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            무료로 시작하기
          </Link>
          <Link
            href="/docs"
            className="rounded-xl border-2 border-gray-700 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:border-gray-600 hover:bg-gray-800 hover:scale-105 dark:border-gray-600/50 dark:hover:border-gray-500/50 dark:hover:bg-gray-800/50"
          >
            문서 읽기
          </Link>
        </div>
      </div>
    </section>
  );
}

// 메인 홈페이지 컴포넌트
export default function Home() {
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  const handleMenuLoadComplete = () => {
    setIsMenuLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      {/* 전체 화면 로딩 오버레이 */}
      {isMenuLoading && <PortalLoading />}
      
      <Header onMenuLoadComplete={handleMenuLoadComplete} />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

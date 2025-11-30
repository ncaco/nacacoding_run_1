'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PortalLoading from '../components/PortalLoading';

const docsCategories = [
  {
    title: '시작하기',
    description: '포털을 시작하는 방법을 알아보세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    links: [
      { title: '빠른 시작 가이드', href: '/docs/quick-start' },
      { title: '설치 방법', href: '/docs/installation' },
      { title: '기본 개념', href: '/docs/concepts' },
    ],
  },
  {
    title: '인증',
    description: '사용자 인증 및 권한 관리에 대해 알아보세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    links: [
      { title: '사용자 인증', href: '/docs/auth/users' },
      { title: '역할 및 권한', href: '/docs/auth/roles' },
      { title: 'JWT 토큰', href: '/docs/auth/jwt' },
    ],
  },
  {
    title: 'API',
    description: 'RESTful API 사용 방법을 알아보세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    links: [
      { title: 'API 개요', href: '/docs/api/overview' },
      { title: '인증', href: '/docs/api/authentication' },
      { title: '엔드포인트 참조', href: '/docs/api/endpoints' },
    ],
  },
  {
    title: '파일 저장소',
    description: '파일 업로드 및 관리 방법을 알아보세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    links: [
      { title: '파일 업로드', href: '/docs/storage/upload' },
      { title: '파일 관리', href: '/docs/storage/management' },
      { title: '접근 제어', href: '/docs/storage/access' },
    ],
  },
  {
    title: '사이트 관리',
    description: '다중 사이트 관리 방법을 알아보세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
    links: [
      { title: '사이트 생성', href: '/docs/sites/create' },
      { title: '설정 관리', href: '/docs/sites/settings' },
      { title: '도메인 설정', href: '/docs/sites/domains' },
    ],
  },
  {
    title: '고급 기능',
    description: '고급 기능 및 최적화 방법을 알아보세요.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    links: [
      { title: '성능 최적화', href: '/docs/advanced/performance' },
      { title: '보안 설정', href: '/docs/advanced/security' },
      { title: '모니터링', href: '/docs/advanced/monitoring' },
    ],
  },
];

export default function DocsPage() {
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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              포털
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                문서
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 sm:text-xl">
              포털을 사용하여 애플리케이션을 구축하는 방법을 단계별로 알아보세요.
            </p>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="bg-gray-50 px-4 py-20 dark:bg-gray-800 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {docsCategories.map((category, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:shadow-gray-800/50"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  <ul className="mt-4 space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-sm text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                        >
                          → {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl bg-gradient-to-r from-green-50 to-white p-8 dark:from-gray-800 dark:to-gray-900">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">빠른 링크</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/docs/quick-start"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-green-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">빠른 시작</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">5분 안에 시작하기</p>
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-green-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">무료로 시작하기</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">지금 계정을 만들어보세요</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


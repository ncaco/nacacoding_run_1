'use client';

import Header from '../_components/layout/Header';
import Footer from '../_components/layout/Footer';
import PortalLoading from '../_components/ui/PortalLoading';
import { useState } from 'react';

export default function AboutPage() {
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
        {/* Hero Section - 다크모드 개선 */}
        <section className="relative overflow-hidden bg-linear-to-br from-green-50 via-white to-gray-50 px-4 py-24 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sm:px-6 lg:px-8 lg:py-32">
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 shadow-sm dark:bg-green-900/40 dark:text-green-300 dark:ring-1 dark:ring-green-800/50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              혁신적인 플랫폼
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              우리에 대해
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-600 dark:text-white">
              혁신적인 솔루션으로 더 나은 디지털 경험을 제공합니다. 
              <span className="font-semibold text-green-600 dark:text-green-400"> 사용자 중심</span>의 접근으로 
              개인과 기업의 성장을 지원합니다.
            </p>
          </div>
        </section>

        {/* Mission Section - 다크모드 개선 */}
        <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-4 inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm dark:bg-green-900/40 dark:text-green-300 dark:ring-1 dark:ring-green-800/50">
                  우리의 미션
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  더 나은 디지털 경험을 만들어갑니다
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
                  우리는 사용자 중심의 혁신적인 플랫폼을 구축하여 개인과 기업이 디지털 환경에서 
                  더 효율적으로 작업하고 성장할 수 있도록 지원합니다.
                </p>
                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-white">
                  최신 기술과 사용자 경험을 결합하여 실용적이고 확장 가능한 솔루션을 제공하며, 
                  지속적인 혁신을 통해 고객의 성공을 돕습니다.
                </p>
              </div>
              <div className="relative">
                <div className="rounded-2xl bg-linear-to-br from-green-100 to-green-50 p-8 shadow-xl ring-1 ring-green-200 dark:from-gray-800 dark:to-gray-800 dark:ring-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white shadow-md dark:bg-green-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">사용자 중심 설계</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-white">
                          모든 결정은 사용자의 경험을 최우선으로 합니다.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white shadow-md dark:bg-green-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">지속적인 혁신</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-white">
                          최신 기술 트렌드를 빠르게 적용합니다.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600 text-white shadow-md dark:bg-green-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">신뢰할 수 있는 서비스</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-white">
                          안정성과 보안을 최우선으로 합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - 다크모드 개선 */}
        <section className="bg-gray-50 px-4 py-20 dark:bg-gray-950 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-4 inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm dark:bg-green-900/40 dark:text-green-300 dark:ring-1 dark:ring-green-800/50">
                핵심 가치
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                우리의 가치
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-white">
                우리가 추구하는 핵심 가치들로 더 나은 서비스를 만들어갑니다.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: '혁신',
                  description: '최신 기술과 트렌드를 지속적으로 탐구하고 적용하여 더 나은 솔루션을 제공합니다.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  color: 'from-blue-500 to-cyan-500',
                  darkColor: 'dark:from-blue-400 dark:to-cyan-400',
                },
                {
                  title: '신뢰',
                  description: '투명하고 안정적인 서비스를 제공하여 사용자와의 신뢰를 구축합니다.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  color: 'from-green-500 to-emerald-500',
                  darkColor: 'dark:from-green-400 dark:to-emerald-400',
                },
                {
                  title: '사용자 중심',
                  description: '사용자의 니즈를 최우선으로 고려하여 직관적이고 편리한 경험을 제공합니다.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  color: 'from-purple-500 to-pink-500',
                  darkColor: 'dark:from-purple-400 dark:to-pink-400',
                },
                {
                  title: '품질',
                  description: '높은 품질 기준을 유지하며 지속적인 개선을 통해 완벽을 추구합니다.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  color: 'from-amber-500 to-orange-500',
                  darkColor: 'dark:from-amber-400 dark:to-orange-400',
                },
                {
                  title: '협업',
                  description: '팀워크와 열린 소통을 통해 더 큰 가치를 창출합니다.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  color: 'from-indigo-500 to-blue-500',
                  darkColor: 'dark:from-indigo-400 dark:to-blue-400',
                },
                {
                  title: '성장',
                  description: '지속적인 학습과 발전을 통해 개인과 조직의 성장을 도모합니다.',
                  icon: (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  color: 'from-green-500 to-teal-500',
                  darkColor: 'dark:from-green-400 dark:to-teal-400',
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900 dark:ring-gray-800 dark:hover:ring-gray-700"
                >
                  <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-linear-to-br ${value.color} ${value.darkColor} opacity-10 blur-2xl transition-opacity group-hover:opacity-20 dark:opacity-5 dark:group-hover:opacity-10`}></div>
                  <div className="relative">
                    <div className={`mb-4 inline-flex rounded-xl bg-linear-to-br ${value.color} ${value.darkColor} p-3 text-white shadow-lg transition-transform group-hover:scale-110`}>
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-gray-600 dark:text-white">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section - 다크모드 개선 */}
        <section className="bg-white px-4 py-20 dark:bg-gray-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-4 inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 shadow-sm dark:bg-green-900/40 dark:text-green-300 dark:ring-1 dark:ring-green-800/50">
                기술 스택
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                최신 기술로 구축
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-white">
                안정적이고 확장 가능한 플랫폼을 위한 검증된 기술들입니다.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { 
                  name: 'Next.js', 
                  description: 'React 기반의 현대적인 웹 프레임워크',
                  icon: '⚛️',
                  gradient: 'from-black to-gray-800',
                  darkGradient: 'dark:from-gray-700 dark:to-gray-900',
                },
                { 
                  name: 'Spring Boot', 
                  description: '엔터프라이즈급 Java 애플리케이션 프레임워크',
                  icon: '☕',
                  gradient: 'from-green-600 to-green-800',
                  darkGradient: 'dark:from-green-500 dark:to-green-700',
                },
                { 
                  name: 'PostgreSQL', 
                  description: '강력하고 확장 가능한 오픈소스 데이터베이스',
                  icon: '🐘',
                  gradient: 'from-blue-600 to-blue-800',
                  darkGradient: 'dark:from-blue-500 dark:to-blue-700',
                },
                { 
                  name: 'TypeScript', 
                  description: '타입 안정성을 제공하는 JavaScript 확장',
                  icon: '📘',
                  gradient: 'from-blue-500 to-cyan-500',
                  darkGradient: 'dark:from-blue-400 dark:to-cyan-400',
                },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-600"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${tech.gradient} ${tech.darkGradient} opacity-0 transition-opacity group-hover:opacity-5 dark:group-hover:opacity-10`}></div>
                  <div className="relative">
                    <div className="mb-4 text-4xl">{tech.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {tech.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-white">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - 다크모드 개선 */}
        <section className="bg-linear-to-br from-green-50 to-white px-4 py-20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: '만족한 사용자', value: '10,000+', icon: '👥' },
                { label: '처리된 요청', value: '1M+', icon: '⚡' },
                { label: '안정성', value: '99.9%', icon: '🛡️' },
                { label: '지원 언어', value: '5+', icon: '🌐' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md dark:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600"
                >
                  <div className="mb-3 text-3xl">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-white">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - 다크모드 개선 */}
        <section className="relative overflow-hidden bg-linear-to-r from-green-500 via-green-600 to-emerald-600 px-4 py-20 dark:from-green-600 dark:via-green-700 dark:to-emerald-700 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 dark:opacity-15">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              함께 성장해요
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-green-50 dark:text-green-50">
              더 나은 디지털 경험을 만들어가는 여정에 함께하세요. 
              지금 시작하고 무한한 가능성을 열어보세요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-green-600 shadow-xl transition-all hover:scale-105 hover:bg-gray-50 hover:shadow-2xl dark:bg-white dark:text-green-600 dark:hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                시작하기
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/80 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20 dark:border-white/80 dark:bg-white/10 dark:hover:bg-white/20"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                문의하기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

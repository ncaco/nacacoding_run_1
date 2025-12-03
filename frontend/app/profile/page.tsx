'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getApiUrl } from '../utils/api';
import { isTokenExpired, decodeJWT } from '../utils/auth';

interface MemberProfile {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export default function PortalProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initProfile = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      // 토큰이 없거나 만료되었거나, MEMBER 권한이 아니면 로그인 페이지로 이동
      if (!token || isTokenExpired(token) || userRole !== 'MEMBER') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        router.push('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(getApiUrl('/members/me'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // 인증 만료 → 로그인 페이지로 이동
          router.push('/login');
          return;
        }

        const data = await response.json();

        // 백엔드에서 사용자 정보를 찾지 못했거나(success=false, 404 등) 데이터가 없으면 로그인 페이지로 이동
        if (!response.ok || !data.success || !data.data) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
          }
          router.push('/login');
          return;
        }

        const member: MemberProfile = data.data || {};
        setProfile(member);
      } catch (err) {
        console.error('포털 프로필 조회 실패:', err);
        setError('프로필 정보를 불러오는 중 오류가 발생했습니다.');

        const token = localStorage.getItem('token');
        const decoded = token ? decodeJWT(token) : null;
        const fallbackName = decoded?.sub || localStorage.getItem('username') || '';
        if (fallbackName) {
          setProfile({
            username: fallbackName,
            name: fallbackName,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initProfile();
  }, [router]);

  const formatDateOnly = (value?: string) => {
    if (!value) return '-';
    // ISO 문자열 또는 "YYYY-MM-DD HH:mm:ss" 형태에서 앞 10자리(날짜)만 사용
    return value.substring(0, 10);
  };

  const formatDateTime = (value?: string) => {
    if (!value) return '-';
    // ISO 문자열 "YYYY-MM-DDTHH:mm:ss" 형태 기준으로 공백으로 치환 후 앞 19자리까지 사용
    const normalized = value.replace('T', ' ');
    return normalized.substring(0, 19);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white px-4 py-10 dark:from-gray-950 dark:via-gray-950 dark:to-black sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row">
          {/* 좌측: 프로필 헤더 & 요약 카드 */}
          <section className="flex w-full flex-col lg:w-1/3">
            <div className="mb-5">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                마이페이지
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                포털 계정 정보를 한눈에 확인해 보세요.
              </p>
            </div>

            <div className="flex-1 rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-gray-100 backdrop-blur-sm dark:bg-gray-900/90 dark:ring-gray-800">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-gray-700 dark:border-t-gray-200" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-3xl font-semibold text-white shadow-lg shadow-green-500/30">
                        {(profile?.name || profile?.username || 'M').charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profile?.name || profile?.username || '회원'}
                    </h2>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-green-600 dark:text-green-400">
                      Portal Member
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      나의 활동과 계정 정보를 관리하는 공간입니다.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/70">
                      <span>가입일</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {formatDateOnly(profile?.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/70">
                      <span>마지막 로그인</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                         {formatDateTime(profile?.lastLoginAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-400 hover:bg-green-50 hover:text-green-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-green-500 dark:hover:bg-gray-800 dark:hover:text-green-300"
                    >
                      홈으로 돌아가기
                    </button>
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-semibold text-white opacity-60 shadow-md shadow-green-500/30"
                    >
                      프로필 수정 (준비 중)
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 우측: 상세 정보 카드 */}
          <section className="flex w-full flex-col lg:w-2/3">
            <div className="flex-1 rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-gray-100 backdrop-blur-sm dark:bg-gray-900/90 dark:ring-gray-800">
              {error && !isLoading && (
                <div className="mb-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-800 ring-1 ring-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-200 dark:ring-yellow-800/40">
                  {error}
                </div>
              )}

              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                계정 정보
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                로그인 및 서비스 이용에 사용되는 기본 정보입니다.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    아이디
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {profile?.username || '-'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    이름
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {profile?.name || profile?.username || '-'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    이메일
                  </p>
                  <p className="break-all text-sm text-gray-900 dark:text-gray-100">
                    {profile?.email || '-'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    연락처
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {profile?.phoneNumber || '-'}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-4 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
                향후 알림 설정, 보안 설정 등 더 많은 마이페이지 기능이 이 영역에 확장될 예정입니다.
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}



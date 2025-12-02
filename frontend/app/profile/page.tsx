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

      // 토큰이 없거나 만료되었으면 로그인 페이지로 이동
      if (!token || isTokenExpired(token)) {
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

        if (!response.ok || !data.success) {
          setError(data.message || '프로필 정보를 불러오지 못했습니다.');

          // API 실패 시에도 토큰에서 기본 정보는 표시
          const decoded = decodeJWT(token);
          const fallbackName = decoded?.sub || localStorage.getItem('username') || '';
          setProfile({
            username: fallbackName,
            name: fallbackName,
            email: '',
          });
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

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1 bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">프로필</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              포털 계정 정보를 확인할 수 있어요.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 dark:shadow-black/40">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-gray-700 dark:border-t-gray-200" />
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-4 border-b border-gray-100 pb-5 dark:border-gray-800">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-2xl font-semibold text-white">
                    {(profile?.name || profile?.username || 'M').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profile?.name || profile?.username || '회원'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      포털 회원
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      아이디
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {profile?.username || '-'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      이름
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {profile?.name || profile?.username || '-'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      이메일
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {profile?.email || '-'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      연락처
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {profile?.phoneNumber || '-'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      가입일
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {profile?.createdAt || '-'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      마지막 로그인
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {profile?.lastLoginAt || '-'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    홈으로
                  </button>
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-semibold text-white opacity-60"
                  >
                    프로필 수정 (준비 중)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



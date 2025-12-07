'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getApiUrl } from '../_lib/api/client';
import Header from '../_components/layout/Header';
import Footer from '../_components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl('/auth/login/user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // 서버에서 내려오는 인증/권한 오류 메시지를 한글로 매핑
        const rawMessage: string | undefined = data.message;

        let message: string;
        if (
          rawMessage === 'invalid credentials or insufficient privileges' ||
          rawMessage === 'Invalid credentials or insufficient privileges'
        ) {
          message = '아이디 또는 비밀번호가 올바르지 않거나 권한이 없습니다.';
        } else if (response.status === 400 || response.status === 401 || response.status === 403) {
          message = '아이디 또는 비밀번호가 올바르지 않거나 권한이 없습니다.';
        } else {
          message = rawMessage || '로그인에 실패했습니다. 다시 시도해주세요.';
        }

        toast.error(message);
        throw new Error(message);
      }

      // JWT 토큰 및 Refresh Token 저장
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        if (data.data?.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', 'MEMBER');
      } else {
        throw new Error('토큰을 받지 못했습니다.');
      }
      
      // 홈으로 리다이렉트
      router.push('/');
    } catch (err) {
      if (!(err instanceof Error)) {
        const fallbackMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
        toast.error(fallbackMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex flex-1 items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-950">
        {/* 배경 그라데이션 및 장식 요소 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-gray-100/50 to-transparent blur-3xl dark:from-gray-900/30"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-gray-100/50 to-transparent blur-3xl dark:from-gray-900/30"></div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* 왼쪽: 시각적 요소 및 환영 메시지 */}
            <div className="hidden lg:block space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl transition-transform hover:scale-105 dark:from-gray-100 dark:to-gray-200">
                    <span className="text-2xl font-bold text-white dark:text-gray-900">P</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Portal</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">환영합니다</p>
                  </div>
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
                  다시 오신 것을<br />
                  <span className="text-green-600 dark:text-green-400">환영합니다</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  포털에 로그인하여 계속 진행하세요.<br />
                  모든 기능과 리소스에 즉시 액세스할 수 있습니다.
                </p>
              </div>

              {/* 특징 목록 */}
              <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700/50">
                {[
                  { icon: '🔐', text: '안전한 인증 시스템' },
                  { icon: '⚡', text: '빠른 로그인 프로세스' },
                  { icon: '🎯', text: '개인화된 대시보드' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900/50 text-xl">
                      {feature.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 로그인 폼 */}
            <div className="w-full">
              <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-200 dark:bg-gray-900/80 dark:border-gray-700/50 backdrop-blur-sm">
                {/* 모바일용 헤더 */}
                <div className="lg:hidden mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-md dark:from-gray-100 dark:to-gray-200">
                    <span className="text-xl font-bold text-white dark:text-gray-900">P</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                    로그인
                  </h2>
                </div>

                {/* 데스크톱용 헤더 */}
                <div className="hidden lg:block mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
                    로그인
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    계정이 없으신가요?{' '}
                    <Link
                      href="/signup"
                      className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    >
                      회원가입
                    </Link>
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    {/* 사용자명 입력 */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        사용자명
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-green-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="block w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600/50 dark:bg-gray-800/80 dark:text-gray-50 dark:placeholder-gray-400 transition-all sm:text-sm"
                          placeholder="사용자명을 입력하세요"
                        />
                      </div>
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        비밀번호
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-green-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-600/50 dark:bg-gray-800/80 dark:text-gray-50 dark:placeholder-gray-400 transition-all sm:text-sm"
                          placeholder="비밀번호를 입력하세요"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                        >
                          {showPassword ? (
                            <svg
                              className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L12 12m-5.71-5.71L12 12"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 옵션 및 링크 */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600/50 dark:bg-gray-800/80 dark:ring-offset-gray-900"
                      />
                      <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-700 dark:text-gray-300">
                        로그인 상태 유지
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href="/forgot-password"
                        className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        비밀번호 찾기
                      </Link>
                    </div>
                  </div>

                  {/* 로그인 버튼 */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative flex w-full justify-center rounded-xl border border-transparent bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:from-gray-800 hover:to-gray-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:from-green-500 dark:to-green-600 dark:text-white dark:hover:from-green-600 dark:hover:to-green-700 dark:shadow-green-500/20 dark:focus:ring-green-500 dark:focus:ring-offset-gray-900"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          로그인 중...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          로그인
                          <svg
                            className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* 모바일용 회원가입 링크 */}
                  <div className="lg:hidden pt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      계정이 없으신가요?{' '}
                      <Link
                        href="/signup"
                        className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        회원가입
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


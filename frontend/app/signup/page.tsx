'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 비밀번호 강도 계산
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 6) return { strength: 1, label: '약함', color: 'bg-red-500' };
    if (pwd.length < 8) return { strength: 2, label: '보통', color: 'bg-yellow-500' };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { strength: 3, label: '강함', color: 'bg-green-500' };
    }
    return { strength: 2, label: '보통', color: 'bg-yellow-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    if (!name || name.trim().length === 0) {
      setError('이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: API 연동 - 회원가입 엔드포인트 필요
      // 현재는 관리자 생성 API만 있으므로, 나중에 구현 필요
      // API 호출 시 { username, name, password } 형태로 전송
      setError('회원가입 기능은 곧 제공될 예정입니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800 dark:shadow-gray-800/50">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                회원가입
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                이미 계정이 있으신가요?{' '}
                <Link
                  href="/login"
                  className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  로그인
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="ml-3 text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    아이디
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                      placeholder="아이디를 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    이름
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    비밀번호
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                      placeholder="비밀번호를 입력하세요"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">비밀번호 강도</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength.strength === 1 ? 'text-red-600 dark:text-red-400' :
                          passwordStrength.strength === 2 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    비밀번호 확인
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`block w-full pl-10 pr-10 py-3 rounded-lg border bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-300 dark:border-red-700'
                          : confirmPassword && password === confirmPassword
                          ? 'border-green-300 dark:border-green-700'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      비밀번호가 일치하지 않습니다.
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                      비밀번호가 일치합니다.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || password !== confirmPassword || password.length < 6 || !name.trim()}
                  className="group relative flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-green-400 to-green-600 px-4 py-3 text-base font-semibold text-white transition-all hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      계정 생성 중...
                    </span>
                  ) : (
                    '회원가입'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


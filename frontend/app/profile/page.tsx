'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '../_components/layout/Header';
import Footer from '../_components/layout/Footer';
import { getApiUrl } from '../_lib/api/client';
import { isTokenExpired, decodeJWT } from '../_lib/utils/auth';

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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<{ name: string; email: string; phoneNumber: string }>({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<{ currentPassword: string; newPassword: string; confirmPassword: string }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
        setProfileForm({
          name: member.name || '',
          email: member.email || '',
          phoneNumber: member.phoneNumber || '',
        });
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

  const handleStartEditProfile = () => {
    if (!profile) return;
    setProfileForm({
      name: profile.name || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
    });
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || isTokenExpired(token) || userRole !== 'MEMBER') {
      toast.error('로그인이 필요합니다. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }

    try {
      setIsSavingProfile(true);
      const response = await fetch(getApiUrl('/members/me'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phoneNumber: profileForm.phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        router.push('/login');
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || '프로필 수정에 실패했습니다.');
      }

      const updated: MemberProfile = data.data || {};
      setProfile(updated);
      setProfileForm({
        name: updated.name || '',
        email: updated.email || '',
        phoneNumber: updated.phoneNumber || '',
      });
      setIsEditingProfile(false);
      toast.success('프로필이 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      if (err instanceof Error) {
        toast.error(err.message || '프로필 수정에 실패했습니다.');
      } else {
        toast.error('프로필 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('모든 비밀번호 입력란을 채워주세요.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('신규 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || isTokenExpired(token) || userRole !== 'MEMBER') {
      toast.error('로그인이 필요합니다. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await fetch(getApiUrl('/members/me/password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        router.push('/login');
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || '비밀번호 변경에 실패했습니다.');
      }

      toast.success('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
      setIsPasswordModalOpen(false);

      // 비밀번호 변경 후 보안을 위해 로그아웃 처리
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      router.push('/login');
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      if (err instanceof Error) {
        toast.error(err.message || '비밀번호 변경에 실패했습니다.');
      } else {
        toast.error('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsChangingPassword(false);
    }
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
                  onClick={handleStartEditProfile}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-green-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                  프로필 수정
                </button>
                <button
                  type="button"
                  onClick={handleOpenPasswordModal}
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-50 hover:text-red-700 dark:border-red-500/40 dark:bg-gray-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-200"
                >
                  비밀번호 변경
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
                {isEditingProfile ? '계정 정보 수정' : '계정 정보'}
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                로그인 및 서비스 이용에 사용되는 기본 정보입니다.
              </p>

              {isEditingProfile ? (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        아이디
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {profile?.username ? `@${profile.username}` : '-'}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        이름
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-green-500 dark:focus:ring-green-600/40"
                        placeholder="이름을 입력하세요"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-green-500 dark:focus:ring-green-600/40"
                        placeholder="이메일을 입력하세요"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        연락처
                      </label>
                      <input
                        type="text"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-green-500 dark:focus:ring-green-600/40"
                        placeholder="연락처(전화번호)를 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEditProfile}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-green-500/30 transition-all hover:from-green-500 hover:to-green-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSavingProfile ? '저장 중...' : '저장'}
                    </button>
                  </div>
                </div>
              ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    아이디
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {profile?.username ? `@${profile.username}` : '-'}
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
              )}

              <div className="mt-8 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-4 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
                향후 알림 설정, 보안 설정 등 더 많은 마이페이지 기능이 이 영역에 확장될 예정입니다.
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* 비밀번호 변경 모달 */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  비밀번호 변경
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClosePasswordModal}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-green-500 dark:focus:ring-green-600/40"
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  신규 비밀번호
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-green-500 dark:focus:ring-green-600/40"
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  신규 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-green-500 dark:focus:ring-green-600/40"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClosePasswordModal}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/30 transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



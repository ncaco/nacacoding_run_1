'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';
import FormField from '../../components/admin/FormField';
import FormActions from '../../components/admin/FormActions';
import { decodeJWT, isTokenExpired, logout, fetchWithTokenRefresh } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

// 날짜 포맷팅 함수
function formatDate(date: Date | null): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

// 남은 시간 계산 함수
function getTimeRemaining(expirationDate: Date | null): string {
  if (!expirationDate) return '-';
  const now = new Date();
  const diff = expirationDate.getTime() - now.getTime();
  
  if (diff <= 0) return '만료됨';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else if (minutes > 0) {
    return `${minutes}분 ${seconds}초`;
  } else {
    return `${seconds}초`;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // 로그인 상태 정보
  const [loginStatus, setLoginStatus] = useState({
    isLoggedIn: false,
    tokenIssuedAt: null as Date | null,
    tokenExpiresAt: null as Date | null,
    sessionStatus: 'unknown' as 'active' | 'expired' | 'unknown',
  });
  
  // 남은 시간 실시간 업데이트를 위한 상태
  const [currentTime, setCurrentTime] = useState(new Date());

  // 프로필 정보 폼
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    name: '',
    avatarUrl: '',
  });
  
  // 프로필 이미지 업로드 상태
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // 비밀번호 변경 폼
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // JWT 토큰에서 로그인 상태 확인 함수
  const checkLoginStatusFromToken = (token: string | null) => {
    if (!token) {
      setLoginStatus({
        isLoggedIn: false,
        tokenIssuedAt: null,
        tokenExpiresAt: null,
        sessionStatus: 'unknown',
      });
      return;
    }

    const decoded = decodeJWT(token);
    if (decoded) {
      const issuedAt = decoded.iat ? new Date(decoded.iat * 1000) : null;
      const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : null;
      const now = new Date();
      const isExpired = expiresAt ? expiresAt.getTime() <= now.getTime() : false;
      
      setLoginStatus({
        isLoggedIn: true,
        tokenIssuedAt: issuedAt,
        tokenExpiresAt: expiresAt,
        sessionStatus: isExpired ? 'expired' : 'active',
      });
    } else {
      setLoginStatus({
        isLoggedIn: false,
        tokenIssuedAt: null,
        tokenExpiresAt: null,
        sessionStatus: 'unknown',
      });
    }
  };

  useEffect(() => {
    // 초기 로그인 상태 확인 (토큰이 있으면 로그인 상태로 설정)
    const token = localStorage.getItem('adminToken');
    checkLoginStatusFromToken(token);

    // API에서 프로필 정보 가져오기
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          checkLoginStatusFromToken(null);
          return;
        }

        const response = await fetchWithTokenRefresh(getApiUrl('/admin/profile'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 401 오류 발생 시 자동 로그아웃
        if (response.status === 401) {
          logout(router);
          return;
        }

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          const user = data.data;
          setUsername(user.username || '');
          setRole(user.role === 'USER' ? '관리자' : user.role);
          
          // avatarUrl이 상대 경로인 경우 백엔드 서버 URL 추가
          let avatarUrl = user.avatarUrl || '';
          if (avatarUrl && avatarUrl.startsWith('/')) {
            avatarUrl = `http://localhost:8080${avatarUrl}`;
          }
          
          setProfileData({
            username: user.username || '',
            email: user.email || '',
            name: user.name || user.username || '',
            avatarUrl: avatarUrl,
          });
          
          // JWT 토큰 정보 업데이트
          checkLoginStatusFromToken(token);
        } else {
          // API 실패 시에도 토큰이 있으면 로그인 상태는 유지
          checkLoginStatusFromToken(token);
          
          // localStorage에서 기본 정보 가져오기
          const adminUsername = localStorage.getItem('adminUsername');
          const userRole = localStorage.getItem('userRole');
          
          if (adminUsername) {
            setUsername(adminUsername);
            setProfileData({
              username: adminUsername,
              email: `${adminUsername}@admin.com`,
              name: adminUsername,
              avatarUrl: '',
            });
          }
          
          if (userRole) {
            setRole(userRole === 'USER' ? '관리자' : userRole);
          }
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        // 에러 발생 시에도 토큰이 있으면 로그인 상태는 유지
        const token = localStorage.getItem('adminToken');
        checkLoginStatusFromToken(token);
        
        // localStorage에서 기본 정보 가져오기
        const adminUsername = localStorage.getItem('adminUsername');
        const userRole = localStorage.getItem('userRole');
        
        if (adminUsername) {
          setUsername(adminUsername);
          setProfileData({
            username: adminUsername,
            email: `${adminUsername}@admin.com`,
            name: adminUsername,
          });
        }
        
        if (userRole) {
          setRole(userRole === 'USER' ? '관리자' : userRole);
        }
      }
    };

    fetchProfile();
  }, []);

  // 남은 시간 실시간 업데이트 및 토큰 만료 시 자동 로그아웃
  useEffect(() => {
    if (loginStatus.sessionStatus === 'active' && loginStatus.tokenExpiresAt) {
      const interval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        
        const token = localStorage.getItem('adminToken');
        if (!token || isTokenExpired(token)) {
          // 토큰이 만료되었으면 자동 로그아웃
          logout(router);
          return;
        }
        
        const isExpired = loginStatus.tokenExpiresAt 
          ? loginStatus.tokenExpiresAt.getTime() <= now.getTime() 
          : false;
        
        if (isExpired) {
          setLoginStatus(prev => ({
            ...prev,
            sessionStatus: 'expired',
          }));
          // 토큰 만료 시 자동 로그아웃
          logout(router);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else if (loginStatus.sessionStatus === 'expired') {
      // 이미 만료된 경우 자동 로그아웃
      logout(router);
    }
  }, [loginStatus.sessionStatus, loginStatus.tokenExpiresAt, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/admin/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          avatarUrl: profileData.avatarUrl,
        }),
      });

      // 401 오류 발생 시 자동 로그아웃
      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '프로필 업데이트에 실패했습니다.');
      }

      // 업데이트된 정보로 상태 업데이트
      if (data.data) {
        // avatarUrl이 상대 경로인 경우 백엔드 서버 URL 추가
        let avatarUrl = data.data.avatarUrl || profileData.avatarUrl;
        if (avatarUrl && avatarUrl.startsWith('/')) {
          avatarUrl = `http://localhost:8080${avatarUrl}`;
        }
        
        setProfileData({
          username: data.data.username || profileData.username,
          email: data.data.email || profileData.email,
          name: data.data.name || profileData.name,
          avatarUrl: avatarUrl,
        });
      }

      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
      
      // 헤더에 프로필 업데이트 알림
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      // 3초 후 메시지 제거
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('이미지 파일 크기는 5MB 이하여야 합니다.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    // 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일만 업로드할 수 있습니다.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 프로필 이미지 업로드 (전용 엔드포인트 사용)
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetchWithTokenRefresh(getApiUrl('/admin/profile/avatar'), {
        method: 'POST',
        body: formData,
      });

      // 401 오류 발생 시 자동 로그아웃
      if (uploadResponse.status === 401) {
        logout(router);
        return;
      }

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || '이미지 업로드에 실패했습니다.');
      }

      // 업로드된 파일의 URL (백엔드에서 반환된 URL 사용)
      const imageUrl = `http://localhost:8080${uploadData.data.url}`;

      // 프로필 데이터 업데이트
      setProfileData({
        ...profileData,
        avatarUrl: imageUrl,
      });

      setSuccessMessage('프로필 이미지가 성공적으로 업로드되었습니다.');
      
      // 헤더에 프로필 업데이트 알림
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsUploadingImage(false);
      // input 초기화
      e.target.value = '';
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // 비밀번호 확인
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    // 비밀번호 길이 확인
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/admin/profile/password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      // 401 오류 발생 시 자동 로그아웃
      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '비밀번호 변경에 실패했습니다.');
      }

      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      
      // 폼 초기화
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // 3초 후 메시지 제거
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: 'profile',
      label: '프로필 정보',
      content: (
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">프로필 정보 수정</h3>
          
          {successMessage && (
            <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="ml-3 text-sm text-green-800 dark:text-green-300">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="ml-3 text-sm text-red-800 dark:text-red-300">{errorMessage}</p>
              </div>
            </div>
          )}

          <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleProfileSubmit}>
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                {profileData.avatarUrl ? (
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                    <img
                      src={profileData.avatarUrl}
                      alt="프로필 이미지"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // 이미지 로드 실패 시 기본 아바타 표시
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-2xl font-bold text-white">${profileData.username ? profileData.username.charAt(0).toUpperCase() : 'A'}</span>`;
                          parent.className = 'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600';
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
                    <span className="text-2xl font-bold text-white">
                      {profileData.name ? profileData.name.charAt(0).toUpperCase() : (profileData.username ? profileData.username.charAt(0).toUpperCase() : 'A')}
                    </span>
                  </div>
                )}
                <label className={`absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600 ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isUploadingImage ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">역할</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{role || '관리자'}</p>
              </div>
            </div>

            {/* 아이디 (읽기 전용) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                아이디
              </label>
              <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                {profileData.username || '-'}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">아이디는 변경할 수 없습니다.</p>
            </div>

            <FormField
              label="이름"
              name="name"
              type="text"
              required
              placeholder="이름을 입력하세요"
              value={profileData.name}
              onChange={(value) => setProfileData({ ...profileData, name: value as string })}
            />
            <FormField
              label="이메일"
              name="email"
              type="email"
              required
              placeholder="이메일을 입력하세요"
              value={profileData.email}
              onChange={(value) => setProfileData({ ...profileData, email: value as string })}
            />
            <FormActions
              onSubmit={handleProfileSubmit}
              submitLabel="저장"
              isLoading={isLoading}
            />
          </form>
        </div>
      ),
    },
    {
      id: 'status',
      label: '로그인 및 인증 상태',
      content: (
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">로그인 및 인증 상태</h3>
          
          <div className="mt-6 space-y-6">
            {/* 로그인 상태 섹션 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                로그인 상태
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">로그인 여부</span>
                  <span className={`text-sm font-medium ${loginStatus.isLoggedIn ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {loginStatus.isLoggedIn ? '로그인됨' : '로그인 안됨'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">세션 상태</span>
                  <span className={`text-sm font-medium ${
                    loginStatus.sessionStatus === 'active' 
                      ? 'text-green-600 dark:text-green-400' 
                      : loginStatus.sessionStatus === 'expired'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {loginStatus.sessionStatus === 'active' 
                      ? '활성' 
                      : loginStatus.sessionStatus === 'expired'
                      ? '만료됨'
                      : '알 수 없음'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">로그인 시간</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(loginStatus.tokenIssuedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">토큰 만료 시간</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(loginStatus.tokenExpiresAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">남은 시간</span>
                  <span className={`text-sm font-medium ${
                    loginStatus.sessionStatus === 'active' 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {getTimeRemaining(loginStatus.tokenExpiresAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* 인증 상태 섹션 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                인증 상태
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">사용자 역할</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {role || '관리자'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">계정 상태</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    활성화
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">이메일 인증</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    email 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {email ? '인증됨' : '미인증'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">2단계 인증</span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    비활성화
                  </span>
                </div>
              </div>
            </div>

            {/* 보안 정보 */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">보안 안내</p>
                  <ul className="mt-2 space-y-1 text-xs text-blue-700 dark:text-blue-400 list-disc list-inside">
                    <li>Access Token은 1시간 동안 유효하며, 만료 5분 전에 자동으로 갱신됩니다.</li>
                    <li>Refresh Token은 7일 동안 유효하며, Access Token 갱신에 사용됩니다.</li>
                    <li>정기적으로 비밀번호를 변경하여 보안을 강화하세요.</li>
                    <li>의심스러운 활동이 발견되면 즉시 비밀번호를 변경하고 로그아웃하세요.</li>
                    <li>공용 컴퓨터에서는 반드시 로그아웃 후 브라우저를 종료하세요.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'password',
      label: '비밀번호 변경',
      content: (
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">비밀번호 변경</h3>
          
          {successMessage && (
            <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="ml-3 text-sm text-green-800 dark:text-green-300">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="ml-3 text-sm text-red-800 dark:text-red-300">{errorMessage}</p>
              </div>
            </div>
          )}

          <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handlePasswordSubmit}>
            <FormField
              label="현재 비밀번호"
              name="currentPassword"
              type="password"
              required
              placeholder="현재 비밀번호를 입력하세요"
              value={passwordData.currentPassword}
              onChange={(value) => setPasswordData({ ...passwordData, currentPassword: value as string })}
            />
            <FormField
              label="새 비밀번호"
              name="newPassword"
              type="password"
              required
              placeholder="새 비밀번호를 입력하세요 (최소 8자)"
              value={passwordData.newPassword}
              onChange={(value) => setPasswordData({ ...passwordData, newPassword: value as string })}
            />
            <FormField
              label="새 비밀번호 확인"
              name="confirmPassword"
              type="password"
              required
              placeholder="새 비밀번호를 다시 입력하세요"
              value={passwordData.confirmPassword}
              onChange={(value) => setPasswordData({ ...passwordData, confirmPassword: value as string })}
            />
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">비밀번호 요구사항</p>
                  <ul className="mt-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
                    <li>최소 8자 이상</li>
                    <li>영문, 숫자, 특수문자 조합 권장</li>
                  </ul>
                </div>
              </div>
            </div>
            <FormActions
              onSubmit={handlePasswordSubmit}
              submitLabel="비밀번호 변경"
              isLoading={isLoading}
            />
          </form>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 animate-spin text-green-600"
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
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">로딩 중...</p>
            </div>
          </div>
        }>
          <TabContainer tabs={tabs} />
        </Suspense>
      </div>
    </AdminLayout>
  );
}


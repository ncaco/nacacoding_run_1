'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';
import PageHeader from '../../components/admin/PageHeader';
import FormField from '../../components/admin/FormField';
import FormActions from '../../components/admin/FormActions';

export default function ProfilePage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 프로필 정보 폼
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    name: '',
  });

  // 비밀번호 변경 폼
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // localStorage에서 사용자 정보 가져오기
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
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // TODO: 실제 API 호출로 변경
      const token = localStorage.getItem('adminToken');
      
      // 시뮬레이션: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // localStorage 업데이트
      if (profileData.username) {
        localStorage.setItem('adminUsername', profileData.username);
      }
      
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
      
      // 3초 후 메시지 제거
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
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
      // TODO: 실제 API 호출로 변경
      const token = localStorage.getItem('adminToken');
      
      // 시뮬레이션: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
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
      setErrorMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
                <span className="text-2xl font-bold text-white">
                  {profileData.username ? profileData.username.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">역할</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{role || '관리자'}</p>
              </div>
            </div>

            <FormField
              label="사용자명"
              name="username"
              type="text"
              required
              placeholder="사용자명을 입력하세요"
              value={profileData.username}
              onChange={(value) => setProfileData({ ...profileData, username: value as string })}
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
            <FormField
              label="이름"
              name="name"
              type="text"
              placeholder="이름을 입력하세요"
              value={profileData.name}
              onChange={(value) => setProfileData({ ...profileData, name: value as string })}
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
        <PageHeader title="마이페이지" description="프로필 정보를 수정하고 비밀번호를 변경할 수 있습니다." />
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}


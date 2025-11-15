'use client';

import AdminLayout from '../components/admin/AdminLayout';
import TabContainer from '../components/admin/TabContainer';

export default function AdminDashboard() {
  const tabs = [
    {
      id: 'overview',
      label: '개요',
      content: (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">전체 사이트</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:mt-2 sm:text-3xl">0</p>
                </div>
                <div className="rounded-lg bg-green-100 p-2 sm:p-3">
                  <svg className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">전체 메뉴</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:mt-2 sm:text-3xl">0</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-2 sm:p-3">
                  <svg className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">전체 사용자</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:mt-2 sm:text-3xl">0</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-2 sm:p-3">
                  <svg className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">전체 로그</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:mt-2 sm:text-3xl">0</p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-2 sm:p-3">
                  <svg className="h-5 w-5 text-yellow-600 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">최근 활동</h3>
            <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">최근 활동이 없습니다.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'stats',
      label: '통계',
      content: (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">통계 정보</h3>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">통계 데이터를 불러오는 중...</p>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">대시보드</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-base">시스템 개요 및 통계를 확인하세요.</p>
        </div>
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}


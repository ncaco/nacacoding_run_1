'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    {
      id: 'list',
      label: '사이트 목록',
      content: (
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">사이트 목록</h3>
              <button className="w-full rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-green-700 sm:w-auto">
                새 사이트 추가
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">로딩 중...</div>
            ) : sites.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <p className="mt-4">등록된 사이트가 없습니다.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          사이트 타입
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          사이트명
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          버전
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          상태
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                      {sites.map((site) => (
                        <tr key={site.id}>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white sm:px-6">
                            {site.siteType}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white sm:px-6">
                            {site.siteName}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400 sm:px-6">
                            {site.version}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                site.enabled
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                              }`}
                            >
                              {site.enabled ? '활성' : '비활성'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:px-6">
                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">수정</button>
                            <button className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">삭제</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Cards */}
                <div className="space-y-4 md:hidden">
                  {sites.map((site) => (
                    <div key={site.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{site.siteName}</h4>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{site.siteType}</p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">버전: {site.version}</p>
                        </div>
                        <span
                          className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold ${
                            site.enabled
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {site.enabled ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 rounded-lg border border-green-600 bg-white px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20">
                          수정
                        </button>
                        <button className="flex-1 rounded-lg border border-red-600 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20">
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'create',
      label: '사이트 생성',
      content: (
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">새 사이트 생성</h3>
          <form className="mt-4 space-y-4 sm:mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">사이트 타입</label>
              <select className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <option value="">선택하세요</option>
                <option value="ADMIN">통합관리사이트</option>
                <option value="PORTAL">메인포털사이트</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">사이트명</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="사이트명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">설명</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="사이트 설명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">버전</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="예: 1.0.0"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800"
                defaultChecked
              />
              <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                활성화
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-green-700 sm:w-auto"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">사이트 관리</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-base">사이트를 생성, 수정, 삭제할 수 있습니다.</p>
        </div>
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}


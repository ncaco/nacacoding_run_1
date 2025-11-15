'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    {
      id: 'list',
      label: '파일 목록',
      content: (
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">파일 목록</h3>
              <button className="w-full rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-green-700 sm:w-auto">
                파일 업로드
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center text-gray-500">로딩 중...</div>
            ) : files.length === 0 ? (
              <div className="text-center text-gray-500">
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4">업로드된 파일이 없습니다.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          파일명
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          크기
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          업로드일
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                      {files.map((file) => (
                        <tr key={file.id}>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white sm:px-6">
                            {file.name}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400 sm:px-6">
                            {file.size}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-400 sm:px-6">
                            {file.uploadDate}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:px-6">
                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">다운로드</button>
                            <button className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">삭제</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Cards */}
                <div className="space-y-4 md:hidden">
                  {files.map((file) => (
                    <div key={file.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</h4>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">크기: {file.size}</p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">업로드일: {file.uploadDate}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 rounded-lg border border-green-600 bg-white px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20">
                          다운로드
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
      id: 'upload',
      label: '파일 업로드',
      content: (
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">파일 업로드</h3>
          <form className="mt-4 space-y-4 sm:mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">파일 선택</label>
              <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 dark:border-gray-700 sm:px-6 sm:py-10">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-gray-400 sm:h-12 sm:w-12"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:text-sm">
                    <label className="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 dark:bg-gray-800 dark:text-green-400">
                      <span>파일 선택</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">또는 드래그 앤 드롭</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, PDF 최대 10MB</p>
                </div>
              </div>
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
                업로드
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">파일 관리</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-base">파일을 업로드, 다운로드, 삭제할 수 있습니다.</p>
        </div>
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}


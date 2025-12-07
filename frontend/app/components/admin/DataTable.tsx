'use client';

import type { DataTableProps } from '@/_types/admin';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
  emptyState,
  onEdit,
  onDelete,
  mobileCardRender,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (data.length === 0 && emptyState) {
    return <EmptyState {...emptyState} />;
  }

  if (data.length === 0) {
    return <EmptyState icon={<div />} message="데이터가 없습니다." />;
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6 ${
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                  작업
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {data.map((item, index) => (
              <tr key={(item.id as string | number | undefined) || index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white sm:px-6 ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {column.render ? column.render(item) : String(item[column.key] ?? '')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:px-6">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        삭제
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {data.map((item, index) =>
          mobileCardRender ? (
            mobileCardRender(item)
          ) : (
            <div
              key={(item.id as string | number | undefined) || index}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              {columns.map((column) => (
                <div key={column.key} className="mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{column.label}: </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {column.render ? column.render(item) : String(item[column.key] ?? '')}
                  </span>
                </div>
              ))}
              {(onEdit || onDelete) && (
                <div className="mt-4 flex gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="flex-1 rounded-lg border border-green-600 bg-white px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20"
                    >
                      수정
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="flex-1 rounded-lg border border-red-600 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      삭제
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}


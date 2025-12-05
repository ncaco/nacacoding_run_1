'use client';

import ListHeader from '../ListHeader';

interface File {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface FileListProps {
  files: File[];
  isLoading: boolean;
  onUpload?: () => void;
  onDownload?: (file: File) => void;
  onDelete?: (file: File) => void;
}

export default function FileList({ files, isLoading, onUpload, onDownload, onDelete }: FileListProps) {
  const columns: Array<{
    key: keyof File;
    label: string;
    render?: (file: File) => React.ReactNode;
  }> = [
    {
      key: 'name',
      label: '파일명',
    },
    {
      key: 'size',
      label: '크기',
    },
    {
      key: 'uploadDate',
      label: '업로드일',
    },
  ];

  const mobileCardRender = (file: File) => (
    <div key={file.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">크기: {file.size}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">업로드일: {file.uploadDate}</p>
        </div>
      </div>
      {(onDownload || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onDownload && (
            <button
              onClick={() => onDownload(file)}
              className="flex-1 rounded-lg border border-green-600 bg-white px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              다운로드
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(file)}
              className="flex-1 rounded-lg border border-red-600 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
      <ListHeader title="파일 목록" actionLabel="파일 업로드" onAction={onUpload} />
      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">로딩 중...</div>
        ) : files.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6"
                      >
                        {column.label}
                      </th>
                    ))}
                    {(onDownload || onDelete) && (
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 sm:px-6">
                        작업
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {files.map((file) => (
                    <tr key={file.id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap px-4 py-4 text-sm text-gray-900 dark:text-white sm:px-6"
                        >
                          {column.render ? column.render(file) : file[column.key]}
                        </td>
                      ))}
                      {(onDownload || onDelete) && (
                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:px-6">
                          {onDownload && (
                            <button
                              onClick={() => onDownload(file)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              다운로드
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(file)}
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
            <div className="space-y-4 md:hidden">{files.map((file) => mobileCardRender(file))}</div>
          </>
        )}
      </div>
    </div>
  );
}


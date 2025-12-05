'use client';

import DataTable from '../DataTable';
import ListHeader from '../ListHeader';

interface Log extends Record<string, unknown> {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

interface LogListProps {
  logs: Log[];
  isLoading: boolean;
  onAdd?: () => void;
  onDelete?: (log: Log) => void;
}

export default function LogList({ logs, isLoading, onAdd, onDelete }: LogListProps) {
  const getLevelBadge = (level: string) => {
    const classes = {
      ERROR: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      WARN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      INFO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return (
      <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${classes[level as keyof typeof classes] || classes.INFO}`}>
        {level}
      </span>
    );
  };

  const columns = [
    {
      key: 'timestamp',
      label: '시간',
    },
    {
      key: 'level',
      label: '레벨',
      render: (log: Log) => getLevelBadge(log.level),
    },
    {
      key: 'message',
      label: '메시지',
    },
  ];

  const mobileCardRender = (log: Log) => (
    <div key={log.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">{log.message}</p>
        </div>
        {getLevelBadge(log.level)}
      </div>
      {onDelete && (
        <div className="mt-4">
          <button
            onClick={() => onDelete(log)}
            className="w-full rounded-lg border border-red-600 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
      <ListHeader title="로그 목록" actionLabel="새 로그 추가" onAction={onAdd} />
      <div className="p-4 sm:p-6">
        <DataTable
          data={logs}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            icon: (
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            ),
            message: '등록된 로그가 없습니다.',
          }}
          onDelete={onDelete}
          mobileCardRender={mobileCardRender}
        />
      </div>
    </div>
  );
}


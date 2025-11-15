'use client';

import DataTable from '../DataTable';
import ListHeader from '../ListHeader';

interface User {
  id: string;
  username: string;
  role: 'USER' | 'MEMBER';
  createdAt?: string;
}

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserList({ users, isLoading, onAdd, onEdit, onDelete }: UserListProps) {
  const columns = [
    {
      key: 'username',
      label: '사용자명',
    },
    {
      key: 'role',
      label: '역할',
      render: (user: User) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold ${
            user.role === 'USER'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}
        >
          {user.role === 'USER' ? '관리자' : '사용자'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '생성일',
      render: (user: User) => user.createdAt || '-',
    },
  ];

  const mobileCardRender = (user: User) => (
    <div key={user.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">생성일: {user.createdAt || '-'}</p>
        </div>
        <span
          className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold ${
            user.role === 'USER'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
          }`}
        >
          {user.role === 'USER' ? '관리자' : '사용자'}
        </span>
      </div>
      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="flex-1 rounded-lg border border-green-600 bg-white px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user)}
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
      <ListHeader title="사용자 목록" actionLabel="새 사용자 추가" onAction={onAdd} />
      <div className="p-4 sm:p-6">
        <DataTable
          data={users}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            icon: (
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ),
            message: '등록된 사용자가 없습니다.',
          }}
          onEdit={onEdit}
          onDelete={onDelete}
          mobileCardRender={mobileCardRender}
        />
      </div>
    </div>
  );
}


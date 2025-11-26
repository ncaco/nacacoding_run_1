'use client';

import { useState } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import DataTable from '../DataTable';

interface UserRole {
  id: string;
  roleCd: string;
  roleNm: string;
  roleDesc?: string;
  enabled?: boolean;
}

interface UserRoleListProps {
  userRoles: UserRole[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (userRole: UserRole) => void;
  onDelete?: (userRole: UserRole) => void;
  onToggleEnabled?: (userRole: UserRole, enabled: boolean) => void;
}

export default function UserRoleList({ userRoles, isLoading, onAdd, onEdit, onDelete, onToggleEnabled }: UserRoleListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = userRoles.filter((role) =>
    role.roleCd.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.roleNm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.roleDesc && role.roleDesc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    {
      key: 'roleCd',
      label: '역할 코드',
      render: (role: UserRole) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">{role.roleCd}</span>
      ),
    },
    {
      key: 'roleNm',
      label: '역할명',
      render: (role: UserRole) => (
        <span className="text-xs font-medium text-gray-900 dark:text-white">{role.roleNm}</span>
      ),
    },
    {
      key: 'roleDesc',
      label: '설명',
      render: (role: UserRole) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">{role.roleDesc || '-'}</span>
      ),
    },
    {
      key: 'enabled',
      label: '상태',
      render: (role: UserRole) => (
        <div className="flex items-center gap-2">
          <ToggleSwitch
            enabled={role.enabled ?? true}
            onToggle={(enabled) => onToggleEnabled && onToggleEnabled(role, enabled)}
            size="sm"
          />
          <span className={`text-xs font-medium ${role.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {role.enabled ? '활성' : '비활성'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '작업',
      render: (role: UserRole) => (
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(role)}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-300 dark:hover:bg-[#1a1e2c]"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(role)}
              className="rounded border border-red-300 bg-white px-2 py-1 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-[#0f1119] dark:text-red-400 dark:hover:bg-red-500/10"
            >
              삭제
            </button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
        <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">역할 목록</h3>
        </div>
        <div className="p-4">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
      <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">역할 목록</h3>
          {onAdd && (
            <button
              onClick={onAdd}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-300 dark:hover:bg-[#1a1e2c]"
            >
              추가
            </button>
          )}
        </div>
        <div className="mt-2">
          <input
            type="text"
            placeholder="역할 코드, 역할명, 설명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650]"
          />
        </div>
      </div>
      <div className="p-3">
        {filteredRoles.length === 0 ? (
          <EmptyState
            icon={
              <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
            message={searchQuery ? '검색 결과가 없습니다.' : '등록된 역할이 없습니다.'}
          />
        ) : (
          <DataTable data={filteredRoles} columns={columns} />
        )}
      </div>
    </div>
  );
}


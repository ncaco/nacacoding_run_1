'use client';

import { useState, useMemo } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import LoadingState from '../LoadingState';
import CustomSelect from '../CustomSelect';

interface User {
  id: string;
  username: string;
  role: 'USER' | 'MEMBER';
  name?: string;
  email?: string;
  avatarUrl?: string;
}

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  isAdminPage?: boolean;
}

function UserItem({ user, onEdit, onDelete }: { user: User; onEdit?: (user: User) => void; onDelete?: (user: User) => void }) {
  const roleLabel = user.role === 'USER' ? '관리자' : '사용자';
  const roleColor = user.role === 'USER' 
    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-lg">
      {/* 상단 영역 */}
      <div className="flex items-start gap-3 mb-3">
        {/* 사용자 아이콘 */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className="h-full w-full rounded-lg object-cover" />
          ) : (
            <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user.name || user.username}
            </h3>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${roleColor}`}>
              {roleLabel}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-300">@{user.username}</span>
          </div>
          
          {/* 이메일 */}
          {user.email && (
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {user.email}
            </p>
          )}
        </div>
      </div>

      {/* 하단 액션 영역 */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
        {/* 역할 표시 */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${user.role === 'USER' ? 'text-purple-600 dark:text-purple-300' : 'text-blue-600 dark:text-blue-300'}`}>
            {roleLabel}
          </span>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-2 ml-auto">
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user)}
              className="flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-700 dark:border-red-500/50 dark:bg-slate-800 dark:text-red-300 dark:hover:border-red-500/70 dark:hover:bg-red-500/20"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserList({ users, isLoading, onAdd, onEdit, onDelete, isAdminPage = false }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  // 필터링된 사용자 목록
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
        <div className="flex items-center gap-2 px-4 py-3">
          <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-50">{isAdminPage ? '관리자 목록' : '사용자 목록'}</h3>
        </div>
        <div className="p-4">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col bg-white dark:bg-slate-900 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <svg className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{isAdminPage ? '관리자 목록' : '사용자 목록'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {filteredUsers.length}명의 {isAdminPage ? '관리자' : '사용자'}
            </p>
          </div>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 sm:shrink-0"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isAdminPage ? '새 관리자 추가' : '새 사용자 추가'}
          </button>
        )}
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* 검색 */}
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="사용자명, 이름 또는 이메일로 검색..."
                className="h-8 w-full rounded-lg border border-slate-300 bg-white py-0 pl-10 pr-10 text-xs text-slate-900 placeholder-slate-500 transition-colors focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-slate-500 dark:focus:bg-slate-800 dark:focus:ring-slate-600"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 역할 필터 */}
          <div className="sm:w-48">
            <CustomSelect
              value={roleFilter}
              onChange={(value) => setRoleFilter(value)}
              options={[
                { value: '', label: '전체 역할' },
                { value: 'USER', label: '관리자' },
                { value: 'MEMBER', label: '사용자' },
              ]}
              placeholder="전체 역할"
            />
          </div>
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-white p-4 dark:bg-slate-900">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center mb-3">
                <svg className="h-12 w-12 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                {searchTerm || roleFilter ? '검색 결과가 없습니다' : `등록된 ${isAdminPage ? '관리자' : '사용자'}가 없습니다`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mb-3">
                {searchTerm || roleFilter ? '다른 검색어를 시도해보세요' : `새 ${isAdminPage ? '관리자' : '사용자'}를 추가하여 시작하세요`}
              </p>
              {onAdd && !searchTerm && !roleFilter && (
                <button
                  onClick={onAdd}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  첫 사용자 추가하기
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

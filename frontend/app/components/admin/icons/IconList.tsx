'use client';

import { useState, useMemo } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';

interface Icon {
  id: string;
  iconId: string;
  name: string;
  svgCode: string;
  enabled?: boolean;
}

interface IconListProps {
  icons: Icon[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (icon: Icon) => void;
  onDelete?: (icon: Icon) => void;
  onToggleEnabled?: (icon: Icon, enabled: boolean) => void;
}

function IconItem({ icon, onEdit, onDelete, onToggleEnabled }: { icon: Icon; onEdit?: (icon: Icon) => void; onDelete?: (icon: Icon) => void; onToggleEnabled?: (icon: Icon, enabled: boolean) => void }) {
  return (
    <div className="group flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:hover:border-[#303650] dark:hover:bg-[#1a1e2c]">
      {/* 아이콘 미리보기 */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-50 dark:border-[#1f2435] dark:bg-[#1a1e2c]">
        <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon.svgCode} />
        </svg>
      </div>

      {/* 아이콘 정보 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-900 dark:text-white truncate">{icon.name}</span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-gray-600 dark:bg-[#1a1e2c] dark:text-gray-400 shrink-0">
            {icon.iconId}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[10px] text-gray-500 dark:text-gray-400">
          {icon.svgCode.length > 50 ? `${icon.svgCode.substring(0, 50)}...` : icon.svgCode}
        </p>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {/* 상태 토글 */}
        {onToggleEnabled && (
          <div className="flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-1 dark:border-[#1f2435] dark:bg-[#0f1119]">
            <ToggleSwitch
              enabled={icon.enabled ?? true}
              onToggle={(enabled) => onToggleEnabled(icon, enabled)}
              size="sm"
            />
            <span className={`text-[10px] font-medium whitespace-nowrap ${icon.enabled ?? true ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {icon.enabled ?? true ? '활성' : '비활성'}
            </span>
          </div>
        )}

        {/* 수정/삭제 버튼 */}
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(icon)}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-300 dark:hover:bg-[#1a1e2c]"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(icon)}
              className="rounded border border-red-300 bg-white px-2 py-1 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-[#0f1119] dark:text-red-400 dark:hover:bg-red-500/10"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IconList({ icons, isLoading, onAdd, onEdit, onDelete, onToggleEnabled }: IconListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 필터링된 아이콘 목록
  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.iconId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.svgCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [icons, searchTerm]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
        <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">아이콘 목록</h3>
        </div>
        <div className="p-4">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119] overflow-visible">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">아이콘 목록</h3>
      </div>

      {/* 검색 영역 */}
      <div className="relative z-10 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-[#1f2435] dark:bg-[#141827]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* 검색 */}
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="아이콘명, ID 또는 SVG 코드로 검색..."
                className="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-8 pr-2 text-xs text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650] dark:focus:bg-[#1f2435]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 추가 버튼 */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-300 dark:hover:bg-[#1a1e2c] sm:shrink-0"
            >
              새 아이콘 추가
            </button>
          )}
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-1.5 dark:bg-[#0f1119] sm:p-2">
        {filteredIcons.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={
                <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              }
              message={searchTerm ? '검색 조건에 맞는 아이콘이 없습니다.' : '등록된 아이콘이 없습니다.'}
            />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredIcons.map((icon) => (
              <IconItem key={icon.id} icon={icon} onEdit={onEdit} onDelete={onDelete} onToggleEnabled={onToggleEnabled} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


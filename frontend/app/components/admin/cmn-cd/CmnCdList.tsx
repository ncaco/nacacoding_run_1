'use client';

import { useState, useMemo } from 'react';
import ListHeader from '../ListHeader';
import ToggleSwitch from '../ToggleSwitch';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';

interface CmnCd {
  id: string;
  cd: string;
  name: string;
  description?: string;
  enabled?: boolean;
  parentCd?: string;
  children?: CmnCd[];
}

interface CmnCdListProps {
  cmnCds: CmnCd[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (cmnCd: CmnCd) => void;
  onDelete?: (cmnCd: CmnCd) => void;
  onToggleEnabled?: (cmnCd: CmnCd, enabled: boolean) => void;
}

function CmnCdTreeItem({ cmnCd, level = 0, onEdit, onDelete, onToggleEnabled }: { cmnCd: CmnCd; level?: number; onEdit?: (cmnCd: CmnCd) => void; onDelete?: (cmnCd: CmnCd) => void; onToggleEnabled?: (cmnCd: CmnCd, enabled: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = cmnCd.children && cmnCd.children.length > 0;
  const isParent = cmnCd.cd.startsWith('P');

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 sm:gap-2 sm:p-3 ${
          level > 0 ? 'ml-4 sm:ml-6' : ''
        }`}
      >
        {/* 확장/축소 아이콘 */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 sm:h-6 sm:w-6"
          >
            <svg
              className={`h-3.5 w-3.5 text-gray-500 transition-transform sm:h-4 sm:w-4 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <div className="w-5 sm:w-6" />}

        {/* 코드 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono font-semibold sm:px-2 ${
                isParent
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}
            >
              {cmnCd.cd}
            </span>
            <span className="text-xs font-medium text-gray-900 dark:text-white truncate sm:text-sm">{cmnCd.name}</span>
          </div>
          {cmnCd.description && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 sm:mt-1">{cmnCd.description}</p>
          )}
        </div>

        {/* 오른쪽 액션 영역: 상태 토글 + 작업 버튼 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 상태 토글 스위치 */}
          {onToggleEnabled && (
            <div className="flex w-[80px] items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-gray-800 sm:gap-2 sm:w-[88px] sm:px-2.5">
              <ToggleSwitch
                enabled={cmnCd.enabled ?? true}
                onToggle={(enabled) => onToggleEnabled(cmnCd, enabled)}
                size="sm"
              />
              <span className={`text-xs font-medium whitespace-nowrap ${cmnCd.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {cmnCd.enabled ? '활성' : '비활성'}
              </span>
            </div>
          )}

          {/* 작업 버튼 */}
          {(onEdit || onDelete) && (
            <div className="flex gap-1 sm:gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(cmnCd)}
                  className="rounded-lg border border-green-600 bg-white px-2 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20 sm:px-3 sm:py-1.5"
                >
                  수정
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(cmnCd)}
                  className="rounded-lg border border-red-600 bg-white px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 sm:px-3 sm:py-1.5"
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 자식 항목 */}
      {hasChildren && isExpanded && (
        <div className="mt-1.5 space-y-1.5 sm:mt-2 sm:space-y-2">
          {cmnCd.children!.map((child) => (
            <CmnCdTreeItem key={child.id} cmnCd={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} onToggleEnabled={onToggleEnabled} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CmnCdList({ cmnCds, isLoading, onAdd, onEdit, onDelete, onToggleEnabled }: CmnCdListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 전체 코드를 평면화하여 검색
  const flattenCmnCds = (codes: CmnCd[]): CmnCd[] => {
    const result: CmnCd[] = [];
    codes.forEach((code) => {
      result.push(code);
      if (code.children) {
        result.push(...flattenCmnCds(code.children));
      }
    });
    return result;
  };

  // 필터링된 공통코드 목록
  const filteredCmnCds = useMemo(() => {
    if (!searchTerm && !statusFilter) {
      return cmnCds;
    }

    const allCodes = flattenCmnCds(cmnCds);
    const filtered = allCodes.filter((code) => {
      const matchesSearch =
        !searchTerm ||
        code.cd.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'enabled' && code.enabled) ||
        (statusFilter === 'disabled' && !code.enabled);

      return matchesSearch && matchesStatus;
    });

    // 필터링된 결과를 트리 구조로 재구성
    if (searchTerm || statusFilter) {
      const parentMap = new Map<string, CmnCd>();
      const childMap = new Map<string, CmnCd[]>();

      filtered.forEach((code) => {
        if (!code.parentCd) {
          // 부모 코드
          const parent = { ...code, children: [] };
          parentMap.set(code.cd, parent);
        } else {
          // 자식 코드
          if (!childMap.has(code.parentCd!)) {
            childMap.set(code.parentCd!, []);
          }
          childMap.get(code.parentCd!)!.push({ ...code, children: [] });
        }
      });

      // 부모 코드에 자식 코드 연결
      parentMap.forEach((parent) => {
        if (childMap.has(parent.cd)) {
          parent.children = childMap.get(parent.cd)!;
        }
      });

      return Array.from(parentMap.values());
    }

    return cmnCds;
  }, [cmnCds, searchTerm, statusFilter]);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const hasActiveFilters = searchTerm || statusFilter;
  const totalCount = flattenCmnCds(cmnCds).length;
  const filteredCount = flattenCmnCds(filteredCmnCds).length;

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
        <ListHeader title="공통코드 목록" actionLabel="새 공통코드 추가" onAction={onAdd} />
        <div className="p-4 sm:p-6">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
      <ListHeader title="공통코드 목록" actionLabel="새 공통코드 추가" onAction={onAdd} />

      {/* 검색 조건 영역 */}
      <div className="border-b border-gray-200 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:py-4">
        <div className="space-y-2 sm:space-y-3">
          {/* 첫 번째 행: 검색어 */}
          <div>
            <label htmlFor="search" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300 sm:mb-1.5">
              검색
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="코드, 명칭 또는 설명으로 검색..."
                className="block w-full pl-9 pr-9 py-1.5 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 sm:py-2"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* 두 번째 행: 필터와 초기화 버튼 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
            <div className="flex flex-1 flex-wrap gap-2 sm:gap-3">
              {/* 상태 필터 */}
              <div className="flex-1 min-w-[120px] sm:min-w-[160px]">
                <label htmlFor="status" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300 sm:mb-1.5">
                  상태
                </label>
                <div className="relative">
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-2.5 py-1.5 pl-2.5 pr-8 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:px-3 sm:py-2 sm:pl-3"
                  >
                    <option value="">전체</option>
                    <option value="enabled">활성화</option>
                    <option value="disabled">비활성화</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 초기화 버튼 */}
            {hasActiveFilters && (
              <div className="sm:shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>초기화</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="p-3 sm:p-6">
        {/* 조회 건수 표시 */}
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">조회 건수:</span>
          <span className="text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">{filteredCount}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">/ {totalCount}</span>
        </div>

        {/* 트리 목록 */}
        {filteredCmnCds.length === 0 ? (
          <EmptyState
            icon={
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            message={hasActiveFilters ? '검색 조건에 맞는 공통코드가 없습니다.' : '등록된 공통코드가 없습니다.'}
          />
        ) : (
          <div className="space-y-1.5 sm:space-y-2">
            {filteredCmnCds.map((cmnCd) => (
              <CmnCdTreeItem key={cmnCd.id} cmnCd={cmnCd} onEdit={onEdit} onDelete={onDelete} onToggleEnabled={onToggleEnabled} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


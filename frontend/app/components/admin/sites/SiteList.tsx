'use client';

import { useState, useMemo } from 'react';
import DataTable from '../DataTable';
import ListHeader from '../ListHeader';
import StatusBadge from '../StatusBadge';

interface Site {
  id: string;
  siteType: string;
  siteName: string;
  description?: string;
  version: string;
  enabled: boolean;
}

interface SiteListProps {
  sites: Site[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (site: Site) => void;
  onDelete?: (site: Site) => void;
}

export default function SiteList({ sites, isLoading, onAdd, onEdit, onDelete }: SiteListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [siteTypeFilter, setSiteTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 필터링된 사이트 목록
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      // 사이트명 검색
      const matchesSearch = site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (site.description && site.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // 사이트 타입 필터
      const matchesType = !siteTypeFilter || site.siteType === siteTypeFilter;

      // 상태 필터
      const matchesStatus = statusFilter === '' || 
        (statusFilter === 'enabled' && site.enabled) ||
        (statusFilter === 'disabled' && !site.enabled);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [sites, searchTerm, siteTypeFilter, statusFilter]);

  const handleReset = () => {
    setSearchTerm('');
    setSiteTypeFilter('');
    setStatusFilter('');
  };

  const columns = [
    {
      key: 'siteType',
      label: '사이트 타입',
      render: (site: Site) => (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
          {site.siteType === 'ADMIN' ? '통합관리사이트' : site.siteType === 'PORTAL' ? '메인포털사이트' : site.siteType}
        </span>
      ),
    },
    {
      key: 'siteName',
      label: '사이트명',
    },
    {
      key: 'description',
      label: '설명',
      render: (site: Site) => site.description || '-',
    },
    {
      key: 'version',
      label: '버전',
    },
    {
      key: 'enabled',
      label: '상태',
      render: (site: Site) => <StatusBadge enabled={site.enabled ?? true} />,
    },
  ];

  const mobileCardRender = (site: Site) => (
    <div key={site.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{site.siteName}</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {site.siteType === 'ADMIN' ? '통합관리사이트' : site.siteType === 'PORTAL' ? '메인포털사이트' : site.siteType}
          </p>
          {site.description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{site.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">버전: {site.version}</p>
        </div>
        <StatusBadge enabled={site.enabled ?? true} />
      </div>
      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(site)}
              className="flex-1 rounded-lg border border-green-600 bg-white px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(site)}
              className="flex-1 rounded-lg border border-red-600 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  );

  const hasActiveFilters = searchTerm || siteTypeFilter || statusFilter;

  // 활성 필터 개수
  const activeFilterCount = [searchTerm, siteTypeFilter, statusFilter].filter(Boolean).length;

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
      <ListHeader title="사이트 목록" actionLabel="새 사이트 추가" onAction={onAdd} />
      
      {/* 검색 조건 영역 */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="space-y-3">
          {/* 첫 번째 행: 검색어 */}
          <div>
            <label htmlFor="search" className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
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
                placeholder="사이트명 또는 설명으로 검색..."
                className="block w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-wrap gap-3">
              {/* 사이트 타입 필터 */}
              <div className="flex-1 min-w-[140px] sm:min-w-[160px]">
                <label htmlFor="siteType" className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  사이트 타입
                </label>
                <div className="relative">
                  <select
                    id="siteType"
                    value={siteTypeFilter}
                    onChange={(e) => setSiteTypeFilter(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pl-3 pr-8 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">전체</option>
                    <option value="ADMIN">통합관리사이트</option>
                    <option value="PORTAL">메인포털사이트</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 상태 필터 */}
              <div className="flex-1 min-w-[140px] sm:min-w-[160px]">
                <label htmlFor="status" className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  상태
                </label>
                <div className="relative">
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pl-3 pr-8 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
              <div className="sm:flex-shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>초기화</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 활성 필터 표시 */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">적용된 필터:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  검색: {searchTerm.length > 20 ? `${searchTerm.substring(0, 20)}...` : searchTerm}
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:text-blue-600 dark:hover:text-blue-200 transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {siteTypeFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                  타입: {siteTypeFilter === 'ADMIN' ? '통합관리사이트' : '메인포털사이트'}
                  <button
                    type="button"
                    onClick={() => setSiteTypeFilter('')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  상태: {statusFilter === 'enabled' ? '활성화' : '비활성화'}
                  <button
                    type="button"
                    onClick={() => setStatusFilter('')}
                    className="hover:text-green-600 dark:hover:text-green-200 transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="p-4 sm:p-6">
        {/* 조회 건수 표시 (왼쪽 상단) */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            조회 건수:
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {filteredSites.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            / {sites.length}
          </span>
        </div>

        <DataTable
          data={filteredSites}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            icon: (
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            ),
            message: hasActiveFilters ? '검색 조건에 맞는 사이트가 없습니다.' : '등록된 사이트가 없습니다.',
          }}
          onEdit={onEdit}
          onDelete={onDelete}
          mobileCardRender={mobileCardRender}
        />
      </div>
    </div>
  );
}


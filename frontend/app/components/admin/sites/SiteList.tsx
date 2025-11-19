'use client';

import { useState, useMemo } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import CustomSelect from '../CustomSelect';

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

function SiteItem({ site, onEdit, onDelete }: { site: Site; onEdit?: (site: Site) => void; onDelete?: (site: Site) => void }) {
  return (
    <div className="group flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:hover:border-[#303650] dark:hover:bg-[#1a1e2c]">
      {/* 사이트 타입 배지 */}
      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
        {site.siteType === 'ADMIN' ? '관리' : site.siteType === 'PORTAL' ? '포털' : site.siteType}
      </span>

      {/* 사이트명과 설명 */}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{site.siteName}</div>
        {site.description && (
          <div className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{site.description}</div>
        )}
        <div className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">v{site.version}</div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {/* 상태 표시 */}
        <div className="flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-1 dark:border-[#1f2435] dark:bg-[#0f1119]">
          <span className={`text-[10px] font-medium whitespace-nowrap ${site.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {site.enabled ? '활성' : '비활성'}
          </span>
        </div>

        {/* 수정/삭제 버튼 */}
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(site)}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-300 dark:hover:bg-[#1a1e2c]"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(site)}
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

export default function SiteList({ sites, isLoading, onAdd, onEdit, onDelete }: SiteListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [siteTypeFilter, setSiteTypeFilter] = useState<string>('');

  // 필터링된 사이트 목록
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchesSearch = site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (site.description && site.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = !siteTypeFilter || site.siteType === siteTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [sites, searchTerm, siteTypeFilter]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
        <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">사이트 목록</h3>
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
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">사이트 목록</h3>
      </div>

      {/* 검색 및 필터 영역 */}
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
                placeholder="사이트명 또는 설명으로 검색..."
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

          {/* 사이트 타입 필터 */}
          <div className="sm:w-40">
            <CustomSelect
              value={siteTypeFilter}
              onChange={(value) => setSiteTypeFilter(value)}
              options={[
                { value: '', label: '전체 타입' },
                { value: 'ADMIN', label: '통합관리사이트' },
                { value: 'PORTAL', label: '메인포털사이트' },
              ]}
              placeholder="전체 타입"
            />
          </div>

          {/* 추가 버튼 */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="rounded border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-300 dark:hover:bg-[#1a1e2c] sm:shrink-0"
            >
              새 사이트 추가
            </button>
          )}
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-1.5 dark:bg-[#0f1119] sm:p-2">
        {filteredSites.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={
                <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              }
              message={searchTerm || siteTypeFilter ? '검색 조건에 맞는 사이트가 없습니다.' : '등록된 사이트가 없습니다.'}
            />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSites.map((site) => (
              <SiteItem
                key={site.id}
                site={site}
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

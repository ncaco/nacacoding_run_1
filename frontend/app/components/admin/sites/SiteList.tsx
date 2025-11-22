'use client';

import { useState, useMemo } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import LoadingState from '../LoadingState';
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
  onToggleEnabled?: (site: Site, enabled: boolean) => void;
  siteTypeOptions?: Array<{ value: string; label: string }>;
}

function SiteItem({ site, onEdit, onDelete, onToggleEnabled, siteTypeOptions = [] }: { site: Site; onEdit?: (site: Site) => void; onDelete?: (site: Site) => void; onToggleEnabled?: (site: Site, enabled: boolean) => void; siteTypeOptions?: Array<{ value: string; label: string }> }) {
  const siteTypeLabel = siteTypeOptions.find((opt) => opt.value === site.siteType)?.label || site.siteType;
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-lg">
      {/* 상단 영역 */}
      <div className="flex items-start gap-3 mb-3">
        {/* 사이트 아이콘 */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          <svg className="h-5 w-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {site.siteName}
            </h3>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-white">
              {siteTypeLabel}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-300">v{site.version}</span>
          </div>
          
          {/* 설명 */}
          {site.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {site.description}
            </p>
          )}
        </div>
      </div>

      {/* 하단 액션 영역 */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
        {/* 상태 토글 */}
        {onToggleEnabled && (
          <div className="flex items-center gap-2">
            <ToggleSwitch
              enabled={site.enabled ?? true}
              onToggle={(enabled) => onToggleEnabled(site, enabled)}
              size="sm"
            />
                 <span className={`text-xs font-medium ${site.enabled ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-300'}`}>
              {site.enabled ? '활성' : '비활성'}
            </span>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-2 ml-auto">
          {onEdit && (
            <button
              onClick={() => onEdit(site)}
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
              onClick={() => onDelete(site)}
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

export default function SiteList({ sites, isLoading, onAdd, onEdit, onDelete, onToggleEnabled, siteTypeOptions = [] }: SiteListProps) {
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
        <div className="flex items-center gap-2 px-4 py-3">
          <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-50">사이트 목록</h3>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">사이트 목록</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {filteredSites.length}개의 사이트
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
            새 사이트 추가
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
                placeholder="사이트명 또는 설명으로 검색..."
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

          {/* 사이트 타입 필터 */}
          <div className="sm:w-48">
            <CustomSelect
              value={siteTypeFilter}
              onChange={(value) => setSiteTypeFilter(value)}
              options={[
                { value: '', label: '전체 타입' },
                ...siteTypeOptions,
              ]}
              placeholder="전체 타입"
            />
          </div>
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-white p-4 dark:bg-slate-900">
        {filteredSites.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center mb-3">
                <svg className="h-12 w-12 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                {searchTerm || siteTypeFilter ? '검색 결과가 없습니다' : '등록된 사이트가 없습니다'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mb-3">
                {searchTerm || siteTypeFilter ? '다른 검색어를 시도해보세요' : '새 사이트를 추가하여 시작하세요'}
              </p>
              {onAdd && !searchTerm && !siteTypeFilter && (
                <button
                  onClick={onAdd}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  첫 사이트 추가하기
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSites.map((site) => (
              <SiteItem
                key={site.id}
                site={site}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleEnabled={onToggleEnabled}
                siteTypeOptions={siteTypeOptions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

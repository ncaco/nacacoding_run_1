'use client';

import { useState } from 'react';
import DataTable from '../DataTable';
import ListHeader from '../ListHeader';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import StatusBadge from '../StatusBadge';

interface Site {
  id: string;
  siteType: string;
  siteName: string;
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
  const columns = [
    {
      key: 'siteType',
      label: '사이트 타입',
    },
    {
      key: 'siteName',
      label: '사이트명',
    },
    {
      key: 'version',
      label: '버전',
    },
    {
      key: 'enabled',
      label: '상태',
      render: (site: Site) => <StatusBadge enabled={site.enabled} />,
    },
  ];

  const mobileCardRender = (site: Site) => (
    <div key={site.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{site.siteName}</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{site.siteType}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">버전: {site.version}</p>
        </div>
        <StatusBadge enabled={site.enabled} />
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

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
      <ListHeader title="사이트 목록" actionLabel="새 사이트 추가" onAction={onAdd} />
      <div className="p-4 sm:p-6">
        <DataTable
          data={sites}
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
            message: '등록된 사이트가 없습니다.',
          }}
          onEdit={onEdit}
          onDelete={onDelete}
          mobileCardRender={mobileCardRender}
        />
      </div>
    </div>
  );
}


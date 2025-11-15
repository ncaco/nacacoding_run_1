'use client';

import StatCards from '../StatCards';
import RecentActivity from '../RecentActivity';

export default function OverviewTab() {
  const stats = [
    {
      title: '전체 사이트',
      value: 0,
      icon: (
        <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: '전체 메뉴',
      value: 0,
      icon: (
        <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: '전체 사용자',
      value: 0,
      icon: (
        <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: '전체 로그',
      value: 0,
      icon: (
        <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <StatCards stats={stats} />
      <RecentActivity />
    </div>
  );
}


'use client';

import TabContainer from '../components/admin/TabContainer';
import OverviewTab from '../components/admin/dashboard/OverviewTab';
import StatsTab from '../components/admin/dashboard/StatsTab';

export default function AdminDashboard() {
  const tabs = [
    {
      id: 'overview',
      label: '개요',
      content: <OverviewTab />,
    },
    {
      id: 'stats',
      label: '통계',
      content: <StatsTab />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <TabContainer tabs={tabs} />
    </div>
  );
}


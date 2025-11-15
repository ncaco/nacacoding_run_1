'use client';

import AdminLayout from '../components/admin/AdminLayout';
import TabContainer from '../components/admin/TabContainer';
import PageHeader from '../components/admin/PageHeader';
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
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title="대시보드" description="시스템 개요 및 통계를 확인하세요." />
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}


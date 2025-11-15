'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';
import PageHeader from '../../components/admin/PageHeader';
import SiteList from '../../components/admin/sites/SiteList';
import SiteForm from '../../components/admin/sites/SiteForm';

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    // TODO: 추가 로직 구현
    console.log('사이트 추가');
  };

  const handleEdit = (site: any) => {
    // TODO: 수정 로직 구현
    console.log('사이트 수정', site);
  };

  const handleDelete = (site: any) => {
    // TODO: 삭제 로직 구현
    console.log('사이트 삭제', site);
  };

  const handleSubmit = (data: any) => {
    // TODO: 제출 로직 구현
    console.log('사이트 생성', data);
  };

  const tabs = [
    {
      id: 'list',
      label: '사이트 목록',
      content: (
        <SiteList
          sites={sites}
          isLoading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
    {
      id: 'create',
      label: '사이트 생성',
      content: <SiteForm onSubmit={handleSubmit} />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title="사이트 관리" description="사이트를 생성, 수정, 삭제할 수 있습니다." />
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}


'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';
import PageHeader from '../../components/admin/PageHeader';
import MenuList from '../../components/admin/menus/MenuList';
import MenuForm from '../../components/admin/menus/MenuForm';

export default function MenusPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    // TODO: 추가 로직 구현
    console.log('메뉴 추가');
  };

  const handleEdit = (menu: any) => {
    // TODO: 수정 로직 구현
    console.log('메뉴 수정', menu);
  };

  const handleDelete = (menu: any) => {
    // TODO: 삭제 로직 구현
    console.log('메뉴 삭제', menu);
  };

  const handleSubmit = (data: any) => {
    // TODO: 제출 로직 구현
    console.log('메뉴 생성', data);
  };

  const tabs = [
    {
      id: 'list',
      label: '메뉴 목록',
      content: (
        <MenuList
          menus={menus}
          isLoading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
    {
      id: 'create',
      label: '메뉴 생성',
      content: <MenuForm onSubmit={handleSubmit} />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title="메뉴 관리" description="메뉴를 생성, 수정, 삭제할 수 있습니다." />
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}

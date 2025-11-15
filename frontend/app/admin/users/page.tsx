'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';
import PageHeader from '../../components/admin/PageHeader';
import UserList from '../../components/admin/users/UserList';
import UserForm from '../../components/admin/users/UserForm';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    // TODO: 추가 로직 구현
    console.log('사용자 추가');
  };

  const handleEdit = (user: any) => {
    // TODO: 수정 로직 구현
    console.log('사용자 수정', user);
  };

  const handleDelete = (user: any) => {
    // TODO: 삭제 로직 구현
    console.log('사용자 삭제', user);
  };

  const handleSubmit = (data: any) => {
    // TODO: 제출 로직 구현
    console.log('사용자 생성', data);
  };

  const tabs = [
    {
      id: 'list',
      label: '사용자 목록',
      content: (
        <UserList
          users={users}
          isLoading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
    {
      id: 'create',
      label: '사용자 생성',
      content: <UserForm onSubmit={handleSubmit} />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title="사용자 관리" description="사용자를 생성, 수정, 삭제할 수 있습니다." />
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}

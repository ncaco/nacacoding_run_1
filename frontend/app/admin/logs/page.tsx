'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';
import LogList from '../../components/admin/logs/LogList';
import LogForm from '../../components/admin/logs/LogForm';

interface Log {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
}

interface LogFormData {
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export default function LogsPage() {
  const [logs] = useState<Log[]>([]);
  const [isLoading] = useState(false);

  const handleAdd = () => {
    // TODO: 추가 로직 구현
    console.log('로그 추가');
  };

  const handleDelete = (log: Log) => {
    // TODO: 삭제 로직 구현
    console.log('로그 삭제', log);
  };

  const handleSubmit = (data: LogFormData) => {
    // TODO: 제출 로직 구현
    console.log('로그 추가', data);
  };

  const tabs = [
    {
      id: 'list',
      label: '로그 목록',
      content: (
        <LogList
          logs={logs}
          isLoading={isLoading}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      ),
    },
    {
      id: 'create',
      label: '로그 추가',
      content: <LogForm onSubmit={handleSubmit} />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <TabContainer tabs={tabs} />
      </div>
    </AdminLayout>
  );
}

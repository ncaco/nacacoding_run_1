'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import TabContainer from '../../components/admin/TabContainer';
import FileList from '../../components/admin/files/FileList';
import FileUpload from '../../components/admin/files/FileUpload';

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = () => {
    // TODO: 업로드 로직 구현
    console.log('파일 업로드');
  };

  const handleDownload = (file: any) => {
    // TODO: 다운로드 로직 구현
    console.log('파일 다운로드', file);
  };

  const handleDelete = (file: any) => {
    // TODO: 삭제 로직 구현
    console.log('파일 삭제', file);
  };

  const handleSubmit = (file: File) => {
    // TODO: 제출 로직 구현
    console.log('파일 업로드', file);
  };

  const tabs = [
    {
      id: 'list',
      label: '파일 목록',
      content: (
        <FileList
          files={files}
          isLoading={isLoading}
          onUpload={handleUpload}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      ),
    },
    {
      id: 'upload',
      label: '파일 업로드',
      content: <FileUpload onSubmit={handleSubmit} />,
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

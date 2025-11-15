'use client';

import { useState } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface UserFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    username?: string;
    password?: string;
    role?: 'MEMBER' | 'USER';
  };
}

export default function UserForm({ onSubmit, onCancel, initialData }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    password: initialData?.password || '',
    role: initialData?.role || 'MEMBER',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">새 사용자 생성</h3>
      <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
        <FormField
          label="사용자명"
          name="username"
          type="text"
          required
          placeholder="사용자명을 입력하세요"
          value={formData.username}
          onChange={(value) => setFormData({ ...formData, username: value })}
        />
        <FormField
          label="비밀번호"
          name="password"
          type="password"
          required
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
        />
        <FormField
          label="역할"
          name="role"
          type="select"
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
          options={[
            { value: 'MEMBER', label: '사용자 (MEMBER)' },
            { value: 'USER', label: '관리자 (USER)' },
          ]}
        />
        <FormActions onCancel={onCancel} onSubmit={handleSubmit} submitLabel="생성" />
      </form>
    </div>
  );
}


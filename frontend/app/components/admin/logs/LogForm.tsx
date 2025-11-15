'use client';

import { useState } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface LogFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    level?: 'INFO' | 'WARN' | 'ERROR';
    message?: string;
  };
}

export default function LogForm({ onSubmit, onCancel, initialData }: LogFormProps) {
  const [formData, setFormData] = useState({
    level: initialData?.level || 'INFO',
    message: initialData?.message || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">새 로그 추가</h3>
      <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
        <FormField
          label="레벨"
          name="level"
          type="select"
          value={formData.level}
          onChange={(value) => setFormData({ ...formData, level: value })}
          options={[
            { value: 'INFO', label: 'INFO' },
            { value: 'WARN', label: 'WARN' },
            { value: 'ERROR', label: 'ERROR' },
          ]}
        />
        <FormField
          label="메시지"
          name="message"
          type="textarea"
          rows={4}
          placeholder="로그 메시지를 입력하세요"
          value={formData.message}
          onChange={(value) => setFormData({ ...formData, message: value })}
        />
        <FormActions onCancel={onCancel} onSubmit={handleSubmit} submitLabel="추가" />
      </form>
    </div>
  );
}


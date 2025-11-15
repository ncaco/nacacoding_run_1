'use client';

import { useState } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface SiteFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    siteType?: string;
    siteName?: string;
    description?: string;
    version?: string;
    enabled?: boolean;
  };
}

export default function SiteForm({ onSubmit, onCancel, initialData }: SiteFormProps) {
  const [formData, setFormData] = useState({
    siteType: initialData?.siteType || '',
    siteName: initialData?.siteName || '',
    description: initialData?.description || '',
    version: initialData?.version || '',
    enabled: initialData?.enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">새 사이트 생성</h3>
      <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
        <FormField
          label="사이트 타입"
          name="siteType"
          type="select"
          required
          value={formData.siteType}
          onChange={(value) => setFormData({ ...formData, siteType: value })}
          options={[
            { value: '', label: '선택하세요' },
            { value: 'ADMIN', label: '통합관리사이트' },
            { value: 'PORTAL', label: '메인포털사이트' },
          ]}
        />
        <FormField
          label="사이트명"
          name="siteName"
          type="text"
          required
          placeholder="사이트명을 입력하세요"
          value={formData.siteName}
          onChange={(value) => setFormData({ ...formData, siteName: value })}
        />
        <FormField
          label="설명"
          name="description"
          type="textarea"
          rows={3}
          placeholder="사이트 설명을 입력하세요"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
        <FormField
          label="버전"
          name="version"
          type="text"
          placeholder="예: 1.0.0"
          value={formData.version}
          onChange={(value) => setFormData({ ...formData, version: value })}
        />
        <FormField
          label="활성화"
          name="enabled"
          type="checkbox"
          placeholder="활성화"
          value={formData.enabled}
          onChange={(value) => setFormData({ ...formData, enabled: value })}
        />
        <FormActions onCancel={onCancel} onSubmit={handleSubmit} submitLabel="생성" />
      </form>
    </div>
  );
}


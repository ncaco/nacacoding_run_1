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
  isLoading?: boolean;
}

export default function SiteForm({ onSubmit, onCancel, initialData, isLoading = false }: SiteFormProps) {
  const isEditMode = !!initialData?.siteName;
  
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
      <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
        {isEditMode ? '사이트 수정' : '새 사이트 생성'}
      </h3>
      <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
        {!isEditMode && (
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
        )}
        {isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              사이트 타입
            </label>
            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {formData.siteType === 'ADMIN' ? '통합관리사이트' : formData.siteType === 'PORTAL' ? '메인포털사이트' : formData.siteType}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">사이트 타입은 변경할 수 없습니다.</p>
          </div>
        )}
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
          required
          placeholder="예: 1.0.0"
          value={formData.version}
          onChange={(value) => setFormData({ ...formData, version: value })}
        />
        {isEditMode && (
          <FormField
            label="활성화"
            name="enabled"
            type="checkbox"
            value={formData.enabled}
            onChange={(value) => setFormData({ ...formData, enabled: value })}
          />
        )}
        <FormActions
          onCancel={onCancel}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? '수정' : '생성'}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}


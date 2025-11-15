'use client';

import { useState } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface MenuFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    siteId?: string;
    name?: string;
    url?: string;
    displayOrder?: number;
    parentId?: string;
    enabled?: boolean;
  };
}

export default function MenuForm({ onSubmit, onCancel, initialData }: MenuFormProps) {
  const [formData, setFormData] = useState({
    siteId: initialData?.siteId || '',
    name: initialData?.name || '',
    url: initialData?.url || '',
    displayOrder: initialData?.displayOrder || 0,
    parentId: initialData?.parentId || '',
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
      <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">새 메뉴 생성</h3>
      <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
        <FormField
          label="사이트 선택"
          name="siteId"
          type="select"
          required
          value={formData.siteId}
          onChange={(value) => setFormData({ ...formData, siteId: value })}
          options={[{ value: '', label: '선택하세요' }]}
        />
        <FormField
          label="메뉴명"
          name="name"
          type="text"
          required
          placeholder="메뉴명을 입력하세요"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />
        <FormField
          label="URL"
          name="url"
          type="text"
          placeholder="/example"
          value={formData.url}
          onChange={(value) => setFormData({ ...formData, url: value })}
        />
        <FormField
          label="표시 순서"
          name="displayOrder"
          type="number"
          placeholder="0"
          value={formData.displayOrder}
          onChange={(value) => setFormData({ ...formData, displayOrder: Number(value) })}
        />
        <FormField
          label="부모 메뉴"
          name="parentId"
          type="select"
          value={formData.parentId}
          onChange={(value) => setFormData({ ...formData, parentId: value })}
          options={[{ value: '', label: '없음 (최상위 메뉴)' }]}
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


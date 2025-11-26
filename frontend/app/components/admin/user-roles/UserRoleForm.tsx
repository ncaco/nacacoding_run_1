'use client';

import { useState } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface UserRoleFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    roleCd?: string;
    roleNm?: string;
    roleDesc?: string;
    enabled?: boolean;
  };
  isLoading?: boolean;
}

export default function UserRoleForm({ onSubmit, onCancel, initialData, isLoading = false }: UserRoleFormProps) {
  const isEditMode = !!initialData?.roleCd;
  
  const [formData, setFormData] = useState({
    roleCd: initialData?.roleCd || '',
    roleNm: initialData?.roleNm || '',
    roleDesc: initialData?.roleDesc || '',
    enabled: initialData?.enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-[#1f2435] dark:bg-[#0f1119] sm:p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
        {isEditMode ? '역할 수정' : '새 역할 생성'}
      </h3>
      <form className="mt-4 space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
        {!isEditMode && (
          <FormField
            label="역할 코드"
            name="roleCd"
            type="text"
            required
            placeholder="예: ADMIN, MANAGER, OPERATOR"
            value={formData.roleCd}
            onChange={(value) => setFormData({ ...formData, roleCd: value.toUpperCase() })}
          />
        )}
        {isEditMode && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              역할 코드
            </label>
            <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-gray-400">
              {formData.roleCd}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">역할 코드는 변경할 수 없습니다.</p>
          </div>
        )}

        <FormField
          label="역할명"
          name="roleNm"
          type="text"
          required
          placeholder="역할명을 입력하세요"
          value={formData.roleNm}
          onChange={(value) => setFormData({ ...formData, roleNm: value })}
        />

        <FormField
          label="설명"
          name="roleDesc"
          type="textarea"
          rows={3}
          placeholder="역할 설명을 입력하세요"
          value={formData.roleDesc}
          onChange={(value) => setFormData({ ...formData, roleDesc: value })}
        />

        <FormField
          label="활성화"
          name="enabled"
          type="checkbox"
          value={formData.enabled}
          onChange={(value) => setFormData({ ...formData, enabled: value })}
        />

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


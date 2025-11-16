'use client';

import { useState, useEffect } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface CmnCd {
  id: string;
  cd: string;
  name: string;
  description?: string;
  enabled?: boolean;
  parentCd?: string;
  children?: CmnCd[];
}

interface CmnCdFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    cd?: string;
    name?: string;
    description?: string;
    enabled?: boolean;
    parentCd?: string;
  };
  isLoading?: boolean;
  parentCmnCds?: CmnCd[];
}

export default function CmnCdForm({ onSubmit, onCancel, initialData, isLoading = false, parentCmnCds = [] }: CmnCdFormProps) {
  const isEditMode = !!initialData?.cd;
  
  const [formData, setFormData] = useState({
    cd: initialData?.cd || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    enabled: initialData?.enabled ?? true,
    parentCd: initialData?.parentCd || '',
  });

  // 부모 코드 목록 (P로 시작하는 코드만)
  const parentCodeOptions = [
    { value: '', label: '없음 (1뎁스 코드)' },
    ...parentCmnCds
      .filter((code) => code.cd.startsWith('P'))
      .map((code) => ({
        value: code.cd,
        label: `${code.cd} - ${code.name}`,
      })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // 코드 입력 시 자동 포맷팅
  const handleCdChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^PC0-9]/g, '');
    if (upperValue.length <= 4) {
      setFormData({ ...formData, cd: upperValue });
    }
  };

  // 코드 형식 검증 메시지
  const getCdHelperText = () => {
    if (!formData.cd) return '';
    if (formData.cd.startsWith('P') && formData.cd.length === 4) {
      return '1뎁스 코드 형식 (P001~P999)';
    }
    if (formData.cd.startsWith('C') && formData.cd.length === 4) {
      return '2뎁스 코드 형식 (C001~C999) - 부모 코드를 선택해야 합니다.';
    }
    return '코드는 P001~P999 또는 C001~C999 형식이어야 합니다.';
  };

  return (
    <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base lg:text-lg">
        {isEditMode ? '공통코드 수정' : '새 공통코드 생성'}
      </h3>
      <form className="mt-3 space-y-3 sm:mt-6 sm:space-y-4" onSubmit={handleSubmit}>
        {!isEditMode && (
          <>
            <FormField
              label="코드"
              name="cd"
              type="text"
              required
              placeholder="P001 또는 C001"
              value={formData.cd}
              onChange={handleCdChange}
            />
            {formData.cd && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{getCdHelperText()}</p>
            )}

            <FormField
              label="부모 코드"
              name="parentCd"
              type="select"
              value={formData.parentCd}
              onChange={(value) => setFormData({ ...formData, parentCd: value })}
              options={parentCodeOptions}
            />
            {formData.cd.startsWith('C') && !formData.parentCd && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                2뎁스 코드(C001~C999)는 부모 코드를 선택해야 합니다.
              </p>
            )}
            {formData.cd.startsWith('P') && formData.parentCd && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                1뎁스 코드(P001~P999)는 부모 코드가 없어야 합니다.
              </p>
            )}
          </>
        )}
        {isEditMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              코드
            </label>
            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {formData.cd}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">코드는 변경할 수 없습니다.</p>
          </div>
        )}

        <FormField
          label="명칭"
          name="name"
          type="text"
          required
          placeholder="공통코드 명칭을 입력하세요"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />

        <FormField
          label="설명"
          name="description"
          type="textarea"
          rows={3}
          placeholder="공통코드 설명을 입력하세요"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
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


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
  siteTypeOptions?: Array<{ value: string; label: string }>;
}

export default function SiteForm({ onSubmit, onCancel, initialData, isLoading = false, siteTypeOptions = [] }: SiteFormProps) {
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

  // 버전 형식 검증 메시지
  const getVersionHelperText = () => {
    if (!formData.version) return '';
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (versionPattern.test(formData.version)) {
      return '올바른 버전 형식입니다. (예: 1.0.0)';
    }
    return '버전은 x.y.z 형식이어야 합니다. (예: 1.0.0)';
  };

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {isEditMode ? '사이트 수정' : '새 사이트 생성'}
        </h3>
      </div>

      {/* 폼 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-3 dark:bg-[#0f1119] sm:p-4">
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {!isEditMode && (
            <div>
              <FormField
                label="사이트 타입"
                name="siteType"
                type="select"
                required
                value={formData.siteType}
                onChange={(value) => setFormData({ ...formData, siteType: value })}
                options={[
                  { value: '', label: '선택하세요' },
                  ...siteTypeOptions,
                ]}
              />
              {!formData.siteType && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  사이트 타입을 선택해주세요.
                </p>
              )}
            </div>
          )}

          {isEditMode && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                사이트 타입
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#1f2435] dark:bg-[#1a1e2c]">
                <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {siteTypeOptions.find((opt) => opt.value === formData.siteType)?.label || formData.siteType}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({formData.siteType})
                </span>
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
            placeholder="사이트 설명을 입력하세요 (선택사항)"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
          />

          <div>
            <FormField
              label="버전"
              name="version"
              type="text"
              required
              placeholder="예: 1.0.0"
              value={formData.version}
              onChange={(value) => setFormData({ ...formData, version: value })}
            />
            {formData.version && (
              <p className={`mt-1 text-xs ${getVersionHelperText().includes('올바른') ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {getVersionHelperText()}
              </p>
            )}
            {!formData.version && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                버전은 x.y.z 형식으로 입력하세요. (예: 1.0.0, 2.1.3)
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-[#1f2435] dark:bg-[#1a1e2c]">
              <FormField
                label="활성화"
                name="enabled"
                type="checkbox"
                value={formData.enabled}
                onChange={(value) => setFormData({ ...formData, enabled: value })}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                비활성화된 사이트는 사용할 수 없습니다.
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 dark:border-[#1f2435]">
            <FormActions
              onCancel={onCancel}
              onSubmit={handleSubmit}
              submitLabel={isEditMode ? '수정' : '생성'}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

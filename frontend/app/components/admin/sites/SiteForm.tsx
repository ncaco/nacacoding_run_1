'use client';

import { useState, useEffect } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface SiteFormData {
  siteType?: string;
  siteName: string;
  description?: string;
  contextPath?: string;
  version: string;
  enabled?: boolean;
}

interface SiteFormProps {
  onSubmit?: (data: SiteFormData) => void;
  onCancel?: () => void;
  initialData?: {
    siteType?: string;
    siteName?: string;
    description?: string;
    contextPath?: string;
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
    contextPath: initialData?.contextPath || '',
    version: initialData?.version || '',
    enabled: initialData?.enabled ?? true,
  });

  // initialData가 변경되면 formData 업데이트
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        siteType: initialData.siteType || '',
        siteName: initialData.siteName || '',
        description: initialData.description || '',
        contextPath: initialData.contextPath !== undefined ? initialData.contextPath : '',
        version: initialData.version || '',
        enabled: initialData.enabled ?? true,
      });
    } else {
      // initialData가 없으면 (새로 생성하는 경우) 초기화
      setFormData({
        siteType: '',
        siteName: '',
        description: '',
        contextPath: '',
        version: '',
        enabled: true,
      });
    }
  }, [initialData]);

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
    <div className="flex h-[calc(100vh-180px)] flex-col bg-white dark:bg-slate-900 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          <svg className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {isEditMode ? '사이트 수정' : '새 사이트 생성'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            {isEditMode ? '사이트 정보를 수정합니다' : '새로운 사이트를 생성합니다'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white p-4 dark:bg-slate-900">
        <form className="space-y-3" onSubmit={handleSubmit}>
          {!isEditMode && (
            <div>
              <FormField
                label="사이트 타입"
                name="siteType"
                type="select"
                required
                value={formData.siteType}
                onChange={(value) => setFormData({ ...formData, siteType: String(value) })}
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
              <label className="block text-xs font-medium text-slate-700 dark:text-white mb-1">
                사이트 타입
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-white">
                  {siteTypeOptions.find((opt) => opt.value === formData.siteType)?.label || formData.siteType}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-300">
                  ({formData.siteType})
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">사이트 타입은 변경할 수 없습니다.</p>
            </div>
          )}

          <FormField
            label="사이트명"
            name="siteName"
            type="text"
            required
            placeholder="사이트명을 입력하세요"
            value={formData.siteName}
            onChange={(value) => setFormData({ ...formData, siteName: String(value) })}
          />

          <FormField
            label="설명"
            name="description"
            type="textarea"
            rows={3}
            placeholder="사이트 설명을 입력하세요 (선택사항)"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: String(value) })}
          />

          <FormField
            label="Context Path"
            name="contextPath"
            type="text"
            placeholder="예: '' (빈 값 = root), 'admin' = /admin, 공백(' ')도 가능"
            value={formData.contextPath}
            onChange={(value) => setFormData({ ...formData, contextPath: String(value) })}
            helperText="빈 값('')은 root 경로(포털사이트), 'admin'은 /admin 경로(관리자 사이트)를 의미합니다. 공백 문자열(' ')도 저장 가능합니다."
          />

          <div>
            <FormField
              label="버전"
              name="version"
              type="text"
              required
              placeholder="예: 1.0.0"
              value={formData.version}
              onChange={(value) => setFormData({ ...formData, version: String(value) })}
            />
            {formData.version && (
              <p className={`mt-1 text-xs ${getVersionHelperText().includes('올바른') ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {getVersionHelperText()}
              </p>
            )}
            {!formData.version && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                버전은 x.y.z 형식으로 입력하세요. (예: 1.0.0, 2.1.3)
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <FormField
                label="활성화"
                name="enabled"
                type="checkbox"
                value={formData.enabled}
                onChange={(value) => setFormData({ ...formData, enabled: Boolean(value) })}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                비활성화된 사이트는 사용할 수 없습니다.
              </p>
            </div>
          )}

          <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
            <FormActions
              onCancel={onCancel}
              submitLabel={isEditMode ? '수정' : '생성'}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

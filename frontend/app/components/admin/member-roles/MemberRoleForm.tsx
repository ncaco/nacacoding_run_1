'use client';

import { useState, useEffect } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface MemberRoleFormData {
  roleCd: string;
  roleNm: string;
  roleDesc?: string;
  enabled?: boolean;
}

interface MemberRoleFormProps {
  onSubmit?: (data: MemberRoleFormData) => void;
  onCancel?: () => void;
  initialData?: {
    id?: string;
    roleCd?: string;
    roleNm?: string;
    roleDesc?: string;
    enabled?: boolean;
  };
  isLoading?: boolean;
}

export default function MemberRoleForm({ onSubmit, onCancel, initialData, isLoading = false }: MemberRoleFormProps) {
  const isEditMode = !!initialData?.roleCd;
  
  const [formData, setFormData] = useState({
    roleCd: initialData?.roleCd || '',
    roleNm: initialData?.roleNm || '',
    roleDesc: initialData?.roleDesc || '',
    enabled: initialData?.enabled ?? true,
  });

  // initialData가 변경되면 formData 업데이트
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        roleCd: initialData.roleCd || '',
        roleNm: initialData.roleNm || '',
        roleDesc: initialData.roleDesc || '',
        enabled: initialData.enabled ?? true,
      });
    } else {
      // initialData가 없으면 (새로 생성하는 경우) 초기화
      setFormData({
        roleCd: '',
        roleNm: '',
        roleDesc: '',
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

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col bg-white dark:bg-slate-900 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          <svg className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {isEditMode ? '역할 수정' : '새 역할 생성'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            {isEditMode ? '역할 정보를 수정합니다' : '새로운 역할을 생성합니다'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white p-4 dark:bg-slate-900">
        <form className="space-y-3" onSubmit={handleSubmit}>
          {!isEditMode && (
            <div>
              <FormField
                label="역할 코드"
                name="roleCd"
                type="text"
                required
                placeholder="역할 코드를 입력하세요 (예: VIP, PREMIUM, BASIC)"
                value={formData.roleCd}
                onChange={(value) => setFormData({ ...formData, roleCd: String(value) })}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                역할 코드를 입력합니다. 생성 후 변경할 수 없습니다.
              </p>
            </div>
          )}

          {isEditMode && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-white mb-1">
                역할 코드
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-white font-mono">
                  {formData.roleCd}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">역할 코드는 변경할 수 없습니다.</p>
            </div>
          )}

          <FormField
            label="역할명"
            name="roleNm"
            type="text"
            required
            placeholder="역할명을 입력하세요"
            value={formData.roleNm}
            onChange={(value) => setFormData({ ...formData, roleNm: String(value) })}
          />

          <FormField
            label="설명"
            name="roleDesc"
            type="textarea"
            rows={3}
            placeholder="역할 설명을 입력하세요 (선택사항)"
            value={formData.roleDesc}
            onChange={(value) => setFormData({ ...formData, roleDesc: String(value) })}
          />

          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <FormField
              label="활성화"
              name="enabled"
              type="checkbox"
              value={formData.enabled}
              onChange={(value) => setFormData({ ...formData, enabled: Boolean(value) })}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              비활성화된 역할은 사용할 수 없습니다.
            </p>
          </div>

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


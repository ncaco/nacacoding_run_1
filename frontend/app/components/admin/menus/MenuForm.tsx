'use client';

import { useState, useMemo } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface Menu {
  id: string;
  siteId: string;
  name: string;
  url?: string;
  icon?: string;
  displayOrder: number;
  parentId?: string;
  enabled?: boolean;
}

interface Site {
  id: string;
  siteName: string;
}

interface MenuFormData {
  siteId: string;
  name: string;
  url?: string;
  icon?: string;
  displayOrder: number;
  parentId?: string | null;
  enabled?: boolean;
}

interface MenuFormProps {
  onSubmit?: (data: MenuFormData) => void;
  onCancel?: () => void;
  initialData?: {
    siteId?: string;
    name?: string;
    url?: string;
    displayOrder?: number;
    parentId?: string;
    enabled?: boolean;
  };
  isLoading?: boolean;
  sites?: Site[];
  menus?: Menu[];
}

export default function MenuForm({ onSubmit, onCancel, initialData, isLoading = false, sites = [], menus = [] }: MenuFormProps) {
  const isEditMode = !!initialData?.name;
  
  const [formData, setFormData] = useState({
    siteId: initialData?.siteId || '',
    name: initialData?.name || '',
    url: initialData?.url || '',
    displayOrder: initialData?.displayOrder || 0,
    parentId: initialData?.parentId || '',
    enabled: initialData?.enabled ?? true,
  });

  // 사이트 옵션
  const siteOptions = useMemo(() => {
    return [
      { value: '', label: '선택하세요' },
      ...sites.map((site) => ({ value: site.id, label: site.siteName })),
    ];
  }, [sites]);

  // 부모 메뉴 옵션 (같은 사이트의 메뉴만, 자기 자신 제외)
  const parentMenuOptions = useMemo(() => {
    if (!formData.siteId) {
      return [{ value: '', label: '없음 (최상위 메뉴)' }];
    }
    const sameSiteMenus = menus.filter(
      (menu) => menu.siteId === formData.siteId && menu.id !== initialData?.siteId
    );
    return [
      { value: '', label: '없음 (최상위 메뉴)' },
      ...sameSiteMenus.map((menu) => ({ value: menu.id, label: menu.name })),
    ];
  }, [formData.siteId, menus, initialData?.siteId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {isEditMode ? '메뉴 수정' : '새 메뉴 생성'}
        </h3>
      </div>

      {/* 폼 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-3 dark:bg-[#0f1119] sm:p-4">
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {!isEditMode && (
            <FormField
              label="사이트 선택"
              name="siteId"
              type="select"
              required
              value={formData.siteId}
              onChange={(value) => setFormData({ ...formData, siteId: value, parentId: '' })}
              options={siteOptions}
            />
          )}

          {isEditMode && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                사이트
              </label>
              <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-gray-400">
                {sites.find((s) => s.id === formData.siteId)?.siteName || formData.siteId}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">사이트는 변경할 수 없습니다.</p>
            </div>
          )}

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
            placeholder="/example (선택사항)"
            value={formData.url}
            onChange={(value) => setFormData({ ...formData, url: value })}
          />

          <FormField
            label="표시 순서"
            name="displayOrder"
            type="number"
            required
            placeholder="0"
            value={formData.displayOrder}
            onChange={(value) => setFormData({ ...formData, displayOrder: Number(value) || 0 })}
          />

          <FormField
            label="부모 메뉴"
            name="parentId"
            type="select"
            value={formData.parentId}
            onChange={(value) => setFormData({ ...formData, parentId: value })}
            options={parentMenuOptions}
          />

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
                비활성화된 메뉴는 사용할 수 없습니다.
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 dark:border-[#1f2435]">
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

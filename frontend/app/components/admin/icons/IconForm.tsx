'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import FormField from '../FormField';
import FormActions from '../FormActions';
import IconSelector from './IconSelector';

interface IconFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: {
    iconId?: string;
    name?: string;
    svgCode?: string;
    enabled?: boolean;
  };
  isLoading?: boolean;
}

export default function IconForm({ onSubmit, onCancel, initialData, isLoading = false }: IconFormProps) {
  const isEditMode = !!initialData?.iconId;
  
  const [formData, setFormData] = useState({
    iconId: initialData?.iconId || '',
    name: initialData?.name || '',
    svgCode: initialData?.svgCode || '',
    enabled: initialData?.enabled ?? true,
  });
  const [useCustomSvg, setUseCustomSvg] = useState(!initialData?.svgCode || !initialData.svgCode.match(/^[MLHVCSQTAZmlhvcsqtaz0-9\s,.-]+$/));

  // SVG 코드가 변경되면 사용자 정의 SVG인지 확인
  useEffect(() => {
    if (formData.svgCode) {
      // 일반적인 SVG path 패턴이 아니면 사용자 정의로 간주
      const isCommonPattern = formData.svgCode.match(/^[MLHVCSQTAZmlhvcsqtaz0-9\s,.-]+$/);
      setUseCustomSvg(!isCommonPattern);
    }
  }, [formData.svgCode]);

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
          {isEditMode ? '아이콘 수정' : '새 아이콘 생성'}
        </h3>
      </div>

      {/* 폼 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-3 dark:bg-[#0f1119] sm:p-4">
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
        {!isEditMode && (
          <FormField
            label="아이콘 ID"
            name="iconId"
            type="text"
            required
            placeholder="예: menu-icon, home-icon"
            value={formData.iconId}
            onChange={(value) => setFormData({ ...formData, iconId: value })}
            helperText="아이콘을 식별하는 고유 ID를 입력하세요."
          />
        )}
        {isEditMode && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              아이콘 ID
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#1f2435] dark:bg-[#1a1e2c]">
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-gray-600 dark:bg-[#0f1119] dark:text-gray-400">
                {formData.iconId}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">아이콘 ID는 변경할 수 없습니다.</p>
          </div>
        )}

        <FormField
          label="아이콘명"
          name="name"
          type="text"
          required
          placeholder="아이콘명을 입력하세요"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
        />

        {/* 아이콘 선택 탭 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            아이콘
          </label>
          <Tab.Group selectedIndex={useCustomSvg ? 1 : 0} onChange={(index) => setUseCustomSvg(index === 1)}>
            <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-[#1a1e2c]">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-[#0f1119] dark:text-white'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#0f1119]/50 dark:hover:text-white'
                  }`
                }
              >
                아이콘 선택
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-[#0f1119] dark:text-white'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#0f1119]/50 dark:hover:text-white'
                  }`
                }
              >
                직접 입력
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-3">
              <Tab.Panel>
                <IconSelector
                  value={formData.svgCode}
                  onChange={(svgCode, iconId, iconName) => {
                    setFormData({
                      ...formData,
                      svgCode: svgCode,
                      iconId: formData.iconId || iconId,
                      name: formData.name || iconName,
                    });
                  }}
                />
              </Tab.Panel>
              <Tab.Panel>
                <FormField
                  name="svgCode"
                  type="textarea"
                  rows={5}
                  required
                  placeholder="예: M4 6h16M4 12h16M4 18h16 또는 전체 SVG 코드"
                  value={formData.svgCode}
                  onChange={(value) => setFormData({ ...formData, svgCode: value })}
                  helperText="SVG path 데이터 또는 전체 SVG 코드를 입력하세요."
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* SVG 미리보기 */}
        {formData.svgCode && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              미리보기
            </label>
            <div className="mt-1 flex h-16 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#1a1e2c]">
              <svg className="h-8 w-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={formData.svgCode} />
              </svg>
            </div>
          </div>
        )}

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
              비활성화된 아이콘은 사용할 수 없습니다.
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


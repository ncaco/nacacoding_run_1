'use client';

import { useState, useMemo, useEffect } from 'react';
import ListHeader from '../ListHeader';
import ToggleSwitch from '../ToggleSwitch';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';

interface CmnCd {
  id: string;
  cd: string;
  name: string;
  description?: string;
  enabled?: boolean;
  parentCd?: string;
  children?: CmnCd[];
}

interface CmnCdListProps {
  cmnCds: CmnCd[];
  isLoading: boolean;
  onAdd?: () => void;
  onAddParent?: () => void;
  onAddChild?: (parentCd: CmnCd) => void;
  onEdit?: (cmnCd: CmnCd) => void;
  onDelete?: (cmnCd: CmnCd) => void;
  onToggleEnabled?: (cmnCd: CmnCd, enabled: boolean) => void;
  selectedParentCdCode?: string | null;
}

function CmnCdItem({ cmnCd, isSelected, onSelect, onEdit, onDelete, onToggleEnabled }: { cmnCd: CmnCd; isSelected?: boolean; onSelect?: (cmnCd: CmnCd) => void; onEdit?: (cmnCd: CmnCd) => void; onDelete?: (cmnCd: CmnCd) => void; onToggleEnabled?: (cmnCd: CmnCd, enabled: boolean) => void }) {
  const isParent = cmnCd.cd.startsWith('P');

  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg border p-2 transition-colors sm:gap-2 sm:p-3 ${
        isSelected
          ? 'border-green-500 bg-white dark:border-green-500 dark:bg-gray-800'
          : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
      }`}
      onClick={() => onSelect && onSelect(cmnCd)}
    >
      {/* 코드 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono font-semibold sm:px-2 ${
              isParent
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200'
            }`}
          >
            {cmnCd.cd}
          </span>
          <span className="text-xs font-medium text-gray-900 dark:text-white truncate sm:text-sm">{cmnCd.name}</span>
        </div>
        {cmnCd.description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 sm:mt-1">{cmnCd.description}</p>
        )}
      </div>

      {/* 오른쪽 액션 영역: 상태 토글 + 작업 버튼 */}
      <div className="flex items-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
        {/* 상태 토글 스위치 */}
        {onToggleEnabled && (
          <div className="flex h-[28px] w-[80px] items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 dark:border-gray-700 dark:bg-gray-800 sm:h-[32px] sm:w-[88px] sm:gap-2 sm:px-2.5">
            <ToggleSwitch
              enabled={cmnCd.enabled ?? true}
              onToggle={(enabled) => onToggleEnabled(cmnCd, enabled)}
              size="sm"
            />
            <span className={`text-xs font-medium whitespace-nowrap ${cmnCd.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {cmnCd.enabled ? '활성' : '비활성'}
            </span>
          </div>
        )}

        {/* 작업 버튼 */}
        {(onEdit || onDelete) && (
          <div className="flex gap-1 sm:gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(cmnCd)}
                className="cursor-pointer rounded-lg border border-green-600 bg-white px-2 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20 sm:px-3 sm:py-1.5"
              >
                수정
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(cmnCd)}
                className="cursor-pointer rounded-lg border border-red-600 bg-white px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 sm:px-3 sm:py-1.5"
              >
                삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CmnCdList({ cmnCds, isLoading, onAdd, onAddParent, onAddChild, onEdit, onDelete, onToggleEnabled, selectedParentCdCode }: CmnCdListProps) {
  const [selectedParentCd, setSelectedParentCd] = useState<CmnCd | null>(null);

  // 상위코드만 필터링 (P로 시작하는 코드)
  const parentCmnCds = useMemo(() => {
    return cmnCds.filter((cd) => cd.cd.startsWith('P'));
  }, [cmnCds]);

  // 선택한 상위코드의 하위코드만 필터링 (C로 시작하는 코드)
  const childCmnCds = useMemo(() => {
    if (!selectedParentCd) {
      return [];
    }
    return selectedParentCd.children || [];
  }, [selectedParentCd]);

  // 외부에서 지정한 상위코드로 선택
  useEffect(() => {
    if (selectedParentCdCode && parentCmnCds.length > 0) {
      const targetParent = parentCmnCds.find((cd) => cd.cd === selectedParentCdCode);
      if (targetParent) {
        setSelectedParentCd(targetParent);
      }
    }
  }, [selectedParentCdCode, parentCmnCds]);

  // 첫 번째 상위코드를 자동 선택
  useEffect(() => {
    if (parentCmnCds.length > 0 && !selectedParentCd && !selectedParentCdCode) {
      setSelectedParentCd(parentCmnCds[0]);
    }
  }, [parentCmnCds, selectedParentCd, selectedParentCdCode]);

  // 선택된 상위코드의 하위코드 목록 갱신
  useEffect(() => {
    if (selectedParentCd && !selectedParentCdCode) {
      // 선택된 상위코드의 최신 정보로 업데이트
      const updatedParent = parentCmnCds.find((cd) => cd.id === selectedParentCd.id);
      if (updatedParent) {
        setSelectedParentCd(updatedParent);
      }
    }
  }, [cmnCds, parentCmnCds, selectedParentCdCode]);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
        <ListHeader title="공통코드 목록" actionLabel="새 공통코드 추가" onAction={onAdd} />
        <div className="p-4 sm:p-6">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
      <ListHeader title="공통코드 목록" actionLabel="새 공통코드 추가" onAction={onAdd} />

      {/* 좌우 분할 레이아웃 */}
      <div className="flex flex-col gap-4 p-3 sm:flex-row sm:gap-6 sm:p-6">
        {/* 왼쪽: 상위코드 목록 */}
        <div className="flex-1 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900 sm:px-4 sm:py-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">상위코드</h3>
            {onAddParent && (
              <button
                onClick={onAddParent}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:h-7 sm:w-7"
                title="상위코드 추가"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
          <div className="max-h-[600px] overflow-y-auto bg-gray-50 p-2 dark:bg-gray-800 sm:p-3">
            {parentCmnCds.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
                message="등록된 상위코드가 없습니다."
              />
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {parentCmnCds.map((cmnCd) => (
                  <CmnCdItem
                    key={cmnCd.id}
                    cmnCd={cmnCd}
                    isSelected={selectedParentCd?.id === cmnCd.id}
                    onSelect={setSelectedParentCd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleEnabled={onToggleEnabled}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 하위코드 목록 */}
        <div className="flex-1 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900 sm:px-4 sm:py-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
              하위코드 {selectedParentCd && `(${selectedParentCd.cd} - ${selectedParentCd.name})`}
            </h3>
            {onAddChild && selectedParentCd && (
              <button
                onClick={() => onAddChild(selectedParentCd)}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:h-7 sm:w-7"
                title="하위코드 추가"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
          <div className="max-h-[600px] overflow-y-auto bg-gray-50 p-2 dark:bg-gray-800 sm:p-3">
            {!selectedParentCd ? (
              <EmptyState
                icon={
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
                message="상위코드를 선택해주세요."
              />
            ) : childCmnCds.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
                message="등록된 하위코드가 없습니다."
              />
            ) : (
              <div className="space-y-1.5 sm:space-y-2">
                {childCmnCds.map((cmnCd) => (
                  <CmnCdItem
                    key={cmnCd.id}
                    cmnCd={cmnCd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleEnabled={onToggleEnabled}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


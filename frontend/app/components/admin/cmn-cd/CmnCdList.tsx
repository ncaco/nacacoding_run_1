'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
  onInlineEdit?: (cmnCd: CmnCd) => void;
  onDelete?: (cmnCd: CmnCd) => void;
  onToggleEnabled?: (cmnCd: CmnCd, enabled: boolean) => void;
  selectedParentCdCode?: string | null;
}

function CmnCdItem({ cmnCd, isSelected, onSelect, onEdit, onInlineEdit, onDelete, onToggleEnabled }: { cmnCd: CmnCd; isSelected?: boolean; onSelect?: (cmnCd: CmnCd) => void; onEdit?: (cmnCd: CmnCd) => void; onInlineEdit?: (cmnCd: CmnCd) => void; onDelete?: (cmnCd: CmnCd) => void; onToggleEnabled?: (cmnCd: CmnCd, enabled: boolean) => void }) {
  const isParent = cmnCd.cd.startsWith('P');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(cmnCd.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // cmnCd가 변경되면 편집 상태 초기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditedName(cmnCd.name);
    setIsEditingName(false);
  }, [cmnCd.id, cmnCd.name]);

  // 편집 모드로 전환 시 입력 필드에 포커스
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
    setEditedName(cmnCd.name);
  };

  const handleNameSave = () => {
    if (editedName.trim() && editedName !== cmnCd.name) {
      if (onInlineEdit) {
        onInlineEdit({
          ...cmnCd,
          name: editedName.trim(),
        });
      } else if (onEdit) {
        onEdit({
          ...cmnCd,
          name: editedName.trim(),
        });
      }
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(cmnCd.name);
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleNameCancel();
    }
  };

  return (
    <div
      className={`group flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 transition-all ${
        isSelected
          ? 'border-gray-300 bg-gray-50 dark:border-[#1f2435] dark:bg-[#1a1e2c]'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:hover:border-[#303650] dark:hover:bg-[#1a1e2c]'
      }`}
      onClick={() => onSelect && onSelect(cmnCd)}
    >
      {/* 코드 배지 */}
      <span
        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold ${
          isParent
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
        }`}
      >
        {cmnCd.cd}
      </span>

      {/* 이름과 설명 */}
      <div className="min-w-0 flex-1">
        {isEditingName ? (
          <input
            ref={inputRef}
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs text-gray-900 focus:border-gray-400 focus:outline-none dark:border-[#303650] dark:bg-[#1a1e2c] dark:text-white dark:focus:border-[#404a65]"
          />
        ) : (
          <div
            className="text-xs font-medium text-gray-900 dark:text-white truncate cursor-text"
            onDoubleClick={handleDoubleClick}
            title="더블클릭하여 이름 수정"
          >
            {cmnCd.name}
          </div>
        )}
        {cmnCd.description && (
          <div className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{cmnCd.description}</div>
        )}
      </div>

      {/* 액션 버튼들 */}
      <div className="flex shrink-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {/* 상태 토글 */}
        {onToggleEnabled && (
          <div className="flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-1 dark:border-[#1f2435] dark:bg-[#0f1119]">
            <ToggleSwitch
              enabled={cmnCd.enabled ?? true}
              onToggle={(enabled) => onToggleEnabled(cmnCd, enabled)}
              size="sm"
            />
            <span className={`text-[10px] font-medium whitespace-nowrap ${cmnCd.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {cmnCd.enabled ? '활성' : '비활성'}
            </span>
          </div>
        )}

        {/* 수정/삭제 버튼 */}
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(cmnCd)}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-300 dark:hover:bg-[#1a1e2c]"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(cmnCd)}
              className="rounded border border-red-300 bg-white px-2 py-1 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-[#0f1119] dark:text-red-400 dark:hover:bg-red-500/10"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CmnCdList({ cmnCds, isLoading, onAddParent, onAddChild, onEdit, onInlineEdit, onDelete, onToggleEnabled, selectedParentCdCode }: CmnCdListProps) {
  const [selectedParentCd, setSelectedParentCd] = useState<CmnCd | null>(null);

  // 상위코드만 필터링
  const parentCmnCds = useMemo(() => {
    return cmnCds.filter((cd) => cd.cd.startsWith('P'));
  }, [cmnCds]);

  // 선택한 상위코드의 하위코드만 필터링
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedParentCd(targetParent);
      }
    }
  }, [selectedParentCdCode, parentCmnCds]);

  // 상위코드가 모두 삭제되었을 때 선택 초기화
  useEffect(() => {
    if (parentCmnCds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedParentCd(null);
    }
  }, [parentCmnCds]);

  // 첫 번째 상위코드를 자동 선택
  useEffect(() => {
    if (parentCmnCds.length > 0 && !selectedParentCd && !selectedParentCdCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedParentCd(parentCmnCds[0]);
    }
  }, [parentCmnCds, selectedParentCd, selectedParentCdCode]);

  // 선택된 상위코드의 하위코드 목록 갱신
  useEffect(() => {
    if (selectedParentCd && !selectedParentCdCode) {
      const updatedParent = parentCmnCds.find((cd) => cd.id === selectedParentCd.id);
      if (updatedParent) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedParentCd(updatedParent);
      } else {
        setSelectedParentCd(null);
      }
    }
  }, [cmnCds, parentCmnCds, selectedParentCd, selectedParentCdCode]);

  if (isLoading) {
    return (
      <div className="border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
        <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">공통코드 목록</h3>
        </div>
        <div className="p-4">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">공통코드 목록</h3>
      </div>

      {/* 좌우 분할 레이아웃 */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2 sm:flex-row sm:gap-3 sm:p-3">
        {/* 왼쪽: 상위코드 목록 */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-[#1f2435] dark:bg-[#141827]">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white">상위코드</h4>
            {onAddParent && (
              <button
                onClick={onAddParent}
                className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-400 dark:hover:bg-[#1a1e2c]"
                title="상위코드 추가"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
          <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-1.5 dark:bg-[#0f1119] sm:p-2">
            {parentCmnCds.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={
                    <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            ) : (
              <div className="space-y-1">
                {parentCmnCds.map((cmnCd) => (
                  <CmnCdItem
                    key={cmnCd.id}
                    cmnCd={cmnCd}
                    isSelected={selectedParentCd?.id === cmnCd.id}
                    onSelect={setSelectedParentCd}
                    onEdit={onEdit}
                    onInlineEdit={onInlineEdit}
                    onDelete={onDelete}
                    onToggleEnabled={onToggleEnabled}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 하위코드 목록 */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-[#1f2435] dark:bg-[#141827]">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
              하위코드 {selectedParentCd && <span className="text-[10px] font-normal text-gray-500 dark:text-gray-400">({selectedParentCd.cd})</span>}
            </h4>
            {onAddChild && selectedParentCd && (
              <button
                onClick={() => onAddChild(selectedParentCd)}
                className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-400 dark:hover:bg-[#1a1e2c]"
                title="하위코드 추가"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
          <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-1.5 dark:bg-[#0f1119] sm:p-2">
            {!selectedParentCd ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={
                    <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            ) : childCmnCds.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={
                    <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            ) : (
              <div className="space-y-1">
                {childCmnCds.map((cmnCd) => (
                  <CmnCdItem
                    key={cmnCd.id}
                    cmnCd={cmnCd}
                    onEdit={onEdit}
                    onInlineEdit={onInlineEdit}
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

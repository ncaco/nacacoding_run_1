'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import CustomSelect from '../CustomSelect';
import ToggleSwitch from '../ToggleSwitch';
import FormField from '../FormField';

interface Menu {
  id: string;
  siteId: string;
  name: string;
  url?: string;
  displayOrder: number;
  parentId?: string;
  enabled?: boolean;
  children?: Menu[];
}

interface Site {
  id: string;
  siteName: string;
}

interface MenuListProps {
  menus: Menu[];
  isLoading: boolean;
  onAdd?: () => void;
  onAddChild?: (parentMenu: Menu) => void;
  onEdit?: (menu: Menu) => void;
  onSubmit?: (formData: any) => void;
  onDelete?: (menu: Menu) => void;
  onToggleEnabled?: (menu: Menu, enabled: boolean) => void;
  onReorder?: (reorderedMenus: Array<{ id: string; parentId: string | null; displayOrder: number }>) => void;
  sites?: Site[];
  selectedSiteId?: string;
  isSubmitting?: boolean;
  selectedMenuId?: string | null;
  onSelectMenu?: (menu: Menu | null) => void;
}

function SortableMenuTreeNode({ menu, level = 0, isSelected, onSelect, onAddChild, siteName, allMenus, dragOverId, draggedMenuId, dragOverPosition }: { menu: Menu; level?: number; isSelected?: boolean; onSelect?: (menu: Menu) => void; onAddChild?: (parentMenu: Menu) => void; siteName?: string; allMenus: Menu[]; dragOverId?: string | null; draggedMenuId?: string | null; dragOverPosition?: 'top' | 'bottom' | null }) {
  const hasChildren = menu.children && menu.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 드래그 오버 상태 확인
  const isDragOver = dragOverId === menu.id;
  const draggedMenu = draggedMenuId ? allMenus.find((m) => m.id === draggedMenuId) : null;
  const isMovingToChild = isDragOver && dragOverPosition === 'top' && draggedMenu && 
                          draggedMenu.parentId !== menu.id && 
                          draggedMenu.id !== menu.id &&
                          draggedMenu.siteId === menu.siteId;
  const isMovingBelow = isDragOver && dragOverPosition === 'bottom';

  const childIds = useMemo(() => {
    return menu.children?.map(child => child.id) || [];
  }, [menu.children]);

  return (
    <div ref={setNodeRef} style={style}>
      <div
        data-menu-id={menu.id}
        className={`group relative flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition-colors ${
          isSelected
            ? 'bg-gray-100 text-gray-900 dark:bg-[#1f2435] dark:text-white'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1a1e2c] dark:hover:text-white'
        } ${isDragging ? 'opacity-50' : ''} ${
          isMovingToChild
            ? 'bg-blue-50 border-2 border-blue-400 border-dashed dark:bg-blue-900/20 dark:border-blue-500'
            : isMovingBelow
            ? 'bg-green-50 border-2 border-green-400 border-dashed dark:bg-green-900/20 dark:border-green-500'
            : ''
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={() => onSelect && onSelect(menu)}
      >
        {/* 드래그 핸들 */}
        <div
          {...attributes}
          {...listeners}
          className="flex h-4 w-4 shrink-0 cursor-grab items-center justify-center rounded text-gray-400 hover:bg-gray-200 active:cursor-grabbing dark:text-gray-500 dark:hover:bg-gray-700"
          title="드래그하여 순서 변경"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg
              className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="h-4 w-4" />
        )}
        <span className="flex-1 truncate">{menu.name}</span>
        {menu.enabled === false && (
          <span className="shrink-0 rounded px-1 text-[10px] text-gray-400 dark:text-gray-500">비활성</span>
        )}
        {onAddChild && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(menu);
            }}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-gray-500 opacity-0 transition-opacity hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title="하위 메뉴 추가"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && isExpanded && (
        <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
          <div>
            {menu.children!.map((child) => (
              <SortableMenuTreeNode
                key={child.id}
                menu={child}
                level={level + 1}
                isSelected={isSelected}
                onSelect={onSelect}
                onAddChild={onAddChild}
                siteName={siteName}
                allMenus={allMenus}
                dragOverId={dragOverId}
                draggedMenuId={draggedMenuId}
                dragOverPosition={dragOverId === child.id ? dragOverPosition : null}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

export default function MenuList({ menus, isLoading, onAdd, onAddChild, onEdit, onSubmit, onDelete, onToggleEnabled, onReorder, sites = [], selectedSiteId, isSubmitting = false, selectedMenuId, onSelectMenu }: MenuListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'top' | 'bottom' | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    url: string;
    displayOrder: number;
    enabled: boolean;
    parentId: string | null;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 선택된 사이트가 변경되면 선택된 메뉴 초기화
  useEffect(() => {
    setSelectedMenu(null);
    setFormData(null);
    // onSelectMenu는 호출하지 않음 (외부에서 selectedMenuId를 직접 관리)
  }, [selectedSiteId]);

  // 외부에서 선택된 메뉴 ID가 변경되면 메뉴 선택
  useEffect(() => {
    if (selectedMenuId) {
      const menu = menus.find((m) => m.id === selectedMenuId);
      if (menu && selectedMenu?.id !== menu.id) {
        setSelectedMenu(menu);
      }
    } else if (selectedMenuId === null && selectedMenu !== null) {
      setSelectedMenu(null);
      setFormData(null);
    }
  }, [selectedMenuId, menus, selectedMenu]);

  // 선택된 메뉴가 변경되면 폼 데이터 초기화
  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        name: selectedMenu.name || '',
        url: selectedMenu.url || '',
        displayOrder: selectedMenu.displayOrder || 0,
        enabled: selectedMenu.enabled ?? true,
        parentId: selectedMenu.parentId || null,
      });
    } else {
      setFormData(null);
    }
  }, [selectedMenu]);

  // 사이트별 메뉴 매핑
  const siteMap = useMemo(() => {
    const map = new Map<string, string>();
    sites.forEach((site) => {
      map.set(site.id, site.siteName);
    });
    return map;
  }, [sites]);

  // 메뉴를 트리 구조로 변환
  const treeMenus = useMemo(() => {
    const filtered = menus.filter((menu) => {
      const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (menu.url && menu.url.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

    // 트리 구조 생성
    const menuMap = new Map<string, Menu & { children?: Menu[] }>();
    const rootMenus: Menu[] = [];

    // 모든 메뉴를 맵에 추가
    filtered.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // 부모-자식 관계 설정
    filtered.forEach((menu) => {
      const menuNode = menuMap.get(menu.id)!;
      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId)!;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(menuNode);
      } else {
        rootMenus.push(menuNode);
      }
    });

    // displayOrder로 정렬
    const sortMenus = (menuList: Menu[]) => {
      menuList.sort((a, b) => a.displayOrder - b.displayOrder);
      menuList.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          sortMenus(menu.children);
        }
      });
    };

    sortMenus(rootMenus);
    return rootMenus;
  }, [menus, searchTerm]);

  // 선택된 메뉴의 상세 정보
  const selectedMenuDetails = useMemo(() => {
    if (!selectedMenu) return null;
    return {
      ...selectedMenu,
      siteName: siteMap.get(selectedMenu.siteId),
      parentName: selectedMenu.parentId
        ? menus.find((m) => m.id === selectedMenu.parentId)?.name
        : null,
    };
  }, [selectedMenu, siteMap, menus]);

  // 모든 메뉴 ID 수집 (드래그 앤 드롭용)
  const allMenuIds = useMemo(() => {
    const collectIds = (menuList: Menu[]): string[] => {
      const ids: string[] = [];
      menuList.forEach((menu) => {
        ids.push(menu.id);
        if (menu.children && menu.children.length > 0) {
          ids.push(...collectIds(menu.children));
        }
      });
      return ids;
    };
    return collectIds(treeMenus);
  }, [treeMenus]);

  // 드래그 시작
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setDragOverId(null);
    setDragOverPosition(null);
  };

  // 드래그 오버
  const handleDragOver = (event: DragOverEvent) => {
    const { over, activatorEvent } = event;
    if (over && activatorEvent && 'clientY' in activatorEvent) {
      const menuId = over.id as string;
      setDragOverId(menuId);
      
      // 메뉴 아이템의 DOM 요소 찾기
      const menuElement = document.querySelector(`[data-menu-id="${menuId}"]`) as HTMLElement;
      if (menuElement) {
        const rect = menuElement.getBoundingClientRect();
        const mouseY = (activatorEvent as MouseEvent).clientY;
        const menuCenterY = rect.top + rect.height / 2;
        
        // 마우스가 메뉴의 상단 절반에 있으면 하위로, 하단 절반에 있으면 아래로
        setDragOverPosition(mouseY < menuCenterY ? 'top' : 'bottom');
      } else {
        setDragOverPosition(null);
      }
    } else if (over) {
      setDragOverId(over.id as string);
      setDragOverPosition(null);
    }
  };

  // 드래그 종료
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const currentDragOverPosition = dragOverPosition;
    setActiveId(null);
    setDragOverId(null);
    setDragOverPosition(null);

    if (!over || active.id === over.id || !onReorder) {
      return;
    }

    const draggedMenu = menus.find((m) => m.id === active.id);
    const overMenu = menus.find((m) => m.id === over.id);
    
    if (!draggedMenu || !overMenu) {
      return;
    }

    // 자기 자신의 하위로 이동하는 것은 방지 (순환 참조 방지)
    const isDescendant = (menuId: string, ancestorId: string): boolean => {
      if (menuId === ancestorId) return true;
      const menu = menus.find((m) => m.id === menuId);
      if (!menu || !menu.parentId) return false;
      if (menu.parentId === ancestorId) return true;
      return isDescendant(menu.parentId, ancestorId);
    };

    // draggedMenu가 overMenu의 하위인지 확인 (순환 참조 방지)
    if (isDescendant(overMenu.id, draggedMenu.id)) {
      return; // 자기 자신의 하위로 이동 불가
    }

    // 메뉴 위로 올렸을 때 (상단 절반): 하위 메뉴로 이동
    // 메뉴 사이로 올렸을 때 (하단 절반): 아래로 이동
    const isMovingToChild = currentDragOverPosition === 'top' && 
                           draggedMenu.parentId !== overMenu.id && 
                           draggedMenu.id !== overMenu.id &&
                           !isDescendant(overMenu.id, draggedMenu.id) &&
                           draggedMenu.siteId === overMenu.siteId;

    if (isMovingToChild) {
      // 부모 메뉴의 자식 목록에 추가
      const parentChildren = menus.filter(
        (m) => m.parentId === overMenu.id && m.id !== draggedMenu.id
      );
      
      // 현재 순서대로 정렬
      const sortedChildren = [...parentChildren].sort((a, b) => a.displayOrder - b.displayOrder);
      
      // 부모 메뉴의 자식 목록 맨 뒤에 추가
      sortedChildren.push({ ...draggedMenu, parentId: overMenu.id });
      
      // 모든 자식 메뉴의 displayOrder를 0부터 재정렬
      const reorderedChildren = sortedChildren.map((menu, index) => ({
        id: menu.id,
        parentId: menu.parentId || null,
        displayOrder: index,
      }));
      
      // 원래 위치의 메뉴들도 재정렬 필요 (같은 레벨의 다른 메뉴들)
      const originalLevelMenus = menus.filter(
        (m) => m.parentId === (draggedMenu.parentId || null) && m.id !== draggedMenu.id
      );
      const reorderedOriginalLevel = originalLevelMenus
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((menu, index) => ({
          id: menu.id,
          parentId: menu.parentId || null,
          displayOrder: index,
        }));
      
      // 두 레벨의 메뉴들을 모두 업데이트
      onReorder([...reorderedOriginalLevel, ...reorderedChildren]);
      return;
    }

    // 같은 부모를 가진 경우 (메뉴 사이로 올렸을 때 - 하단 절반)
    // 또는 dragOverPosition이 'bottom'인 경우
    if (overMenu.parentId === draggedMenu.parentId && (currentDragOverPosition === 'bottom' || currentDragOverPosition === null)) {
      // 같은 레벨의 모든 메뉴 가져오기
      const sameLevelMenus = menus.filter(
        (m) => m.parentId === (draggedMenu.parentId || null)
      );
      
      // 현재 순서대로 정렬
      const sortedMenus = [...sameLevelMenus].sort((a, b) => a.displayOrder - b.displayOrder);
      
      // 원래 인덱스와 목표 인덱스 찾기
      const oldIndex = sortedMenus.findIndex((m) => m.id === draggedMenu.id);
      const newIndex = sortedMenus.findIndex((m) => m.id === overMenu.id);
      
      // 같은 위치면 변경 없음
      if (oldIndex === newIndex) {
        return;
      }
      
      // arrayMove를 사용하여 정확한 위치 이동
      const reorderedMenus = arrayMove(sortedMenus, oldIndex, newIndex);
      
      // 모든 메뉴의 displayOrder를 0부터 재정렬
      const reorderedMenuData = reorderedMenus.map((menu, index) => ({
        id: menu.id,
        parentId: menu.parentId || null,
        displayOrder: index,
      }));
      
      onReorder(reorderedMenuData);
    } else if (currentDragOverPosition === 'bottom' || currentDragOverPosition === null) {
      // 다른 부모로 이동 (같은 레벨의 다른 부모) - 메뉴 사이로 올렸을 때
      const newParentMenus = menus.filter(
        (m) => m.parentId === (overMenu.parentId || null) && m.id !== draggedMenu.id
      );
      
      // 현재 순서대로 정렬
      const sortedMenus = [...newParentMenus].sort((a, b) => a.displayOrder - b.displayOrder);
      
      // 목표 위치 찾기
      const overIndex = sortedMenus.findIndex((m) => m.id === overMenu.id);
      
      // 목표 위치에 삽입 (아래로 이동하는 경우 +1)
      const newMenu = { ...draggedMenu, parentId: overMenu.parentId || null };
      sortedMenus.splice(overIndex + 1, 0, newMenu);
      
      // 모든 메뉴의 displayOrder를 0부터 재정렬
      const reorderedMenus = sortedMenus.map((menu, index) => ({
        id: menu.id,
        parentId: menu.parentId || null,
        displayOrder: index,
      }));
      
      // 원래 위치의 메뉴들도 재정렬 필요
      const originalLevelMenus = menus.filter(
        (m) => m.parentId === (draggedMenu.parentId || null) && m.id !== draggedMenu.id
      );
      const reorderedOriginalLevel = originalLevelMenus
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((menu, index) => ({
          id: menu.id,
          parentId: menu.parentId || null,
          displayOrder: index,
        }));
      
      // 두 레벨의 메뉴들을 모두 업데이트
      onReorder([...reorderedOriginalLevel, ...reorderedMenus]);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
        <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">메뉴 목록</h3>
        </div>
        <div className="p-4">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119] overflow-visible">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">메뉴 목록</h3>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="relative z-10 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-[#1f2435] dark:bg-[#141827]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* 검색 */}
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="메뉴명 또는 URL로 검색..."
                className="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-8 pr-2 text-xs text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650] dark:focus:bg-[#1f2435]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 좌우 분할 레이아웃 */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2 sm:flex-row sm:gap-3 sm:p-3">
        {/* 왼쪽: 트리 메뉴 */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-[#1f2435] dark:bg-[#141827]">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white">메뉴 트리</h4>
            {onAdd && (
              <button
                onClick={onAdd}
                className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-gray-400 dark:hover:bg-[#1a1e2c]"
                title="메뉴 추가"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
          <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-1.5 dark:bg-[#0f1119] sm:p-2">
            {treeMenus.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={
                    <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  }
                  message={searchTerm ? '검색 조건에 맞는 메뉴가 없습니다.' : '등록된 메뉴가 없습니다.'}
                />
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={allMenuIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-0.5">
                    {treeMenus.map((menu) => (
                      <SortableMenuTreeNode
                        key={menu.id}
                        menu={menu}
                        isSelected={selectedMenu?.id === menu.id}
                        onSelect={(menu) => {
                          if (onSelectMenu) {
                            onSelectMenu(menu);
                          } else {
                            setSelectedMenu(menu);
                          }
                        }}
                        onAddChild={onAddChild}
                        siteName={siteMap.get(menu.siteId)}
                        allMenus={menus}
                        dragOverId={dragOverId}
                        draggedMenuId={activeId}
                        dragOverPosition={dragOverId === menu.id ? dragOverPosition : null}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <div className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-900 shadow-lg dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-white">
                      {menus.find((m) => m.id === activeId)?.name}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        {/* 오른쪽: 선택한 메뉴 상세 정보 */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
          <div className="border-b border-gray-200 bg-gray-50 px-2.5 py-1.5 dark:border-[#1f2435] dark:bg-[#141827]">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white">메뉴 상세</h4>
          </div>
          <div className="cmn-cd-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-3 dark:bg-[#0f1119] sm:p-4">
            {!selectedMenuDetails ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={
                    <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  message="메뉴를 선택해주세요."
                />
              </div>
            ) : formData ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onSubmit && selectedMenu) {
                    onSubmit({
                      ...formData,
                      id: selectedMenu.id,
                      siteId: selectedMenu.siteId,
                      parentId: formData.parentId,
                    });
                  }
                }}
                className="space-y-3"
              >
                {/* 사이트 (읽기 전용) */}
                {selectedMenuDetails.siteName && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">사이트</label>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-gray-400">
                      {selectedMenuDetails.siteName}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">사이트는 변경할 수 없습니다.</p>
                  </div>
                )}

                {/* 상위메뉴 */}
                {(() => {
                  // 메뉴의 레벨 계산 (재귀적)
                  const getMenuLevel = (menuId: string, visited = new Set<string>()): number => {
                    if (visited.has(menuId)) return 0; // 순환 참조 방지
                    visited.add(menuId);
                    
                    const menu = menus.find((m) => m.id === menuId);
                    if (!menu || !menu.parentId) return 0;
                    
                    return 1 + getMenuLevel(menu.parentId, visited);
                  };

                  // 부모 메뉴 옵션 생성 (자기 자신과 자식은 제외)
                  const getParentMenuOptions = () => {
                    if (!selectedMenu) return [{ value: '', label: '없음 (최상위 메뉴)' }];

                    const excludeIds = new Set<string>();
                    excludeIds.add(selectedMenu.id);
                    
                    // 자식 메뉴들도 제외
                    const collectChildren = (menuId: string) => {
                      menus.forEach((m) => {
                        if (m.parentId === menuId) {
                          excludeIds.add(m.id);
                          collectChildren(m.id);
                        }
                      });
                    };
                    collectChildren(selectedMenu.id);

                    const availableMenus = menus
                      .filter((m) => m.siteId === selectedMenu.siteId && !excludeIds.has(m.id))
                      .map((m) => ({
                        ...m,
                        level: getMenuLevel(m.id),
                      }))
                      .sort((a, b) => {
                        // 레벨 ASC, 순서 ASC
                        if (a.level !== b.level) {
                          return a.level - b.level;
                        }
                        return a.displayOrder - b.displayOrder;
                      });

                    return [
                      { value: '', label: '없음 (최상위 메뉴)' },
                      ...availableMenus.map((m) => ({
                        value: m.id,
                        label: m.level > 0 ? `└ ${m.name}` : m.name,
                      })),
                    ];
                  };

                  return (
                    <FormField
                      label="상위메뉴"
                      name="parentId"
                      type="select"
                      value={formData.parentId || ''}
                      onChange={(value) => setFormData({ ...formData, parentId: value || null })}
                      options={getParentMenuOptions()}
                      helperText="(선택사항) 상위 메뉴를 선택하여 계층 구조를 만듭니다."
                    />
                  );
                })()}

                {/* 메뉴명 */}
                <FormField
                  label="메뉴명"
                  name="name"
                  type="text"
                  required
                  placeholder="메뉴명을 입력하세요"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                />

                {/* URL */}
                <FormField
                  label="URL"
                  name="url"
                  type="text"
                  placeholder="/example"
                  value={formData.url}
                  onChange={(value) => setFormData({ ...formData, url: value })}
                  helperText="(선택사항) 메뉴 클릭 시 이동할 URL을 입력하세요."
                />

                {/* 순서 (표시 순서) */}
                <FormField
                  label="순서"
                  name="displayOrder"
                  type="number"
                  required
                  placeholder="0"
                  value={formData.displayOrder}
                  onChange={(value) => setFormData({ ...formData, displayOrder: Number(value) })}
                  helperText="메뉴가 표시될 순서를 숫자로 입력하세요."
                />

                {/* 상태 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">상태</label>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#1f2435] dark:bg-[#1a1e2c]">
                    <ToggleSwitch
                      enabled={formData.enabled}
                      onToggle={(enabled) => {
                        setFormData({ ...formData, enabled });
                        if (onToggleEnabled && selectedMenu) {
                          onToggleEnabled(selectedMenu, enabled);
                        }
                      }}
                      size="sm"
                    />
                    <span className={`text-xs font-medium ${formData.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formData.enabled ? '활성' : '비활성'}
                    </span>
        </div>
      </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2">
                  {onSubmit && (
            <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded border border-green-600 bg-white px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 disabled:opacity-50 dark:border-green-400 dark:bg-[#0f1119] dark:text-green-400 dark:hover:bg-green-900/20"
            >
                      {isSubmitting ? '저장 중...' : '저장'}
            </button>
          )}
          {onDelete && (
            <button
                      type="button"
                      onClick={() => onDelete(selectedMenuDetails)}
                      className="flex-1 rounded border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-[#0f1119] dark:text-red-400 dark:hover:bg-red-500/10"
            >
              삭제
            </button>
          )}
        </div>
              </form>
            ) : null}
          </div>
    </div>
      </div>
    </div>
  );
}

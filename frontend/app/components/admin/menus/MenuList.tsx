'use client';

import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import LoadingState from '../LoadingState';
import EmptyState from '../EmptyState';
import ToggleSwitch from '../ToggleSwitch';
import FormField from '../FormField';
import CustomSelect from '../CustomSelect';

interface Menu {
  id: string;
  siteId: string;
  name: string;
  url?: string;
  icon?: string;
  displayOrder: number;
  parentId?: string;
  enabled?: boolean;
  children?: Menu[];
}

interface Site {
  id: string;
  siteName: string;
}

interface Icon {
  id: string;
  iconId: string;
  name: string;
  svgCode: string;
  enabled?: boolean;
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
  icons?: Icon[];
  selectedSiteId?: string;
  isSubmitting?: boolean;
  selectedMenuId?: string | null;
  onSelectMenu?: (menu: Menu | null) => void;
}

function MenuTreeNode({ menu, level = 0, index, isSelected, onSelect, onAddChild, siteName, allMenus }: { menu: Menu; level?: number; index: number; isSelected?: boolean; onSelect?: (menu: Menu) => void; onAddChild?: (parentMenu: Menu) => void; siteName?: string; allMenus: Menu[] }) {
  const hasChildren = menu.children && menu.children.length > 0;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Draggable draggableId={menu.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-0.5 ${snapshot.isDragging ? 'opacity-50' : ''}`}
        >
          <div
            className={`group relative flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition-colors menu-item ${
              isSelected
                ? 'bg-gray-100 text-gray-900 dark:text-white menu-item-selected'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#1a1e2c] dark:hover:text-white'
            } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
            style={{ paddingLeft: `${8 + level * 16}px` }}
            onClick={() => onSelect && onSelect(menu)}
          >
            {/* 드래그 핸들 */}
            <div
              {...provided.dragHandleProps}
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
            <Droppable droppableId={`child-${menu.id}`} type="MENU">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`mt-0.5 min-h-[20px] ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  {menu.children!.map((child, childIndex) => (
                    <MenuTreeNode
                      key={child.id}
                      menu={child}
                      level={level + 1}
                      index={childIndex}
                      isSelected={isSelected}
                      onSelect={onSelect}
                      onAddChild={onAddChild}
                      siteName={siteName}
                      allMenus={allMenus}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function MenuList({ menus, isLoading, onAdd, onAddChild, onEdit, onSubmit, onDelete, onToggleEnabled, onReorder, sites = [], icons = [], selectedSiteId, isSubmitting = false, selectedMenuId, onSelectMenu }: MenuListProps) {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    url: string;
    icon: string;
    displayOrder: number;
    enabled: boolean;
    parentId: string | null;
  } | null>(null);

  // 선택된 사이트가 변경되면 선택된 메뉴 초기화
  useEffect(() => {
    setSelectedMenu(null);
    setFormData(null);
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
        icon: selectedMenu.icon || '',
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
    // 트리 구조 생성
    const menuMap = new Map<string, Menu & { children?: Menu[] }>();
    const rootMenus: Menu[] = [];

    // 모든 메뉴를 맵에 추가
    menus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // 부모-자식 관계 설정
    menus.forEach((menu) => {
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
  }, [menus]);

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

  // 드래그 종료 처리
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || !onReorder) {
      return;
    }

    // 같은 위치면 변경 없음
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const draggedMenu = menus.find((m) => m.id === draggableId);
    if (!draggedMenu) {
      return;
    }

    // 순환 참조 방지: 자기 자신의 하위로 이동하는 것은 방지
    const isDescendant = (menuId: string, ancestorId: string): boolean => {
      if (menuId === ancestorId) return true;
      const menu = menus.find((m) => m.id === menuId);
      if (!menu || !menu.parentId) return false;
      if (menu.parentId === ancestorId) return true;
      return isDescendant(menu.parentId, ancestorId);
    };

    // 목적지가 루트 레벨인지 자식 레벨인지 확인
    const isMovingToRoot = destination.droppableId === 'root';
    const isMovingToChild = destination.droppableId.startsWith('child-');
    
    let newParentId: string | null = null;
    let targetIndex = destination.index;

    if (isMovingToChild) {
      // 자식 레벨로 이동
      const parentId = destination.droppableId.replace('child-', '');
      
      // 순환 참조 방지: 자기 자신의 하위로 이동 불가
      if (isDescendant(parentId, draggedMenu.id)) {
        return;
      }
      
      newParentId = parentId;
      
      // 부모 메뉴의 자식 목록 가져오기
      const parentChildren = menus.filter((m) => m.parentId === parentId && m.id !== draggedMenu.id);
      const sortedChildren = [...parentChildren].sort((a, b) => a.displayOrder - b.displayOrder);
      
      // 새로운 위치에 삽입
      const newMenu = { ...draggedMenu, parentId };
      sortedChildren.splice(targetIndex, 0, newMenu);
      
      // displayOrder 재정렬
      const reorderedChildren = sortedChildren.map((menu, index) => ({
        id: menu.id,
        parentId: menu.parentId || null,
        displayOrder: index,
      }));
      
      // 원래 위치의 메뉴들도 재정렬
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
      
      onReorder([...reorderedOriginalLevel, ...reorderedChildren]);
    } else if (isMovingToRoot) {
      // 루트 레벨로 이동
      newParentId = null;
      
      // 루트 메뉴 목록 가져오기
      const rootMenus = menus.filter((m) => !m.parentId && m.id !== draggedMenu.id);
      const sortedRootMenus = [...rootMenus].sort((a, b) => a.displayOrder - b.displayOrder);
      
      // 새로운 위치에 삽입
      const newMenu = { ...draggedMenu, parentId: null };
      sortedRootMenus.splice(targetIndex, 0, newMenu);
      
      // displayOrder 재정렬
      const reorderedRootMenus = sortedRootMenus.map((menu, index) => ({
        id: menu.id,
        parentId: menu.parentId || null,
        displayOrder: index,
      }));
      
      // 원래 위치의 메뉴들도 재정렬
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
      
      onReorder([...reorderedOriginalLevel, ...reorderedRootMenus]);
    } else {
      // 같은 레벨 내에서 이동
      const sourceIsRoot = source.droppableId === 'root';
      const destIsRoot = destination.droppableId === 'root';
      
      if (sourceIsRoot && destIsRoot) {
        // 루트 레벨 내 이동
        const rootMenus = menus.filter((m) => !m.parentId);
        const sortedMenus = [...rootMenus].sort((a, b) => a.displayOrder - b.displayOrder);
        
        const [removed] = sortedMenus.splice(source.index, 1);
        sortedMenus.splice(destination.index, 0, removed);
        
        const reorderedMenus = sortedMenus.map((menu, index) => ({
          id: menu.id,
          parentId: menu.parentId || null,
          displayOrder: index,
        }));
        
        onReorder(reorderedMenus);
      } else if (!sourceIsRoot && !destIsRoot) {
        // 같은 부모의 자식 레벨 내 이동
        const sourceParentId = source.droppableId.replace('child-', '');
        const destParentId = destination.droppableId.replace('child-', '');
        
        if (sourceParentId === destParentId) {
          const childMenus = menus.filter((m) => m.parentId === sourceParentId);
          const sortedMenus = [...childMenus].sort((a, b) => a.displayOrder - b.displayOrder);
          
          const [removed] = sortedMenus.splice(source.index, 1);
          sortedMenus.splice(destination.index, 0, removed);
          
          const reorderedMenus = sortedMenus.map((menu, index) => ({
            id: menu.id,
            parentId: menu.parentId || null,
            displayOrder: index,
          }));
          
          onReorder(reorderedMenus);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
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
    <div className="flex h-[calc(100vh-180px)] flex-col border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119] overflow-visible">
      {/* 헤더 */}
      <div className="border-b border-gray-200 px-3 py-2 dark:border-[#1f2435]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">메뉴 목록</h3>
          {selectedMenu && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 dark:text-gray-400">메뉴명:</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedMenu.name}</span>
              </div>
              {selectedMenu.url && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 dark:text-gray-400">메뉴경로:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedMenu.url}</span>
                </div>
              )}
            </div>
          )}
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
                  message="등록된 메뉴가 없습니다."
                />
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="root" type="MENU">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-0.5 ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                    >
                      {treeMenus.map((menu, index) => (
                        <MenuTreeNode
                          key={menu.id}
                          menu={menu}
                          index={index}
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
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
                  if (onSubmit && selectedMenu && formData) {
                    onSubmit({
                      id: selectedMenu.id,
                      siteId: selectedMenu.siteId,
                      name: formData.name,
                      url: formData.url || '',
                      icon: formData.icon || '',
                      displayOrder: formData.displayOrder,
                      enabled: formData.enabled,
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

                {/* 경로 (URL) */}
                <FormField
                  label="경로"
                  name="url"
                  type="text"
                  placeholder="메뉴 URL을 입력하세요 (선택사항)"
                  value={formData.url}
                  onChange={(value) => setFormData({ ...formData, url: value })}
                  helperText="메뉴 클릭 시 이동할 경로를 입력하세요."
                />

                {/* 아이콘 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    아이콘
                  </label>
                  <CustomSelect
                    value={formData.icon}
                    onChange={(value) => setFormData({ ...formData, icon: value })}
                    options={[
                      { value: '', label: '아이콘 없음' },
                      ...icons
                        .filter((icon) => icon.enabled !== false)
                        .map((icon) => ({
                          value: icon.iconId,
                          label: icon.name,
                          icon: icon.svgCode,
                        })),
                    ]}
                    placeholder="아이콘을 선택하세요 (선택사항)"
                  />
                  <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                    DB에 등록된 아이콘을 선택하세요.
                  </p>
                </div>

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

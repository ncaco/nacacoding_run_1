'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { fetchWithTokenRefresh, logout } from '@/_lib/utils/auth';
import { getApiUrl } from '@/_lib/api/client';
import { useRouter } from 'next/navigation';

interface MenuPermissionItem {
  menuId: string;
  menuName: string;
  menuUrl?: string;
  parentId?: string;
  displayOrder: number;
  permRead: boolean;
  permCreate: boolean;
  permUpdate: boolean;
  permDelete: boolean;
  permDownload: boolean;
  permAll: boolean;
}

interface MenuPermissionResponse {
  userRoleId: string;
  userRoleName: string;
  menus: MenuPermissionItem[];
}

interface MenuPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRoleId: string;
  userRoleName: string;
}

interface MenuTreeNode extends MenuPermissionItem {
  children: MenuTreeNode[];
}

export default function MenuPermissionModal({
  isOpen,
  onClose,
  userRoleId,
  userRoleName,
}: MenuPermissionModalProps) {
  const router = useRouter();
  const [menus, setMenus] = useState<MenuPermissionItem[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 메뉴 권한 조회
  useEffect(() => {
    if (isOpen && userRoleId) {
      fetchMenuPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userRoleId]);

  const fetchMenuPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithTokenRefresh(
        getApiUrl(`/user-role-menu/role/${userRoleId}`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '메뉴 권한 조회에 실패했습니다.');
      }

      const permissionData: MenuPermissionResponse = data.data;
      setMenus(permissionData.menus || []);
      
      // 첫 번째 메뉴 선택
      if (permissionData.menus && permissionData.menus.length > 0) {
        setSelectedMenuId(permissionData.menus[0].menuId);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '메뉴 권한 조회에 실패했습니다.');
      } else {
        toast.error('메뉴 권한 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 메뉴를 트리 구조로 변환
  const menuTree = useMemo(() => {
    const menuMap = new Map<string, MenuTreeNode>();
    const rootMenus: MenuTreeNode[] = [];

    // 모든 메뉴를 노드로 변환
    menus.forEach((menu) => {
      menuMap.set(menu.menuId, {
        ...menu,
        children: [],
      });
    });

    // 트리 구조 생성
    menus.forEach((menu) => {
      const node = menuMap.get(menu.menuId)!;
      if (menu.parentId && menuMap.has(menu.parentId)) {
        menuMap.get(menu.parentId)!.children.push(node);
      } else {
        rootMenus.push(node);
      }
    });

    // 정렬
    const sortMenus = (nodes: MenuTreeNode[]) => {
      nodes.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortMenus(node.children);
        }
      });
    };
    sortMenus(rootMenus);

    return rootMenus;
  }, [menus]);

  // 선택된 메뉴의 권한 정보
  const selectedMenu = useMemo(() => {
    return menus.find((menu) => menu.menuId === selectedMenuId);
  }, [menus, selectedMenuId]);

  // 권한 업데이트
  const updatePermission = (menuId: string, permissionType: string, value: boolean) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => {
        if (menu.menuId === menuId) {
          return {
            ...menu,
            [permissionType]: value,
            // 전체 권한이 체크되면 모든 권한 활성화
            ...(permissionType === 'permAll' && value
              ? {
                  permRead: true,
                  permCreate: true,
                  permUpdate: true,
                  permDelete: true,
                  permDownload: true,
                }
              : {}),
            // 전체 권한이 해제되면 모든 권한 비활성화
            ...(permissionType === 'permAll' && !value
              ? {
                  permRead: false,
                  permCreate: false,
                  permUpdate: false,
                  permDelete: false,
                  permDownload: false,
                }
              : {}),
          };
        }
        return menu;
      })
    );
  };

  // 저장
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetchWithTokenRefresh(getApiUrl('/user-role-menu'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userRoleId,
          menuPermissions: menus.map((menu) => ({
            menuId: menu.menuId,
            permRead: menu.permRead,
            permCreate: menu.permCreate,
            permUpdate: menu.permUpdate,
            permDelete: menu.permDelete,
            permDownload: menu.permDownload,
            permAll: menu.permAll,
          })),
        }),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '메뉴 권한 저장에 실패했습니다.');
      }

      toast.success('메뉴 권한이 저장되었습니다.');
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '메뉴 권한 저장에 실패했습니다.');
      } else {
        toast.error('메뉴 권한 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 메뉴 트리 렌더링
  const renderMenuTree = (nodes: MenuTreeNode[], level: number = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => (
          <div key={node.menuId}>
            <button
              onClick={() => setSelectedMenuId(node.menuId)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedMenuId === node.menuId
                  ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-[#1a1e2c] text-gray-900 dark:text-white'
              }`}
              style={{ paddingLeft: `${0.75 + level * 1.5}rem` }}
            >
              <div className="flex items-center gap-2">
                {node.children.length > 0 && (
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <span className="flex-1 truncate">{node.menuName}</span>
              </div>
            </button>
            {node.children.length > 0 && (
              <div className="ml-4 mt-1">
                {renderMenuTree(node.children, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl dark:bg-[#141827] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#1f2435]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              메뉴별 권한 관리
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {userRoleName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#1a1e2c] dark:hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* 왼쪽: 메뉴 트리 */}
          <div className="w-1/3 border-r border-gray-200 dark:border-[#1f2435] overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">메뉴 목록</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-400"></div>
              </div>
            ) : (
              <div>{renderMenuTree(menuTree)}</div>
            )}
          </div>

          {/* 오른쪽: 권한 설정 */}
          <div className="w-2/3 overflow-y-auto p-6">
            {selectedMenu ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedMenu.menuName}
                </h3>
                {selectedMenu.menuUrl && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {selectedMenu.menuUrl}
                  </p>
                )}

                <div className="space-y-4">
                  {/* 전체 권한 */}
                  <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                    <input
                      type="checkbox"
                      checked={selectedMenu.permAll}
                      onChange={(e) => updatePermission(selectedMenu.menuId, 'permAll', e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c]"
                    />
                    <label className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer flex-1">
                      전체
                    </label>
                  </div>

                  {/* 개별 권한 */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'permRead', label: '읽기' },
                      { key: 'permCreate', label: '등록' },
                      { key: 'permUpdate', label: '수정' },
                      { key: 'permDelete', label: '삭제' },
                      { key: 'permDownload', label: '다운로드' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedMenu[key as keyof MenuPermissionItem]
                            ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:hover:border-[#303650]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMenu[key as keyof MenuPermissionItem] as boolean}
                          onChange={(e) => updatePermission(selectedMenu.menuId, key, e.target.checked)}
                          disabled={selectedMenu.permAll}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-[#1a1e2c]"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    왼쪽에서 메뉴를 선택하세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-[#1f2435]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-[#1a1e2c] dark:border-[#303650] dark:hover:bg-[#1f2435]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Tab } from '@headlessui/react';
import LoadingState from '@/components/admin/LoadingState';
import EmptyState from '@/components/admin/EmptyState';
import { fetchWithTokenRefresh, logout } from '@/app/_lib/utils/auth';
import { getApiUrl } from '@/app/_lib/api/client';

interface MenuPermissionItem {
  menuId: string;
  siteId: string;
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

interface Site {
  id: string;
  siteName: string;
  siteType?: string;
  contextPath?: string;
}

interface MenuTreeNode extends MenuPermissionItem {
  children: MenuTreeNode[];
  level?: number;
}

// 헤더 체크박스 컴포넌트
function HeaderCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-0.5">
      <span className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">{label}</span>
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c] cursor-pointer"
      />
    </div>
  );
}

function MenuPermissionPageContent() {
  const router = useRouter();
  const params = useParams();
  const userRoleId = params?.id as string;

  const [menus, setMenus] = useState<MenuPermissionItem[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [userRoleName, setUserRoleName] = useState<string>('');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  // 사이트 목록 조회 및 초기화
  useEffect(() => {
    const initialize = async () => {
      await fetchSites();
      if (userRoleId) {
        await fetchMenuPermissions();
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRoleId]);

  const fetchSites = async () => {
    try {
      const response = await fetchWithTokenRefresh(getApiUrl('/site'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        const sitesData = data.data || [];
        // C001 (관리자) 사이트만 필터링
        const filteredSites = sitesData.filter((site: Site) => site.siteType === 'C001');
        setSites(filteredSites);
        // 첫 번째 사이트를 기본 선택
        if (filteredSites.length > 0 && !selectedSiteId) {
          setSelectedSiteId(filteredSites[0].id);
        }
      }
    } catch (error) {
      console.error('사이트 목록 조회 실패:', error);
    }
  };

  const fetchMenuPermissions = async () => {
    if (!userRoleId) return;
    
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
      const menusData = permissionData.menus || [];
      setMenus(menusData);
      setUserRoleName(permissionData.userRoleName || '');
      
      // 모든 메뉴를 확장 상태로 설정
      const allMenuIds = menusData.map(m => m.menuId);
      setExpandedMenus(new Set(allMenuIds));
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

  // 선택된 사이트의 메뉴만 필터링
  const filteredMenus = useMemo(() => {
    if (!selectedSiteId) return [];
    
    // siteId가 없는 메뉴가 있으면 경고 출력
    const menusWithoutSiteId = menus.filter(m => !m.siteId || m.siteId === 'undefined' || m.siteId === 'null');
    if (menusWithoutSiteId.length > 0) {
      console.warn(`경고: siteId가 없는 메뉴가 ${menusWithoutSiteId.length}개 있습니다.`, menusWithoutSiteId.map(m => ({ menuId: m.menuId, menuName: m.menuName })));
    }
    
    // siteId가 없는 경우, 첫 번째 사이트의 메뉴로 간주 (임시 처리)
    // 실제로는 백엔드에서 siteId를 제대로 반환해야 합니다
    const filtered = menus.filter((menu) => {
      const menuSiteId = menu.siteId;
      
      // siteId가 없거나 undefined인 경우, 첫 번째 사이트로 간주
      if (!menuSiteId || menuSiteId === 'undefined' || menuSiteId === 'null') {
        return sites.length > 0 && sites[0].id === selectedSiteId;
      }
      
      // siteId가 있는 경우 정상적으로 비교
      const menuSiteIdStr = String(menuSiteId).trim();
      const selectedIdStr = String(selectedSiteId).trim();
      return menuSiteIdStr === selectedIdStr;
    });
    
    return filtered;
  }, [menus, selectedSiteId, sites]);

  // 메뉴를 트리 구조로 변환
  const menuTree = useMemo(() => {
    const menuMap = new Map<string, MenuTreeNode>();
    const rootMenus: MenuTreeNode[] = [];

    // 모든 메뉴를 노드로 변환
    filteredMenus.forEach((menu) => {
      menuMap.set(menu.menuId, {
        ...menu,
        children: [],
      });
    });

    // 트리 구조 생성
    filteredMenus.forEach((menu) => {
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
  }, [filteredMenus]);

  // 권한 업데이트
  const updatePermission = (menuId: string, permissionType: string, value: boolean) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => {
        if (menu.menuId === menuId) {
          const updatedMenu = {
            ...menu,
            [permissionType]: value,
          };

          // 전체 권한이 체크되면 모든 권한 활성화
          if (permissionType === 'permAll' && value) {
            updatedMenu.permRead = true;
            updatedMenu.permCreate = true;
            updatedMenu.permUpdate = true;
            updatedMenu.permDelete = true;
            updatedMenu.permDownload = true;
          }
          // 전체 권한이 해제되면 모든 권한 비활성화
          else if (permissionType === 'permAll' && !value) {
            updatedMenu.permRead = false;
            updatedMenu.permCreate = false;
            updatedMenu.permUpdate = false;
            updatedMenu.permDelete = false;
            updatedMenu.permDownload = false;
          }
          // 전체가 아닌 다른 권한이 변경될 때
          else if (permissionType !== 'permAll') {
            // 권한이 해제되면 전체 권한도 해제
            if (!value) {
              updatedMenu.permAll = false;
            } else {
              // 권한이 체크되면, 모든 권한(읽기, 등록, 수정, 삭제, 다운로드)이 체크되어 있는지 확인
              const allPermissionsChecked = 
                updatedMenu.permRead === true &&
                updatedMenu.permCreate === true &&
                updatedMenu.permUpdate === true &&
                updatedMenu.permDelete === true &&
                updatedMenu.permDownload === true;
              
              // 모든 권한이 체크되어 있으면 전체 권한도 활성화
              if (allPermissionsChecked) {
                updatedMenu.permAll = true;
              }
            }
          }

          return updatedMenu;
        }
        return menu;
      })
    );
  };

  // 헤더 체크박스용: 모든 메뉴의 특정 권한 일괄 업데이트
  const updateAllPermissions = (permissionType: string, value: boolean) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => {
        // 선택된 사이트의 메뉴만 업데이트
        const menuSiteId = menu.siteId;
        const shouldUpdate = !menuSiteId || menuSiteId === 'undefined' || menuSiteId === 'null'
          ? sites.length > 0 && sites[0].id === selectedSiteId
          : String(menuSiteId).trim() === String(selectedSiteId).trim();

        if (shouldUpdate) {
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

  // 헤더 체크박스 상태 계산 (모든 메뉴가 체크되어 있는지 확인)
  const getHeaderCheckboxState = useMemo(() => {
    return (permissionType: string): { checked: boolean; indeterminate: boolean } => {
      if (filteredMenus.length === 0) {
        return { checked: false, indeterminate: false };
      }

      const checkedCount = filteredMenus.filter((menu) => {
        const value = menu[permissionType as keyof MenuPermissionItem];
        return value === true;
      }).length;

      const checked = checkedCount === filteredMenus.length;
      const indeterminate = checkedCount > 0 && checkedCount < filteredMenus.length;

      return { checked, indeterminate };
    };
  }, [filteredMenus]);

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
          menuPermissions: menus
            .filter((menu) => {
              // 권한이 하나라도 체크된 메뉴만 전송
              return menu.permRead === true 
                || menu.permCreate === true 
                || menu.permUpdate === true 
                || menu.permDelete === true 
                || menu.permDownload === true 
                || menu.permAll === true;
            })
            .map((menu) => ({
              menuId: menu.menuId,
              permRead: menu.permRead === true,
              permCreate: menu.permCreate === true,
              permUpdate: menu.permUpdate === true,
              permDelete: menu.permDelete === true,
              permDownload: menu.permDownload === true,
              permAll: menu.permAll === true,
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
      router.push('/admin/user-roles');
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

  // 평면화된 메뉴 목록 생성 (트리 구조를 유지하면서)
  const flattenMenuTree = (nodes: MenuTreeNode[], level: number = 0): MenuTreeNode[] => {
    const result: MenuTreeNode[] = [];
    nodes.forEach((node) => {
      result.push({ ...node, level });
      if (node.children && node.children.length > 0) {
        result.push(...flattenMenuTree(node.children, level + 1));
      }
    });
    return result;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const flattenedMenus = useMemo(() => {
    return flattenMenuTree(menuTree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuTree]);

  // 메뉴 행 렌더링
  const renderMenuRow = (menu: MenuTreeNode) => {
    const level = menu.level || 0;
    const isExpanded = expandedMenus.has(menu.menuId);
    const hasChildren = menu.children && menu.children.length > 0;

    return (
      <tr key={menu.menuId} className="group border-b border-gray-200 dark:border-[#1f2435] hover:bg-gray-50 dark:hover:bg-[#252a3a]">
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-1.5" style={{ paddingLeft: `${level * 16}px` }}>
            {hasChildren ? (
              <button
                onClick={() => {
                  const newExpanded = new Set(expandedMenus);
                  if (isExpanded) {
                    newExpanded.delete(menu.menuId);
                  } else {
                    newExpanded.add(menu.menuId);
                  }
                  setExpandedMenus(newExpanded);
                }}
                className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              >
                <svg
                  className={`h-2.5 w-2.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className="h-3.5 w-3.5" />
            )}
            <span className="text-xs text-gray-900 dark:text-white dark:group-hover:text-gray-300">{menu.menuName}</span>
          </div>
        </td>
        <td className="px-4 py-2.5 text-center">
          <input
            type="checkbox"
            checked={menu.permRead === true}
            onChange={(e) => updatePermission(menu.menuId, 'permRead', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c]"
          />
        </td>
        <td className="px-4 py-2.5 text-center">
          <input
            type="checkbox"
            checked={menu.permCreate === true}
            onChange={(e) => updatePermission(menu.menuId, 'permCreate', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c]"
          />
        </td>
        <td className="px-4 py-2.5 text-center">
          <input
            type="checkbox"
            checked={menu.permUpdate === true}
            onChange={(e) => updatePermission(menu.menuId, 'permUpdate', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c]"
          />
        </td>
        <td className="px-4 py-2.5 text-center">
          <input
            type="checkbox"
            checked={menu.permDelete === true}
            onChange={(e) => updatePermission(menu.menuId, 'permDelete', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c]"
          />
        </td>
        <td className="px-4 py-2.5 text-center">
          <input
            type="checkbox"
            checked={menu.permDownload === true}
            onChange={(e) => updatePermission(menu.menuId, 'permDownload', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c]"
          />
        </td>
        <td className="px-4 py-2.5 text-center">
          <input
            type="checkbox"
            checked={menu.permAll === true}
            onChange={(e) => updatePermission(menu.menuId, 'permAll', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a1e2c]"
          />
        </td>
      </tr>
    );
  };

  // 확장/축소된 메뉴만 표시
  const visibleMenus = useMemo(() => {
    const result: (MenuTreeNode & { level?: number })[] = [];
    
    const addVisibleMenus = (nodes: MenuTreeNode[], level: number = 0, parentExpanded: boolean = true) => {
      nodes.forEach((node) => {
        if (parentExpanded) {
          result.push({ ...node, level });
          const isExpanded = expandedMenus.has(node.menuId);
          if (node.children && node.children.length > 0) {
            addVisibleMenus(node.children, level + 1, isExpanded);
          }
        }
      });
    };
    
    addVisibleMenus(menuTree);
    return result;
  }, [menuTree, expandedMenus]);

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="px-4 py-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              메뉴별 권한 관리
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {userRoleName}
            </p>
          </div>
        </div>

        {/* 사이트 탭 */}
        {sites.length > 0 && (() => {
          const selectedIndex = sites.findIndex(s => s.id === selectedSiteId);
          return (
            <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
              <Tab.Group 
                selectedIndex={selectedIndex >= 0 ? selectedIndex : 0} 
                onChange={(index) => setSelectedSiteId(sites[index]?.id || '')}
              >
                <Tab.List className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 px-2 dark:border-[#1f2435]">
                  {sites.map((site) => (
                    <Tab
                      key={site.id}
                      className={({ selected }) =>
                        `shrink-0 border-b-[3px] px-3 py-2 text-xs font-medium transition-colors focus:outline-none ${
                          selected
                            ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white [&.dark]:!border-white'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300'
                        }`
                      }
                    >
                      {site.siteName}
                    </Tab>
                  ))}
                </Tab.List>
              </Tab.Group>
            </div>
          );
        })()}

        {/* Content - 표 형식 */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119] overflow-hidden">
          <div className="overflow-x-auto p-1">
            {isLoading ? (
              <div className="p-8">
                <LoadingState message="메뉴 권한을 불러오는 중..." />
              </div>
            ) : !selectedSiteId ? (
              <div className="p-8">
                <EmptyState
                  icon={
                    <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                  message="사이트를 선택해주세요."
                />
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={
                    <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  }
                  message={`선택된 사이트에 메뉴가 없습니다. (전체 메뉴 수: ${menus.length})`}
                />
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-[#141827] border-b border-gray-200 dark:border-[#1f2435]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-900 dark:text-white">
                      메뉴
                    </th>
                    <th className="px-4 py-3 text-center w-16">
                      <HeaderCheckbox
                        checked={getHeaderCheckboxState('permRead').checked}
                        indeterminate={getHeaderCheckboxState('permRead').indeterminate}
                        onChange={(checked) => updateAllPermissions('permRead', checked)}
                        label="읽기"
                      />
                    </th>
                    <th className="px-4 py-3 text-center w-16">
                      <HeaderCheckbox
                        checked={getHeaderCheckboxState('permCreate').checked}
                        indeterminate={getHeaderCheckboxState('permCreate').indeterminate}
                        onChange={(checked) => updateAllPermissions('permCreate', checked)}
                        label="등록"
                      />
                    </th>
                    <th className="px-4 py-3 text-center w-16">
                      <HeaderCheckbox
                        checked={getHeaderCheckboxState('permUpdate').checked}
                        indeterminate={getHeaderCheckboxState('permUpdate').indeterminate}
                        onChange={(checked) => updateAllPermissions('permUpdate', checked)}
                        label="수정"
                      />
                    </th>
                    <th className="px-4 py-3 text-center w-16">
                      <HeaderCheckbox
                        checked={getHeaderCheckboxState('permDelete').checked}
                        indeterminate={getHeaderCheckboxState('permDelete').indeterminate}
                        onChange={(checked) => updateAllPermissions('permDelete', checked)}
                        label="삭제"
                      />
                    </th>
                    <th className="px-4 py-3 text-center w-20">
                      <HeaderCheckbox
                        checked={getHeaderCheckboxState('permDownload').checked}
                        indeterminate={getHeaderCheckboxState('permDownload').indeterminate}
                        onChange={(checked) => updateAllPermissions('permDownload', checked)}
                        label="다운로드"
                      />
                    </th>
                    <th className="px-4 py-3 text-center w-16">
                      <HeaderCheckbox
                        checked={getHeaderCheckboxState('permAll').checked}
                        indeterminate={getHeaderCheckboxState('permAll').indeterminate}
                        onChange={(checked) => updateAllPermissions('permAll', checked)}
                        label="전체"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[#1f2435]">
                  {visibleMenus.map((menu) => renderMenuRow(menu))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-[#1f2435] dark:bg-[#0f1119]">
          <button
            onClick={() => router.push('/admin/user-roles')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-700"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            {isSaving ? '처리 중...' : '저장'}
          </button>
        </div>
      </div>
    </>
  );
}

export default function MenuPermissionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 animate-spin text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    }>
      <MenuPermissionPageContent />
    </Suspense>
  );
}

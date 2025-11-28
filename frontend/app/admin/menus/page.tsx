'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tab } from '@headlessui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import MenuList from '../../components/admin/menus/MenuList';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

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
  siteType: 'ADMIN' | 'PORTAL';
  siteName: string;
  description?: string;
  version: string;
  enabled?: boolean;
}

interface Icon {
  id: string;
  iconId: string;
  name: string;
  svgCode: string;
  enabled?: boolean;
}

function MenusPageContent() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; menu: Menu | null }>({
    isOpen: false,
    menu: null,
  });

  // 사이트 목록 조회
  const fetchSites = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return;
      }

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
        setSites(sitesData);
        // 첫 번째 사이트를 기본 선택
        if (sitesData.length > 0 && !selectedSiteId) {
          setSelectedSiteId(sitesData[0].id);
        }
      }
    } catch (error) {
      console.error('사이트 목록 조회 실패:', error);
    }
  };

  // 메뉴 목록 조회
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/menu'), {
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || '메뉴 목록 조회에 실패했습니다.');
      }

      setMenus(data.data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '메뉴 목록 조회에 실패했습니다.');
      } else {
        toast.error('메뉴 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 아이콘 목록 조회
  const fetchIcons = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return;
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/icon'), {
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
        setIcons(data.data || []);
      }
    } catch (error) {
      console.error('아이콘 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchSites();
    fetchMenus();
    fetchIcons();
  }, []);

  // 다음 표시 순서 계산 (같은 레벨의 메뉴 중 최대값 + 1)
  const getNextDisplayOrder = (siteId: string, parentId?: string): number => {
    const sameLevelMenus = menus.filter(
      (menu) => menu.siteId === siteId && menu.parentId === (parentId || null)
    );
    if (sameLevelMenus.length === 0) {
      return 0;
    }
    const maxOrder = Math.max(...sameLevelMenus.map((menu) => menu.displayOrder));
    return maxOrder + 1;
  };

  // 다음 메뉴명 생성 (신규메뉴 1, 2, 3...)
  const getNextMenuName = (siteId: string, parentId?: string): string => {
    const sameLevelMenus = menus.filter(
      (menu) => menu.siteId === siteId && menu.parentId === (parentId || null)
    );
    const menuNames = sameLevelMenus
      .map((menu) => menu.name)
      .filter((name) => name.startsWith('신규메뉴'))
      .map((name) => {
        const match = name.match(/신규메뉴\s*(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => !isNaN(num))
      .sort((a, b) => b - a);
    const maxNum = menuNames.length > 0 ? menuNames[0] : 0;
    return `신규메뉴 ${maxNum + 1}`;
  };

  const handleAdd = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 사이트가 없으면 에러
      if (sites.length === 0) {
        throw new Error('사이트가 없습니다. 먼저 사이트를 생성해주세요.');
      }

      // 선택된 사이트 사용 (없으면 첫 번째 사이트)
      const targetSiteId = selectedSiteId || sites[0]?.id;
      if (!targetSiteId) {
        throw new Error('사이트를 선택해주세요.');
      }
      const nextName = getNextMenuName(targetSiteId);
      const nextDisplayOrder = getNextDisplayOrder(targetSiteId);

      const requestBody = {
        siteId: targetSiteId,
        name: nextName,
        url: '',
        displayOrder: nextDisplayOrder,
        parentId: null,
      };

      const response = await fetchWithTokenRefresh(getApiUrl('/menu'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '메뉴 생성에 실패했습니다.');
      }

      toast.success('메뉴가 성공적으로 생성되었습니다.');
      await fetchMenus();
      
      // 생성된 메뉴 자동 선택 (fetchMenus 완료 후 약간의 지연)
      const createdMenuId = data.data?.id || data.data?.menuId;
      if (createdMenuId) {
        setTimeout(() => {
          setSelectedMenuId(createdMenuId);
        }, 100);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '메뉴 생성에 실패했습니다.');
      } else {
        toast.error('메뉴 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddChild = async (parentMenu: Menu) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const nextName = getNextMenuName(parentMenu.siteId, parentMenu.id);
      const nextDisplayOrder = getNextDisplayOrder(parentMenu.siteId, parentMenu.id);

      const requestBody = {
        siteId: parentMenu.siteId,
        name: nextName,
        url: '',
        icon: '',
        displayOrder: nextDisplayOrder,
        parentId: parentMenu.id,
      };

      const response = await fetchWithTokenRefresh(getApiUrl('/menu'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '하위 메뉴 생성에 실패했습니다.');
      }

      toast.success('하위 메뉴가 성공적으로 생성되었습니다.');
      await fetchMenus();
      
      // 생성된 하위 메뉴 자동 선택 (fetchMenus 완료 후 약간의 지연)
      const createdMenuId = data.data?.id || data.data?.menuId;
      if (createdMenuId) {
        setTimeout(() => {
          setSelectedMenuId(createdMenuId);
        }, 100);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '하위 메뉴 생성에 실패했습니다.');
      } else {
        toast.error('하위 메뉴 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (menu: Menu) => {
    // 편집 모드는 MenuList 내부에서 처리
  };

  const handleDelete = (menu: Menu) => {
    setDeleteDialog({ isOpen: true, menu });
  };

  const handleToggleEnabled = async (menu: Menu, enabled: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/menu/${menu.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: menu.name,
          url: menu.url || '',
          displayOrder: menu.displayOrder,
          parentId: menu.parentId || null,
          enabled: enabled,
        }),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '상태 변경에 실패했습니다.');
      }

      toast.success(`메뉴가 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
      fetchMenus();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '상태 변경에 실패했습니다.');
      } else {
        toast.error('상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
      fetchMenus();
    }
  };

  const handleReorder = async (reorderedMenus: Array<{ id: string; parentId: string | null; displayOrder: number }>) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 모든 메뉴를 순차적으로 업데이트
      const updatePromises = reorderedMenus.map(async (reorderedMenu) => {
        const menu = menus.find((m) => m.id === reorderedMenu.id);
        if (!menu) {
          return;
        }

        const response = await fetchWithTokenRefresh(getApiUrl(`/menu/${reorderedMenu.id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: menu.name,
            url: menu.url || '',
            displayOrder: reorderedMenu.displayOrder,
            parentId: reorderedMenu.parentId,
            enabled: menu.enabled ?? true,
          }),
        });

        if (response.status === 401) {
          logout(router);
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || `메뉴 "${menu.name}" 순서 변경에 실패했습니다.`);
        }
      });

      await Promise.all(updatePromises);

      toast.success('메뉴 순서가 변경되었습니다.');
      await fetchMenus();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '메뉴 순서 변경에 실패했습니다.');
      } else {
        toast.error('메뉴 순서 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.menu) return;

    const menu = deleteDialog.menu;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/menu/${menu.id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '메뉴 삭제에 실패했습니다.');
      }

      // 삭제된 메뉴 바로 위의 메뉴 찾기
      const sameLevelMenus = menus.filter(
        (m) => m.parentId === (menu.parentId || null) && m.id !== menu.id
      );
      const sortedMenus = [...sameLevelMenus].sort((a, b) => a.displayOrder - b.displayOrder);
      
      // 삭제된 메뉴의 displayOrder보다 작은 메뉴 중 가장 큰 displayOrder를 가진 메뉴 찾기
      let menuToSelect: Menu | null = null;
      const menusBeforeDeleted = sortedMenus.filter((m) => m.displayOrder < menu.displayOrder);
      
      if (menusBeforeDeleted.length > 0) {
        // 삭제된 메뉴 바로 위의 메뉴 선택
        menuToSelect = menusBeforeDeleted[menusBeforeDeleted.length - 1];
      } else if (sortedMenus.length > 0) {
        // 위에 메뉴가 없으면 첫 번째 메뉴 선택
        menuToSelect = sortedMenus[0];
      } else {
        // 같은 레벨에 메뉴가 없으면 부모 메뉴 선택
        if (menu.parentId) {
          const parentMenu = menus.find((m) => m.id === menu.parentId);
          if (parentMenu) {
            menuToSelect = parentMenu;
          }
        }
      }

      toast.success('메뉴가 성공적으로 삭제되었습니다.');
      setDeleteDialog({ isOpen: false, menu: null });
      await fetchMenus();
      
      // 삭제된 메뉴 바로 위의 메뉴 자동 선택
      if (menuToSelect) {
        // fetchMenus 완료 후 선택 (약간의 지연)
        setTimeout(() => {
          setSelectedMenuId(menuToSelect!.id);
        }, 100);
      } else {
        setSelectedMenuId(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '메뉴 삭제에 실패했습니다.');
      } else {
        toast.error('메뉴 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const isEditMode = formData.id;
      const url = isEditMode
        ? getApiUrl(`/menu/${formData.id}`)
        : getApiUrl('/menu');
      const method = isEditMode ? 'PUT' : 'POST';

      const requestBody = isEditMode
        ? {
            name: formData.name,
            url: formData.url || '',
            icon: formData.icon || '',
            displayOrder: formData.displayOrder || 0,
            parentId: formData.parentId || null,
            enabled: formData.enabled ?? true,
          }
        : {
            siteId: formData.siteId,
            name: formData.name,
            url: formData.url || '',
            icon: formData.icon || '',
            displayOrder: formData.displayOrder || 0,
            parentId: formData.parentId || null,
          };

      const response = await fetchWithTokenRefresh(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
      }

      toast.success(`메뉴가 성공적으로 ${isEditMode ? '수정' : '생성'}되었습니다.`);
      await fetchMenus();
    } catch (error) {
      const isEditMode = formData.id;
      if (error instanceof Error) {
        toast.error(error.message || `메뉴 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`메뉴 ${isEditMode ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 선택된 사이트의 메뉴만 필터링
  const filteredMenus = useMemo(() => {
    if (!selectedSiteId) return menus;
    return menus.filter((menu) => menu.siteId === selectedSiteId);
  }, [menus, selectedSiteId]);


  return (
    <AdminLayout>
      <div className="space-y-3">
        {/* 사이트 탭 */}
        {sites.length > 0 && (() => {
          const selectedIndex = sites.findIndex(s => s.id === selectedSiteId);
          return (
            <div className="border border-gray-200 bg-white dark:border-[#1f2435] dark:bg-[#0f1119]">
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

        <MenuList
          menus={filteredMenus}
          isLoading={isLoading}
          onAdd={handleAdd}
          onAddChild={handleAddChild}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onToggleEnabled={handleToggleEnabled}
          onReorder={handleReorder}
          sites={sites}
          icons={icons}
          selectedSiteId={selectedSiteId}
          isSubmitting={isSubmitting}
          selectedMenuId={selectedMenuId}
          onSelectMenu={(menu) => {
            // 사용자가 직접 메뉴를 클릭한 경우에만 업데이트
            setSelectedMenuId(menu?.id || null);
          }}
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => {
          if (!isLoading) {
            setDeleteDialog({ isOpen: false, menu: null });
          }
        }}
        onConfirm={handleConfirmDelete}
        title="메뉴 삭제"
        message={deleteDialog.menu ? `정말로 "${deleteDialog.menu.name}" 메뉴를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.` : '메뉴를 삭제하시겠습니까?'}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

export default function MenusPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="mx-auto h-8 w-8 animate-spin text-green-600"
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
      </AdminLayout>
    }>
      <MenusPageContent />
    </Suspense>
  );
}

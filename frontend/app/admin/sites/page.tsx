'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '../../components/admin/AdminLayout';
import SiteList from '../../components/admin/sites/SiteList';
import SiteForm from '../../components/admin/sites/SiteForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../utils/auth';

interface Site {
  id: string;
  siteType: string;
  siteName: string;
  description?: string;
  version: string;
  enabled?: boolean;
}

interface CmnCd {
  id: string;
  cd: string;
  name: string;
  description?: string;
  enabled?: boolean;
  parentCd?: string;
  children?: CmnCd[];
}

function SitesPageContent() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; site: Site | null }>({
    isOpen: false,
    site: null,
  });
  const [siteTypeOptions, setSiteTypeOptions] = useState<Array<{ value: string; label: string }>>([]);

  // 공통코드에서 사이트 타입 옵션 조회 (P001의 하위코드)
  const fetchSiteTypeOptions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh('http://localhost:8080/api/v1/cmn-cd', {
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
        throw new Error(data.message || '공통코드 조회에 실패했습니다.');
      }

      const cmnCds: CmnCd[] = data.data || [];
      // P001 찾기
      const p001 = cmnCds.find((cd) => cd.cd === 'P001');
      
      if (p001 && p001.children) {
        // P001의 하위코드들을 옵션으로 변환
        const options = p001.children
          .filter((child) => child.enabled !== false) // 활성화된 것만
          .map((child) => ({
            value: child.cd,
            label: child.name,
          }));
        setSiteTypeOptions(options);
      } else {
        // P001이 없거나 하위코드가 없는 경우 빈 배열
        setSiteTypeOptions([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '사이트 타입 옵션 조회에 실패했습니다.');
      } else {
        toast.error('사이트 타입 옵션 조회에 실패했습니다. 다시 시도해주세요.');
      }
      setSiteTypeOptions([]);
    }
  };

  // 사이트 목록 조회
  const fetchSites = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh('http://localhost:8080/api/v1/site', {
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
        throw new Error(data.message || '사이트 목록 조회에 실패했습니다.');
      }

      setSites(data.data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '사이트 목록 조회에 실패했습니다.');
      } else {
        toast.error('사이트 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteTypeOptions();
    fetchSites();
  }, []);

  const handleAdd = () => {
    setEditingSite({} as Site);
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
  };

  const handleDelete = (site: Site) => {
    setDeleteDialog({ isOpen: true, site });
  };

  const handleToggleEnabled = async (site: Site, enabled: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(`http://localhost:8080/api/v1/site/${site.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteName: site.siteName,
          description: site.description || '',
          version: site.version,
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

      toast.success(`사이트가 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
      fetchSites();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '상태 변경에 실패했습니다.');
      } else {
        toast.error('상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
      fetchSites();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.site) return;

    const site = deleteDialog.site;
    setDeleteDialog({ isOpen: false, site: null });
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(`http://localhost:8080/api/v1/site/${site.id}`, {
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
        throw new Error(data.message || '사이트 삭제에 실패했습니다.');
      }

      toast.success('사이트가 성공적으로 삭제되었습니다.');
      fetchSites();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '사이트 삭제에 실패했습니다.');
      } else {
        toast.error('사이트 삭제에 실패했습니다. 다시 시도해주세요.');
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

      const isEditMode = editingSite && editingSite.id;
      const url = isEditMode
        ? `http://localhost:8080/api/v1/site/${editingSite.id}`
        : 'http://localhost:8080/api/v1/site';
      const method = isEditMode ? 'PUT' : 'POST';

      const requestBody = isEditMode
        ? {
            siteName: formData.siteName,
            description: formData.description || '',
            version: formData.version,
            enabled: formData.enabled ?? true,
          }
        : {
            siteType: formData.siteType,
            siteName: formData.siteName,
            description: formData.description || '',
            version: formData.version,
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

      toast.success(`사이트가 성공적으로 ${isEditMode ? '수정' : '생성'}되었습니다.`);
      setTimeout(() => {
        setEditingSite(null);
        fetchSites();
      }, 1500);
    } catch (error) {
      const isEditMode = editingSite && editingSite.id;
      if (error instanceof Error) {
        toast.error(error.message || `사이트 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`사이트 ${isEditMode ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-3">
        {editingSite ? (
          <SiteForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingSite(null);
            }}
            initialData={editingSite.id ? {
              siteType: editingSite.siteType,
              siteName: editingSite.siteName,
              description: editingSite.description,
              version: editingSite.version,
              enabled: editingSite.enabled,
            } : undefined}
            isLoading={isSubmitting}
            siteTypeOptions={siteTypeOptions}
          />
        ) : (
          <SiteList
            sites={sites}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleEnabled={handleToggleEnabled}
            siteTypeOptions={siteTypeOptions}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, site: null })}
        onConfirm={handleConfirmDelete}
        title="사이트 삭제"
        message={`정말로 "${deleteDialog.site?.siteName}" 사이트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

export default function SitesPage() {
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
      <SitesPageContent />
    </Suspense>
  );
}

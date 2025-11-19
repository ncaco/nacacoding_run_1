'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/PageHeader';
import SiteList from '../../components/admin/sites/SiteList';
import SiteForm from '../../components/admin/sites/SiteForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../utils/auth';

interface Site {
  id: string;
  siteType: 'ADMIN' | 'PORTAL';
  siteName: string;
  description?: string;
  version: string;
  enabled?: boolean;
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
        <PageHeader title="사이트 관리" description="사이트를 생성, 수정, 삭제할 수 있습니다." />
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
          />
        ) : (
          <SiteList
            sites={sites}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

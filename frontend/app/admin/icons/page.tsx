'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '../../components/admin/AdminLayout';
import IconList from '../../components/admin/icons/IconList';
import IconForm from '../../components/admin/icons/IconForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

interface Icon {
  id: string;
  iconId: string;
  name: string;
  svgCode: string;
  enabled?: boolean;
}

function IconsPageContent() {
  const router = useRouter();
  const [icons, setIcons] = useState<Icon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; icon: Icon | null }>({
    isOpen: false,
    icon: null,
  });

  // 아이콘 목록 조회
  const fetchIcons = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || '아이콘 목록 조회에 실패했습니다.');
      }

      setIcons(data.data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '아이콘 목록 조회에 실패했습니다.');
      } else {
        toast.error('아이콘 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  const handleAdd = () => {
    setEditingIcon({} as Icon);
  };

  const handleEdit = (icon: Icon) => {
    setEditingIcon(icon);
  };

  const handleDelete = (icon: Icon) => {
    setDeleteDialog({ isOpen: true, icon });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.icon) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/icon/${deleteDialog.icon.id}`), {
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
        throw new Error(data.message || '아이콘 삭제에 실패했습니다.');
      }

      toast.success('아이콘이 성공적으로 삭제되었습니다.');
      setDeleteDialog({ isOpen: false, icon: null });
      fetchIcons();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '아이콘 삭제에 실패했습니다.');
      } else {
        toast.error('아이콘 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEnabled = async (icon: Icon, enabled: boolean) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/icon/${icon.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: icon.name,
          svgCode: icon.svgCode,
          enabled,
        }),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '아이콘 상태 변경에 실패했습니다.');
      }

      toast.success(`아이콘이 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
      fetchIcons();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '아이콘 상태 변경에 실패했습니다.');
      } else {
        toast.error('아이콘 상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const isEditMode = editingIcon && editingIcon.id;
      const url = isEditMode
        ? getApiUrl(`/icon/${editingIcon.id}`)
        : getApiUrl('/icon');
      const method = isEditMode ? 'PUT' : 'POST';

      const requestBody = isEditMode
        ? {
            name: formData.name,
            svgCode: formData.svgCode,
            enabled: formData.enabled ?? true,
          }
        : {
            iconId: formData.iconId,
            name: formData.name,
            svgCode: formData.svgCode,
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

      toast.success(`아이콘이 성공적으로 ${isEditMode ? '수정' : '생성'}되었습니다.`);
      
      setTimeout(() => {
        setEditingIcon(null);
        fetchIcons();
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || `아이콘 ${editingIcon ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`아이콘 ${editingIcon ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-3">
        {editingIcon ? (
          <IconForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingIcon(null);
            }}
            initialData={
              editingIcon.id
                ? {
                    iconId: editingIcon.iconId,
                    name: editingIcon.name,
                    svgCode: editingIcon.svgCode,
                    enabled: editingIcon.enabled,
                  }
                : undefined
            }
            isLoading={isSubmitting}
          />
        ) : (
          <IconList
            icons={icons}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleEnabled={handleToggleEnabled}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, icon: null })}
        onConfirm={handleConfirmDelete}
        title="아이콘 삭제"
        message={deleteDialog.icon ? `정말로 "${deleteDialog.icon.name}" 아이콘을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.` : '정말로 이 아이콘을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

export default function IconsPage() {
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
      <IconsPageContent />
    </Suspense>
  );
}


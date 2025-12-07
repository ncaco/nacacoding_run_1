'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '../../components/admin/AdminLayout';
import MemberRoleList from '../../components/admin/member-roles/MemberRoleList';
import MemberRoleForm from '../../components/admin/member-roles/MemberRoleForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../_lib/utils/auth';
import { getApiUrl } from '../../_lib/api/client';

interface MemberRole {
  id: string;
  roleCd: string;
  roleNm: string;
  roleDesc?: string;
  enabled?: boolean;
}

function MemberRolePageContent() {
  const router = useRouter();
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMemberRole, setEditingMemberRole] = useState<MemberRole | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; memberRole: MemberRole | null }>({
    isOpen: false,
    memberRole: null,
  });

  // 역할 목록 조회
  const fetchMemberRoles = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/member-roles'), {
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
        throw new Error(data.message || '역할 목록 조회에 실패했습니다.');
      }

      setMemberRoles(data.data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '역할 목록 조회에 실패했습니다.');
      } else {
        toast.error('역할 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setEditingMemberRole({} as MemberRole);
  };

  const handleEdit = (memberRole: MemberRole) => {
    if (!memberRole.id) {
      toast.error('역할 ID가 없습니다.');
      return;
    }
    setEditingMemberRole(memberRole);
  };

  const handleDelete = (memberRole: MemberRole) => {
    setDeleteDialog({ isOpen: true, memberRole });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.memberRole) return;

    const memberRole = deleteDialog.memberRole;
    setDeleteDialog({ isOpen: false, memberRole: null });
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/member-roles/${memberRole.id}`), {
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
        throw new Error(data.message || '역할 삭제에 실패했습니다.');
      }

      toast.success('역할이 성공적으로 삭제되었습니다.');
      fetchMemberRoles();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '역할 삭제에 실패했습니다.');
      } else {
        toast.error('역할 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  interface MemberRoleFormData {
    roleCd: string;
    roleNm: string;
    roleDesc?: string;
    enabled?: boolean;
  }

  const handleSubmit = async (formData: MemberRoleFormData) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 수정 모드 확인: editingMemberRole가 있고 id가 있어야 함
      const isEditMode = !!(editingMemberRole && editingMemberRole.id && editingMemberRole.id.trim() !== '');
      
      // 수정 모드일 때는 반드시 id가 있어야 함
      if (isEditMode && !editingMemberRole?.id) {
        throw new Error('역할 ID가 없습니다. 다시 시도해주세요.');
      }
      
      const url = isEditMode
        ? getApiUrl(`/member-roles/${editingMemberRole!.id}`)
        : getApiUrl('/member-roles');
      const method = isEditMode ? 'PUT' : 'POST';

      const requestBody = isEditMode
        ? {
            roleNm: formData.roleNm,
            roleDesc: formData.roleDesc,
            enabled: formData.enabled,
          }
        : {
            roleCd: formData.roleCd,
            roleNm: formData.roleNm,
            roleDesc: formData.roleDesc,
            enabled: formData.enabled,
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

      toast.success(`역할이 성공적으로 ${isEditMode ? '수정' : '생성'}되었습니다.`);
      setTimeout(() => {
        setEditingMemberRole(null);
        fetchMemberRoles();
      }, 1500);
    } catch (error) {
      const isEditMode = editingMemberRole && editingMemberRole.id;
      if (error instanceof Error) {
        toast.error(error.message || `역할 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`역할 ${isEditMode ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEnabled = async (memberRole: MemberRole, enabled: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/member-roles/${memberRole.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleNm: memberRole.roleNm,
          roleDesc: memberRole.roleDesc,
          enabled: enabled,
        }),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '역할 상태 변경에 실패했습니다.');
      }

      toast.success(`역할이 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
      fetchMemberRoles();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '역할 상태 변경에 실패했습니다.');
      } else {
        toast.error('역할 상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
      // 실패 시 원래 상태로 복구
      fetchMemberRoles();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-3">
        {editingMemberRole ? (
          <MemberRoleForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingMemberRole(null);
            }}
            initialData={editingMemberRole.id ? {
              id: editingMemberRole.id,
              roleCd: editingMemberRole.roleCd,
              roleNm: editingMemberRole.roleNm,
              roleDesc: editingMemberRole.roleDesc,
              enabled: editingMemberRole.enabled,
            } : undefined}
            isLoading={isSubmitting}
          />
        ) : (
          <MemberRoleList
            memberRoles={memberRoles}
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
        onClose={() => setDeleteDialog({ isOpen: false, memberRole: null })}
        onConfirm={handleConfirmDelete}
        title="역할 삭제"
        message={`정말로 "${deleteDialog.memberRole?.roleNm}" 역할을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

export default function MemberRolePage() {
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
      <MemberRolePageContent />
    </Suspense>
  );
}


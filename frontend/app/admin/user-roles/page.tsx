'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '../../components/admin/AdminLayout';
import UserRoleList from '../../components/admin/user-roles/UserRoleList';
import UserRoleForm from '../../components/admin/user-roles/UserRoleForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

interface UserRole {
  id: string;
  roleCd: string;
  roleNm: string;
  roleDesc?: string;
  enabled?: boolean;
}

function UserRolePageContent() {
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUserRole, setEditingUserRole] = useState<UserRole | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; userRole: UserRole | null }>({
    isOpen: false,
    userRole: null,
  });

  // 역할 목록 조회
  const fetchUserRoles = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/user-roles'), {
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

      setUserRoles(data.data || []);
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
    fetchUserRoles();
  }, []);

  const handleAdd = () => {
    setEditingUserRole(null);
  };

  const handleEdit = (userRole: UserRole) => {
    setEditingUserRole(userRole);
  };

  const handleDelete = (userRole: UserRole) => {
    setDeleteDialog({ isOpen: true, userRole });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.userRole) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/user-roles/${deleteDialog.userRole.id}`), {
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

      toast.success('역할이 삭제되었습니다.');
      setDeleteDialog({ isOpen: false, userRole: null });
      fetchUserRoles();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '역할 삭제에 실패했습니다.');
      } else {
        toast.error('역할 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const isEdit = !!editingUserRole;
      const url = isEdit ? getApiUrl(`/user-roles/${editingUserRole!.id}`) : getApiUrl('/user-roles');
      const method = isEdit ? 'PUT' : 'POST';

      const requestBody = isEdit
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
        throw new Error(data.message || `${isEdit ? '역할 수정' : '역할 생성'}에 실패했습니다.`);
      }

      toast.success(`역할이 ${isEdit ? '수정' : '생성'}되었습니다.`);
      setEditingUserRole(null);
      fetchUserRoles();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || `${editingUserRole ? '역할 수정' : '역할 생성'}에 실패했습니다.`);
      } else {
        toast.error(`${editingUserRole ? '역할 수정' : '역할 생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEnabled = async (userRole: UserRole, enabled: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/user-roles/${userRole.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleNm: userRole.roleNm,
          roleDesc: userRole.roleDesc,
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
      fetchUserRoles();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '역할 상태 변경에 실패했습니다.');
      } else {
        toast.error('역할 상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
      // 실패 시 원래 상태로 복구
      fetchUserRoles();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">관리자 권한 관리</h1>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">사용자 역할을 생성, 수정, 삭제할 수 있습니다.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <UserRoleList
            userRoles={userRoles}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleEnabled={handleToggleEnabled}
          />

          {editingUserRole !== null && (
            <UserRoleForm
              initialData={editingUserRole}
              onSubmit={handleSubmit}
              onCancel={() => setEditingUserRole(null)}
              isLoading={isSubmitting}
            />
          )}
        </div>

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="역할 삭제"
          message={`정말로 "${deleteDialog.userRole?.roleNm}" 역할을 삭제하시겠습니까?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteDialog({ isOpen: false, userRole: null })}
        />
      </div>
    </AdminLayout>
  );
}

export default function UserRolePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserRolePageContent />
    </Suspense>
  );
}


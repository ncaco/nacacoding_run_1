'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserList from '@/components/admin/users/UserList';
import UserForm from '@/components/admin/users/UserForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '@/app/_lib/utils/auth';
import { getApiUrl } from '@/app/_lib/api/client';

interface Admin {
  id: string;
  username: string;
  role: 'USER' | 'MEMBER';
  name?: string;
  email?: string;
  avatarUrl?: string;
  userRoleId?: string;
}

interface UserRole {
  id: string;
  roleCd: string;
  roleNm: string;
  roleDesc?: string;
  enabled?: boolean;
}

function AdminsPageContent() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; admin: Admin | null }>({
    isOpen: false,
    admin: null,
  });
  const [userRoleOptions, setUserRoleOptions] = useState<Array<{ value: string; label: string }>>([]);

  // 관리자 목록 조회
  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/users'), {
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
        throw new Error(data.message || '관리자 목록 조회에 실패했습니다.');
      }

      interface AdminResponse {
        id: string;
        username: string;
        name?: string;
        email?: string;
        avatarUrl?: string;
        userRoleId?: string;
      }

      const adminsList: Admin[] = (data.data || []).map((admin: AdminResponse) => ({
        id: admin.id,
        username: admin.username,
        role: 'USER' as const,
        name: admin.name,
        email: admin.email,
        avatarUrl: admin.avatarUrl,
        userRoleId: admin.userRoleId,
      }));

      setAdmins(adminsList);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '관리자 목록 조회에 실패했습니다.');
      } else {
        toast.error('관리자 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // USER_ROLE 목록 조회
  const fetchUserRoleOptions = async () => {
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

      const userRoles: UserRole[] = data.data || [];
      // 활성화된 역할만 옵션으로 변환
      const options = userRoles
        .filter((role) => role.enabled !== false)
        .map((role) => ({
          value: role.id,
          label: `${role.roleNm} (${role.roleCd})`,
        }));
      setUserRoleOptions(options);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '역할 목록 조회에 실패했습니다.');
      } else {
        toast.error('역할 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
      setUserRoleOptions([]);
    }
  };

  useEffect(() => {
    fetchUserRoleOptions();
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setEditingAdmin({} as Admin);
  };

  const handleEdit = (user: Admin) => {
    if (!user.id) {
      toast.error('관리자 ID가 없습니다.');
      return;
    }
    setEditingAdmin(user);
  };

  const handleDelete = (user: Admin) => {
    setDeleteDialog({ isOpen: true, admin: user });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.admin) return;

    const admin = deleteDialog.admin;
    setDeleteDialog({ isOpen: false, admin: null });
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/users/${admin.id}`), {
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
        throw new Error(data.message || '관리자 삭제에 실패했습니다.');
      }

      toast.success('관리자가 성공적으로 삭제되었습니다.');
      fetchAdmins();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '관리자 삭제에 실패했습니다.');
      } else {
        toast.error('관리자 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  interface AdminFormData {
    username: string;
    password?: string;
    name?: string;
    email?: string;
    userRoleId?: string;
  }

  const handleSubmit = async (formData: AdminFormData) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 수정 모드 확인
      const isEditMode = !!(editingAdmin && editingAdmin.id && editingAdmin.id.trim() !== '');
      
      if (isEditMode && !editingAdmin?.id) {
        throw new Error('관리자 ID가 없습니다. 다시 시도해주세요.');
      }

      if (isEditMode) {
        // 수정
        const response = await fetchWithTokenRefresh(getApiUrl(`/users/${editingAdmin.id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name || '',
            email: formData.email || '',
            userRoleId: formData.userRoleId || '',
          }),
        });

        if (response.status === 401) {
          logout(router);
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || '관리자 수정에 실패했습니다.');
        }

        toast.success('관리자가 성공적으로 수정되었습니다.');
      } else {
        // 생성
        const response = await fetchWithTokenRefresh(getApiUrl('/users'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            role: 'USER',
            name: formData.name || '',
            email: formData.email || '',
            userRoleId: formData.userRoleId || '',
          }),
        });

        if (response.status === 401) {
          logout(router);
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || '관리자 생성에 실패했습니다.');
        }

        toast.success('관리자가 성공적으로 생성되었습니다.');
      }

      setTimeout(() => {
        setEditingAdmin(null);
        fetchAdmins();
      }, 1500);
    } catch (error) {
      const isEditMode = editingAdmin && editingAdmin.id;
      if (error instanceof Error) {
        toast.error(error.message || `관리자 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`관리자 ${isEditMode ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {editingAdmin ? (
          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingAdmin(null);
            }}
            initialData={editingAdmin.id ? {
              id: editingAdmin.id,
              username: editingAdmin.username,
              role: 'USER',
              name: editingAdmin.name,
              email: editingAdmin.email,
              userRoleId: editingAdmin.userRoleId,
            } : undefined}
            isLoading={isSubmitting}
            userRoleOptions={userRoleOptions}
            isAdminPage={true}
          />
        ) : (
          <UserList
            users={admins}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdminPage={true}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, admin: null })}
        onConfirm={handleConfirmDelete}
        title="관리자 삭제"
        message={`정말로 "${deleteDialog.admin?.name || deleteDialog.admin?.username}" 관리자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </>
  );
}

export default function AdminsPage() {
  return (
    <Suspense fallback={
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
    }>
      <AdminsPageContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserRoleList from '@/components/admin/user-roles/UserRoleList';
import UserRoleForm from '@/components/admin/user-roles/UserRoleForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '@/app/_lib/utils/auth';
import { getApiUrl } from '@/app/_lib/api/client';

interface UserRole {
  id: string;
  roleCd: string;
  roleNm: string;
  roleDesc?: string;
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
  const [roleCdOptions, setRoleCdOptions] = useState<Array<{ value: string; label: string }>>([]);

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

  // 공통코드에서 권한역할코드 옵션 조회 (P002의 하위코드)
  const fetchRoleCdOptions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl('/cmn-cd'), {
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
      // P002 찾기
      const p002 = cmnCds.find((cd) => cd.cd === 'P002');
      
      if (p002 && p002.children) {
        // P002의 하위코드들을 옵션으로 변환
        const options = p002.children
          .filter((child) => child.enabled !== false) // 활성화된 것만
          .map((child) => ({
            value: child.cd, // C001, C002, C003
            label: `${child.name} (${child.cd})`, // ADMIN (C001), MANAGER (C002), OPERATOR (C003)
          }));
        setRoleCdOptions(options);
      } else {
        // P002가 없거나 하위코드가 없는 경우 빈 배열
        setRoleCdOptions([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '권한역할코드 옵션 조회에 실패했습니다.');
      } else {
        toast.error('권한역할코드 옵션 조회에 실패했습니다. 다시 시도해주세요.');
      }
      setRoleCdOptions([]);
    }
  };

  useEffect(() => {
    fetchRoleCdOptions();
    fetchUserRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setEditingUserRole({} as UserRole);
  };

  const handleEdit = (userRole: UserRole) => {
    if (!userRole.id) {
      toast.error('역할 ID가 없습니다.');
      return;
    }
    setEditingUserRole(userRole);
  };

  const handleDelete = (userRole: UserRole) => {
    setDeleteDialog({ isOpen: true, userRole });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.userRole) return;

    const userRole = deleteDialog.userRole;
    setDeleteDialog({ isOpen: false, userRole: null });
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/user-roles/${userRole.id}`), {
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
      fetchUserRoles();
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

  interface UserRoleFormData {
    roleCd: string;
    roleNm: string;
    roleDesc?: string;
    enabled?: boolean;
  }

  const handleSubmit = async (formData: UserRoleFormData) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 수정 모드 확인: editingUserRole가 있고 id가 있어야 함
      const isEditMode = !!(editingUserRole && editingUserRole.id && editingUserRole.id.trim() !== '');
      
      // 수정 모드일 때는 반드시 id가 있어야 함
      if (isEditMode && !editingUserRole?.id) {
        throw new Error('역할 ID가 없습니다. 다시 시도해주세요.');
      }
      
      const url = isEditMode
        ? getApiUrl(`/user-roles/${editingUserRole!.id}`)
        : getApiUrl('/user-roles');
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
        setEditingUserRole(null);
        fetchUserRoles();
      }, 1500);
    } catch (error) {
      const isEditMode = editingUserRole && editingUserRole.id;
      if (error instanceof Error) {
        toast.error(error.message || `역할 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`역할 ${isEditMode ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
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
    <>
      <div className="space-y-3">
        {editingUserRole ? (
          <UserRoleForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingUserRole(null);
            }}
            initialData={editingUserRole.id ? {
              id: editingUserRole.id,
              roleCd: editingUserRole.roleCd,
              roleNm: editingUserRole.roleNm,
              roleDesc: editingUserRole.roleDesc,
              enabled: editingUserRole.enabled,
            } : undefined}
            isLoading={isSubmitting}
            roleCdOptions={roleCdOptions}
          />
        ) : (
          <UserRoleList
            userRoles={userRoles}
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
        onClose={() => setDeleteDialog({ isOpen: false, userRole: null })}
        onConfirm={handleConfirmDelete}
        title="역할 삭제"
        message={`정말로 "${deleteDialog.userRole?.roleNm}" 역할을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </>
  );
}

export default function UserRolePage() {
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
      <UserRolePageContent />
    </Suspense>
  );
}

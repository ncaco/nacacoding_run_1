'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '../../components/admin/AdminLayout';
import UserList from '../../components/admin/users/UserList';
import UserForm from '../../components/admin/users/UserForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

interface User {
  id: string;
  username: string;
  role: 'MEMBER';
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

function UsersPageContent() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });

  // 사용자 목록 조회 (사용자만)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 사용자(MEMBER) 목록만 조회
      const response = await fetchWithTokenRefresh(getApiUrl('/members'), {
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
        throw new Error(data.message || '사용자 목록 조회에 실패했습니다.');
      }

      // 사용자(MEMBER)만 매핑
      const members: User[] = (data.data || []).map((member: any) => ({
        id: member.id,
        username: member.username,
        role: 'MEMBER' as const,
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        avatarUrl: member.avatarUrl,
      }));

      setUsers(members);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '사용자 목록 조회에 실패했습니다.');
      } else {
        toast.error('사용자 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser({} as User);
  };

  const handleEdit = (user: User) => {
    if (!user.id) {
      toast.error('사용자 ID가 없습니다.');
      return;
    }
    setEditingUser(user);
  };

  const handleDelete = (user: User) => {
    setDeleteDialog({ isOpen: true, user });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.user) return;

    const user = deleteDialog.user;
    setDeleteDialog({ isOpen: false, user: null });
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 사용자(MEMBER) 삭제
      const response = await fetchWithTokenRefresh(getApiUrl(`/members/${user.id}`), {
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
        throw new Error(data.message || '사용자 삭제에 실패했습니다.');
      }

      toast.success('사용자가 성공적으로 삭제되었습니다.');
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '사용자 삭제에 실패했습니다.');
      } else {
        toast.error('사용자 삭제에 실패했습니다. 다시 시도해주세요.');
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

      // 수정 모드 확인
      const isEditMode = !!(editingUser && editingUser.id && editingUser.id.trim() !== '');
      
      if (isEditMode && !editingUser?.id) {
        throw new Error('사용자 ID가 없습니다. 다시 시도해주세요.');
      }

      // 사용자(MEMBER)만 처리
      if (isEditMode) {
        // 수정
        const response = await fetchWithTokenRefresh(getApiUrl(`/members/${editingUser.id}`), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name || '',
            email: formData.email || '',
            phoneNumber: formData.phoneNumber || '',
          }),
        });

        if (response.status === 401) {
          logout(router);
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || '사용자 수정에 실패했습니다.');
        }

        toast.success('사용자가 성공적으로 수정되었습니다.');
      } else {
        // 생성 - 사용자(MEMBER)만 생성
        const response = await fetchWithTokenRefresh(getApiUrl('/members'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            name: formData.name || '',
            email: formData.email || '',
            phoneNumber: formData.phoneNumber || '',
          }),
        });

        if (response.status === 401) {
          logout(router);
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || '사용자 생성에 실패했습니다.');
        }

        toast.success('사용자가 성공적으로 생성되었습니다.');
      }

      setTimeout(() => {
        setEditingUser(null);
        fetchUsers();
      }, 1500);
    } catch (error) {
      const isEditMode = editingUser && editingUser.id;
      if (error instanceof Error) {
        toast.error(error.message || `사용자 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`사용자 ${isEditMode ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-3">
        {editingUser ? (
          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingUser(null);
            }}
            initialData={editingUser.id ? {
              id: editingUser.id,
              username: editingUser.username,
              role: 'MEMBER',
              name: editingUser.name,
              email: editingUser.email,
              phoneNumber: editingUser.phoneNumber,
            } : undefined}
            isLoading={isSubmitting}
          />
        ) : (
          <UserList
            users={users}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, user: null })}
        onConfirm={handleConfirmDelete}
        title="사용자 삭제"
        message={`정말로 "${deleteDialog.user?.name || deleteDialog.user?.username}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

export default function UsersPage() {
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
      <UsersPageContent />
    </Suspense>
  );
}

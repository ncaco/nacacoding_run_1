'use client';

import { useState, Suspense } from 'react';
import UserList from '../../components/admin/users/UserList';
import UserForm from '../../components/admin/users/UserForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useUsers } from '../../(admin)/_hooks/useUsers';
import type { User, UserFormData } from '../../_types';

function UsersPageContent() {
  const { users, isLoading, isSubmitting, createUser, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });

  const handleAdd = () => {
    setEditingUser({} as User);
  };

  const handleEdit = (user: User) => {
    if (!user.id) {
      return;
    }
    setEditingUser(user);
  };

  const handleDelete = (user: User) => {
    setDeleteDialog({ isOpen: true, user });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.user?.id) return;

    const user = deleteDialog.user;
    setDeleteDialog({ isOpen: false, user: null });
    
    const success = await deleteUser(user.id);
    if (success) {
      setEditingUser(null);
    }
  };

  const handleSubmit = async (formData: UserFormData) => {
    const isEditMode = !!(editingUser && editingUser.id && editingUser.id.trim() !== '');
    
    if (isEditMode && !editingUser?.id) {
      return;
    }

    let success = false;
    if (isEditMode) {
      success = await updateUser(editingUser!.id, formData);
    } else {
      success = await createUser(formData);
    }

    if (success) {
      setTimeout(() => {
        setEditingUser(null);
      }, 1500);
    }
  };

  return (
    <>
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
    </>
  );
}

export default function UsersPage() {
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
      <UsersPageContent />
    </Suspense>
  );
}

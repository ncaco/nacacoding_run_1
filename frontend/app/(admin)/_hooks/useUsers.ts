/**
 * 사용자 관리 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import * as usersService from '../_services/users.service';
import { logout } from '../../../_lib/utils/auth';
import type { User, UserFormData } from '../../../_types';

export function useUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 사용자 목록 조회
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await usersService.getMembers();
      setUsers(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '인증이 만료되었습니다.') {
          logout(router);
          return;
        }
        toast.error(error.message || '사용자 목록 조회에 실패했습니다.');
      } else {
        toast.error('사용자 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // 사용자 생성
  const createUser = useCallback(async (formData: UserFormData) => {
    setIsSubmitting(true);
    try {
      await usersService.createMember(formData);
      toast.success('사용자가 성공적으로 생성되었습니다.');
      await fetchUsers();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '인증이 만료되었습니다.') {
          logout(router);
          return false;
        }
        toast.error(error.message || '사용자 생성에 실패했습니다.');
      } else {
        toast.error('사용자 생성에 실패했습니다. 다시 시도해주세요.');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [router, fetchUsers]);

  // 사용자 수정
  const updateUser = useCallback(async (id: string, formData: UserFormData) => {
    setIsSubmitting(true);
    try {
      await usersService.updateMember(id, formData);
      toast.success('사용자가 성공적으로 수정되었습니다.');
      await fetchUsers();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '인증이 만료되었습니다.') {
          logout(router);
          return false;
        }
        toast.error(error.message || '사용자 수정에 실패했습니다.');
      } else {
        toast.error('사용자 수정에 실패했습니다. 다시 시도해주세요.');
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [router, fetchUsers]);

  // 사용자 삭제
  const deleteUser = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await usersService.deleteMember(id);
      toast.success('사용자가 성공적으로 삭제되었습니다.');
      await fetchUsers();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '인증이 만료되었습니다.') {
          logout(router);
          return false;
        }
        toast.error(error.message || '사용자 삭제에 실패했습니다.');
      } else {
        toast.error('사용자 삭제에 실패했습니다. 다시 시도해주세요.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [router, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    isSubmitting,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

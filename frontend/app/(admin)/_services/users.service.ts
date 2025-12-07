/**
 * 사용자(Member) 관리 API 서비스
 */

import { getApiUrl } from '@/_lib/api/client';
import { fetchWithTokenRefresh } from '@/_lib/utils/auth';
import type { ApiResponse, User, UserFormData } from '@/_types';

export interface MemberResponse {
  id: string;
  username: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

/**
 * 사용자 목록 조회
 */
export async function getMembers(): Promise<User[]> {
  const response = await fetchWithTokenRefresh(getApiUrl('/members'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    throw new Error('인증이 만료되었습니다.');
  }

  const data: ApiResponse<MemberResponse[]> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || '사용자 목록 조회에 실패했습니다.');
  }

  // 사용자(MEMBER)만 매핑
  return (data.data || []).map((member: MemberResponse) => ({
    id: member.id,
    username: member.username,
    role: 'MEMBER' as const,
    name: member.name,
    email: member.email,
    phoneNumber: member.phoneNumber,
    avatarUrl: member.avatarUrl,
  }));
}

/**
 * 사용자 생성
 */
export async function createMember(formData: UserFormData): Promise<void> {
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
    throw new Error('인증이 만료되었습니다.');
  }

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || '사용자 생성에 실패했습니다.');
  }
}

/**
 * 사용자 수정
 */
export async function updateMember(id: string, formData: UserFormData): Promise<void> {
  const response = await fetchWithTokenRefresh(getApiUrl(`/members/${id}`), {
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
    throw new Error('인증이 만료되었습니다.');
  }

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || '사용자 수정에 실패했습니다.');
  }
}

/**
 * 사용자 삭제
 */
export async function deleteMember(id: string): Promise<void> {
  const response = await fetchWithTokenRefresh(getApiUrl(`/members/${id}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    throw new Error('인증이 만료되었습니다.');
  }

  const data: ApiResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || '사용자 삭제에 실패했습니다.');
  }
}

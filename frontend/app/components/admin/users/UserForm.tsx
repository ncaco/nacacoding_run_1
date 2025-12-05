'use client';

import { useState, useEffect } from 'react';
import FormField from '../FormField';
import FormActions from '../FormActions';

interface UserFormData {
  username: string;
  password?: string;
  role: 'MEMBER' | 'USER';
  name?: string;
  email?: string;
  phoneNumber?: string;
  userRoleId?: string;
}

interface UserFormProps {
  onSubmit?: (data: UserFormData) => void;
  onCancel?: () => void;
  initialData?: {
    id?: string;
    username?: string;
    password?: string;
    role?: 'MEMBER' | 'USER';
    name?: string;
    email?: string;
    phoneNumber?: string;
    userRoleId?: string;
  };
  isLoading?: boolean;
  userRoleOptions?: Array<{ value: string; label: string }>;
  isAdminPage?: boolean;
}

export default function UserForm({ onSubmit, onCancel, initialData, isLoading = false, userRoleOptions = [], isAdminPage = false }: UserFormProps) {
  const isEditMode = !!(initialData?.id);
  
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    password: initialData?.password || '',
    role: initialData?.role || 'MEMBER',
    name: initialData?.name || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    userRoleId: initialData?.userRoleId || '',
  });

  // initialData가 변경되면 formData 업데이트
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        username: initialData.username || '',
        password: initialData.password || '',
        role: initialData.role || 'MEMBER',
        name: initialData.name || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        userRoleId: initialData.userRoleId || '',
      });
    } else {
      // initialData가 없으면 (새로 생성하는 경우) 초기화
      setFormData({
        username: '',
        password: '',
        role: 'MEMBER',
        name: '',
        email: '',
        phoneNumber: '',
        userRoleId: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col bg-white dark:bg-slate-900 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          <svg className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {isEditMode ? (isAdminPage ? '관리자 수정' : '사용자 수정') : (isAdminPage ? '새 관리자 생성' : '새 사용자 생성')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            {isEditMode ? (isAdminPage ? '관리자 정보를 수정합니다' : '사용자 정보를 수정합니다') : (isAdminPage ? '새로운 관리자를 생성합니다' : '새로운 사용자를 생성합니다')}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white p-4 dark:bg-slate-900">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <FormField
            label="사용자명 (로그인 ID)"
            name="username"
            type="text"
            required
            placeholder="사용자명을 입력하세요"
            value={formData.username}
            onChange={(value) => setFormData({ ...formData, username: String(value) })}
            disabled={isEditMode}
            helperText={isEditMode ? '사용자명은 변경할 수 없습니다.' : '로그인에 사용할 사용자명을 입력하세요.'}
          />

          {!isEditMode && (
            <FormField
              label="비밀번호"
              name="password"
              type="password"
              required
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: String(value) })}
              helperText="비밀번호는 암호화되어 저장됩니다."
            />
          )}

          {isAdminPage ? (
            <FormField
              label="역할"
              name="userRoleId"
              type="select"
              required={!isEditMode}
              value={formData.userRoleId}
              onChange={(value) => setFormData({ ...formData, userRoleId: String(value) })}
              options={[
                { value: '', label: '선택하세요' },
                ...userRoleOptions,
              ]}
              helperText="USER_ROLE 테이블에서 역할을 선택합니다."
            />
          ) : (
            <FormField
              label="역할"
              name="role"
              type="select"
              required
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: String(value) as 'MEMBER' | 'USER' })}
              options={[
                { value: 'MEMBER', label: '사용자 (MEMBER)' },
                { value: 'USER', label: '관리자 (USER)' },
              ]}
              helperText="MEMBER: 일반 사용자, USER: 관리자"
            />
          )}

          <FormField
            label="이름"
            name="name"
            type="text"
            placeholder="이름을 입력하세요 (선택사항)"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: String(value) })}
          />

          <FormField
            label="이메일"
            name="email"
            type="email"
            placeholder="이메일 주소를 입력하세요 (선택사항)"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: String(value) })}
            helperText="이메일 형식으로 입력하세요."
          />

          <FormField
            label="연락처(전화번호)"
            name="phoneNumber"
            type="text"
            placeholder="연락처(전화번호)를 입력하세요 (선택사항)"
            value={formData.phoneNumber}
            onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
          />

          <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
            <FormActions
              onCancel={onCancel}
              submitLabel={isEditMode ? '수정' : '생성'}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

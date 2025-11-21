'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '../../components/admin/AdminLayout';
import CmnCdList from '../../components/admin/cmn-cd/CmnCdList';
import CmnCdForm from '../../components/admin/cmn-cd/CmnCdForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { fetchWithTokenRefresh, logout } from '../../utils/auth';
import { getApiUrl } from '../../utils/api';

interface CmnCd {
  id: string;
  cd: string;
  name: string;
  description?: string;
  enabled?: boolean;
  parentCd?: string;
  children?: CmnCd[];
}

function CmnCdPageContent() {
  const router = useRouter();
  const [cmnCds, setCmnCds] = useState<CmnCd[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCmnCd, setEditingCmnCd] = useState<CmnCd | null>(null);
  const [selectedParentCdCode, setSelectedParentCdCode] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; cmnCd: CmnCd | null }>({
    isOpen: false,
    cmnCd: null,
  });

  // 공통코드 목록 조회
  const fetchCmnCds = async () => {
    setIsLoading(true);
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
        throw new Error(data.message || '공통코드 목록 조회에 실패했습니다.');
      }

      setCmnCds(data.data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '공통코드 목록 조회에 실패했습니다.');
      } else {
        toast.error('공통코드 목록 조회에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCmnCds();
  }, []);

  const handleAdd = () => {
    setEditingCmnCd(null);
  };

  // P 코드 중 최대값 찾기
  const getNextParentCode = (): string => {
    const parentCodes = cmnCds.filter((cd) => cd.cd.startsWith('P')).map((cd) => cd.cd);
    if (parentCodes.length === 0) {
      return 'P001';
    }
    const numbers = parentCodes
      .map((cd) => parseInt(cd.substring(1)))
      .filter((num) => !isNaN(num))
      .sort((a, b) => b - a);
    const maxNum = numbers.length > 0 ? numbers[0] : 0;
    const nextNum = maxNum + 1;
    return `P${nextNum.toString().padStart(3, '0')}`;
  };

  // C 코드 중 최대값 찾기 (선택된 상위코드의 하위코드만 확인)
  const getNextChildCode = (parentCd: string): string => {
    // 선택된 상위코드의 하위코드만 확인
    const parent = cmnCds.find((cd) => cd.cd === parentCd);
    if (!parent || !parent.children || parent.children.length === 0) {
      return 'C001';
    }
    // 해당 상위코드(parentCd)의 하위코드만 필터링
    const childCodes = parent.children
      .filter((child) => child.parentCd === parentCd)
      .map((cd) => cd.cd);
    const numbers = childCodes
      .map((cd) => parseInt(cd.substring(1)))
      .filter((num) => !isNaN(num))
      .sort((a, b) => b - a);
    const maxNum = numbers.length > 0 ? numbers[0] : 0;
    const nextNum = maxNum + 1;
    return `C${nextNum.toString().padStart(3, '0')}`;
  };

  // 상위코드 이름 생성 (신규상위코드 1, 2, 3...)
  const getNextParentName = (): string => {
    const parentCodes = cmnCds.filter((cd) => cd.cd.startsWith('P'));
    if (parentCodes.length === 0) {
      return '신규상위코드 1';
    }
    const parentNames = parentCodes
      .map((cd) => cd.name)
      .filter((name) => name.startsWith('신규상위코드'))
      .map((name) => {
        const match = name.match(/신규상위코드\s*(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => !isNaN(num))
      .sort((a, b) => b - a);
    const maxNum = parentNames.length > 0 ? parentNames[0] : 0;
    return `신규상위코드 ${maxNum + 1}`;
  };

  // 하위코드 이름 생성 (신규하위코드 1, 2, 3...)
  const getNextChildName = (parentCd: string): string => {
    const parent = cmnCds.find((cd) => cd.cd === parentCd);
    if (!parent || !parent.children || parent.children.length === 0) {
      return '신규하위코드 1';
    }
    const childNames = parent.children
      .map((cd) => cd.name)
      .filter((name) => name.startsWith('신규하위코드'))
      .map((name) => {
        const match = name.match(/신규하위코드\s*(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => !isNaN(num))
      .sort((a, b) => b - a);
    const maxNum = childNames.length > 0 ? childNames[0] : 0;
    return `신규하위코드 ${maxNum + 1}`;
  };

  const handleAddParent = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const nextCode = getNextParentCode();
      const nextName = getNextParentName();
      const requestBody = {
        cd: nextCode,
        name: nextName,
        description: '',
        enabled: true,
        parentCd: null,
      };

      const response = await fetchWithTokenRefresh(getApiUrl('/cmn-cd'), {
        method: 'POST',
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
        throw new Error(data.message || '상위코드 생성에 실패했습니다.');
      }

      toast.success('상위코드가 성공적으로 생성되었습니다.');
      
      // 신규 추가한 상위코드로 포커스 이동
      setSelectedParentCdCode(nextCode);
      await fetchCmnCds();
      
      // 목록 갱신 후 선택 해제 (한 번만 선택되도록)
      setTimeout(() => {
        setSelectedParentCdCode(null);
      }, 100);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '상위코드 생성에 실패했습니다.');
      } else {
        toast.error('상위코드 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddChild = async (parentCd: CmnCd) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const nextCode = getNextChildCode(parentCd.cd);
      const nextName = getNextChildName(parentCd.cd);
      const requestBody = {
        cd: nextCode,
        name: nextName,
        description: '',
        enabled: true,
        parentCd: parentCd.cd,
      };

      const response = await fetchWithTokenRefresh(getApiUrl('/cmn-cd'), {
        method: 'POST',
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
        throw new Error(data.message || '하위코드 생성에 실패했습니다.');
      }

      toast.success('하위코드가 성공적으로 생성되었습니다.');
      
      // 목록 재조회하여 하위코드 목록 갱신
      await fetchCmnCds();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '하위코드 생성에 실패했습니다.');
      } else {
        toast.error('하위코드 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cmnCd: CmnCd) => {
    setEditingCmnCd(cmnCd);
  };

  const handleInlineEdit = async (cmnCd: CmnCd) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/cmn-cd/${cmnCd.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cmnCd.name,
          description: cmnCd.description || '',
          enabled: cmnCd.enabled ?? true,
        }),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '공통코드 수정에 실패했습니다.');
      }

      toast.success('공통코드 이름이 수정되었습니다.');
      fetchCmnCds();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '공통코드 수정에 실패했습니다.');
      } else {
        toast.error('공통코드 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (cmnCd: CmnCd) => {
    setDeleteDialog({ isOpen: true, cmnCd });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.cmnCd) return;

    const cmnCd = deleteDialog.cmnCd;
    setDeleteDialog({ isOpen: false, cmnCd: null });
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await fetchWithTokenRefresh(getApiUrl(`/cmn-cd/${cmnCd.id}`), {
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
        throw new Error(data.message || '공통코드 삭제에 실패했습니다.');
      }

      toast.success('공통코드가 성공적으로 삭제되었습니다.');
      fetchCmnCds();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '공통코드 삭제에 실패했습니다.');
      } else {
        toast.error('공통코드 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 트리 구조에서 특정 ID의 공통코드를 찾아서 업데이트하는 헬퍼 함수
  const updateCmnCdInTree = (tree: CmnCd[], id: string, updates: Partial<CmnCd>): CmnCd[] => {
    return tree.map((item) => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateCmnCdInTree(item.children, id, updates),
        };
      }
      return item;
    });
  };

  const handleToggleEnabled = async (cmnCd: CmnCd, enabled: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      // 기존 데이터를 유지하면서 enabled만 업데이트
      const response = await fetchWithTokenRefresh(getApiUrl(`/cmn-cd/${cmnCd.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cmnCd.name,
          description: cmnCd.description || '',
          enabled: enabled,
        }),
      });

      if (response.status === 401) {
        logout(router);
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '상태 변경에 실패했습니다.');
      }

      // 로컬 상태 즉시 업데이트 (낙관적 업데이트)
      setCmnCds((prevCmnCds) => updateCmnCdInTree(prevCmnCds, cmnCd.id, { enabled }));
      toast.success(`공통코드가 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '상태 변경에 실패했습니다.');
      } else {
        toast.error('상태 변경에 실패했습니다. 다시 시도해주세요.');
      }
      // 에러 발생 시 목록 다시 조회하여 원래 상태로 복구
      fetchCmnCds();
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const url = editingCmnCd
        ? getApiUrl(`/cmn-cd/${editingCmnCd.id}`)
        : getApiUrl('/cmn-cd');
      const method = editingCmnCd ? 'PUT' : 'POST';

      const requestBody = editingCmnCd
        ? {
            name: formData.name,
            description: formData.description || '',
            enabled: formData.enabled ?? true,
          }
        : {
            cd: formData.cd,
            name: formData.name,
            description: formData.description || '',
            enabled: formData.enabled ?? true,
            parentCd: formData.parentCd || null,
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
        throw new Error(data.message || `${editingCmnCd ? '수정' : '생성'}에 실패했습니다.`);
      }

      toast.success(`공통코드가 성공적으로 ${editingCmnCd ? '수정' : '생성'}되었습니다.`);
      
      setTimeout(() => {
        setEditingCmnCd(null);
        fetchCmnCds();
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || `공통코드 ${editingCmnCd ? '수정' : '생성'}에 실패했습니다.`);
      } else {
        toast.error(`공통코드 ${editingCmnCd ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-3">
        {editingCmnCd ? (
          <CmnCdForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingCmnCd(null);
            }}
            initialData={{
              cd: editingCmnCd.cd,
              name: editingCmnCd.name,
              description: editingCmnCd.description,
              enabled: editingCmnCd.enabled,
              parentCd: editingCmnCd.parentCd,
            }}
            isLoading={isSubmitting}
            parentCmnCds={cmnCds}
          />
        ) : (
          <CmnCdList
            cmnCds={cmnCds}
            isLoading={isLoading}
            onAdd={handleAdd}
            onAddParent={handleAddParent}
            onAddChild={handleAddChild}
            onEdit={handleEdit}
            onInlineEdit={handleInlineEdit}
            onDelete={handleDelete}
            onToggleEnabled={handleToggleEnabled}
            selectedParentCdCode={selectedParentCdCode}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, cmnCd: null })}
        onConfirm={handleConfirmDelete}
        title="공통코드 삭제"
        message={`정말로 "${deleteDialog.cmnCd?.name}" 공통코드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        isLoading={isLoading}
      />
    </AdminLayout>
  );
}

export default function CmnCdPage() {
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
      <CmnCdPageContent />
    </Suspense>
  );
}


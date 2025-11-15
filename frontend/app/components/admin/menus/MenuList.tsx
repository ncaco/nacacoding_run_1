'use client';

import DataTable from '../DataTable';
import ListHeader from '../ListHeader';
import StatusBadge from '../StatusBadge';

interface Menu {
  id: string;
  name: string;
  url?: string;
  displayOrder: number;
  enabled: boolean;
}

interface MenuListProps {
  menus: Menu[];
  isLoading: boolean;
  onAdd?: () => void;
  onEdit?: (menu: Menu) => void;
  onDelete?: (menu: Menu) => void;
}

export default function MenuList({ menus, isLoading, onAdd, onEdit, onDelete }: MenuListProps) {
  const columns = [
    {
      key: 'name',
      label: '메뉴명',
    },
    {
      key: 'url',
      label: 'URL',
      render: (menu: Menu) => menu.url || '-',
    },
    {
      key: 'displayOrder',
      label: '순서',
    },
    {
      key: 'enabled',
      label: '상태',
      render: (menu: Menu) => <StatusBadge enabled={menu.enabled} />,
    },
  ];

  const mobileCardRender = (menu: Menu) => (
    <div key={menu.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{menu.name}</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">URL: {menu.url || '-'}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">순서: {menu.displayOrder}</p>
        </div>
        <StatusBadge enabled={menu.enabled} />
      </div>
      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(menu)}
              className="flex-1 rounded-lg border border-green-600 bg-white px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(menu)}
              className="flex-1 rounded-lg border border-red-600 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50">
      <ListHeader title="메뉴 목록" actionLabel="새 메뉴 추가" onAction={onAdd} />
      <div className="p-4 sm:p-6">
        <DataTable
          data={menus}
          columns={columns}
          isLoading={isLoading}
          emptyState={{
            icon: (
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ),
            message: '등록된 메뉴가 없습니다.',
          }}
          onEdit={onEdit}
          onDelete={onDelete}
          mobileCardRender={mobileCardRender}
        />
      </div>
    </div>
  );
}


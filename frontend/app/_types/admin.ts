// Admin 기능 전용 타입 정의

import type { Tab, PageHeaderProps, StatCardProps, EmptyStateProps, StatusBadgeProps, ActionButtonProps, FormFieldProps, FormActionsProps, TableColumn, DataTableProps } from '../components/admin/types';

// Admin 컴포넌트 타입 재export
export type {
  Tab,
  PageHeaderProps,
  StatCardProps,
  EmptyStateProps,
  StatusBadgeProps,
  ActionButtonProps,
  FormFieldProps,
  FormActionsProps,
  TableColumn,
  DataTableProps,
};

// Admin 사이드바 관련 타입
export interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: SubMenuItem[];
}

export interface AdminMenu {
  id: string;
  menuNm: string;
  menuPath: string;
  parentId?: string;
  siteId: string;
  iconId?: string;
  iconPath?: string;
  enabled: boolean;
  sortOrder?: number;
}

export interface AdminSite {
  id: string;
  siteNm: string;
  siteTypeCd: string;
  enabled: boolean;
}

export interface AdminIcon {
  id: string;
  iconNm: string;
  iconPath: string;
}

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface AdminHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
}

// 관리자 페이지 공통 타입 정의

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface PageHeaderProps {
  title: string;
  description: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

export interface StatusBadgeProps {
  enabled: boolean;
  enabledLabel?: string;
  disabledLabel?: string;
}

export interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  value?: string | number | boolean;
  onChange?: (value: string | number | boolean) => void;
  helperText?: string;
}

export interface FormActionsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  isLoading?: boolean;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  emptyState?: EmptyStateProps;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  mobileCardRender?: (item: T) => React.ReactNode;
}


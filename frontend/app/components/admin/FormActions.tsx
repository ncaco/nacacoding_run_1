'use client';

import { FormActionsProps } from './types';
import ActionButton from './ActionButton';

export default function FormActions({
  onCancel,
  onSubmit,
  cancelLabel = '취소',
  submitLabel = '제출',
  isLoading = false,
}: FormActionsProps) {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      {onCancel && (
        <button
          type="button"
          onClick={handleCancel}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-700 sm:w-auto"
        >
          {cancelLabel}
        </button>
      )}
      {onSubmit && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-600 dark:hover:bg-slate-500 sm:w-auto"
        >
          {isLoading ? '처리 중...' : submitLabel}
        </button>
      )}
    </div>
  );
}


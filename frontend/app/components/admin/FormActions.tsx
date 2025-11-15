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
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      {onCancel && (
        <ActionButton
          label={cancelLabel}
          onClick={onCancel}
          variant="secondary"
          fullWidth
        />
      )}
      {onSubmit && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-green-500 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
        >
          {isLoading ? '처리 중...' : submitLabel}
        </button>
      )}
    </div>
  );
}


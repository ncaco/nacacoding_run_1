'use client';

import type { StatusBadgeProps } from '@/_types/admin';

export default function StatusBadge({
  enabled,
  enabledLabel = '활성',
  disabledLabel = '비활성',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 text-xs font-semibold ${
        enabled
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      }`}
    >
      {enabled ? enabledLabel : disabledLabel}
    </span>
  );
}


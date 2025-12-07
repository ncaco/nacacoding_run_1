'use client';

import type { EmptyStateProps } from '../../_types/admin';

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <div className="mx-auto">{icon}</div>
      <p className="mt-2 text-xs">{message}</p>
    </div>
  );
}


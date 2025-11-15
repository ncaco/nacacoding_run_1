'use client';

import { EmptyStateProps } from './types';

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="text-center text-gray-500 dark:text-gray-400">
      <div className="mx-auto h-12 w-12 text-gray-400">{icon}</div>
      <p className="mt-4">{message}</p>
    </div>
  );
}


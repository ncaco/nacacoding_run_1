'use client';

import type { PageHeaderProps } from '../../_types/admin';

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">{title}</h1>
      {description && (
        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}


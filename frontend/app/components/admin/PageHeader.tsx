'use client';

import { PageHeaderProps } from './types';

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:mt-2 sm:text-base">{description}</p>
    </div>
  );
}


'use client';

import { StatCardProps } from './types';

export default function StatCard({
  title,
  value,
  icon,
  iconBgColor = 'bg-green-100',
  iconColor = 'text-green-600',
}: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:mt-2 sm:text-3xl">{value}</p>
        </div>
        <div className={`rounded-lg ${iconBgColor} p-2 sm:p-3`}>
          <div className={`h-5 w-5 ${iconColor} sm:h-6 sm:w-6`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}


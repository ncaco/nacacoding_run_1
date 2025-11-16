'use client';

import ActionButton from './ActionButton';

interface ListHeaderProps {
  title: string;
  actionLabel: string;
  onAction?: () => void;
}

export default function ListHeader({ title, actionLabel, onAction }: ListHeaderProps) {
  return (
    <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-800 sm:px-6 sm:py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base lg:text-lg">{title}</h3>
        <ActionButton label={actionLabel} onClick={onAction} fullWidth />
      </div>
    </div>
  );
}


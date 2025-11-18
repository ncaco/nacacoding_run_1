'use client';

import ActionButton from './ActionButton';

interface ListHeaderProps {
  title: string;
  actionLabel: string;
  onAction?: () => void;
}

export default function ListHeader({ title, actionLabel, onAction }: ListHeaderProps) {
  return (
    <div className="border-b border-gray-200 px-2 py-1.5 dark:border-gray-800 sm:px-3 sm:py-2">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base lg:text-lg">{title}</h3>
        <ActionButton label={actionLabel} onClick={onAction} fullWidth />
      </div>
    </div>
  );
}


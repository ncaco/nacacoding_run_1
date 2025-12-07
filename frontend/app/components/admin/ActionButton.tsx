'use client';

import type { ActionButtonProps } from '@/_types/admin';

export default function ActionButton({
  label,
  onClick,
  variant = 'primary',
  fullWidth = false,
}: ActionButtonProps) {
  const baseClasses = 'rounded-lg px-4 py-2 text-sm font-medium transition-all';
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700',
    secondary:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    danger:
      'border border-red-600 bg-white text-red-600 hover:bg-red-50 dark:border-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20',
  };
  const widthClass = fullWidth ? 'w-full sm:w-auto' : '';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
    >
      {label}
    </button>
  );
}


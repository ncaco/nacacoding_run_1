'use client';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ToggleSwitch({
  enabled,
  onToggle,
  disabled = false,
  size = 'md',
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: 'h-4 w-7',
    md: 'h-5 w-9',
    lg: 'h-6 w-11',
  };

  const dotSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const translateClasses = {
    sm: enabled ? 'translate-x-3' : 'translate-x-0',
    md: enabled ? 'translate-x-4' : 'translate-x-0',
    lg: enabled ? 'translate-x-5' : 'translate-x-0',
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onToggle(!enabled)}
      className={`
        relative inline-flex ${sizeClasses[size]} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        ${enabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}
      `}
    >
      <span
        className={`
          ${translateClasses[size]} pointer-events-none inline-block ${dotSizeClasses[size]} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
        `}
      />
    </button>
  );
}


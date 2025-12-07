'use client';

import type { FormFieldProps } from '../../_types/admin';
import CustomSelect from './CustomSelect';

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  options,
  rows = 3,
  value,
  onChange,
  helperText,
}: FormFieldProps) {
  const baseInputClasses =
    'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650] dark:focus:ring-[#303650]';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (onChange) {
      if (type === 'checkbox') {
        onChange((e.target as HTMLInputElement).checked);
      } else {
        onChange(e.target.value);
      }
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          value={value as string}
          onChange={handleChange}
          className={baseInputClasses}
        />
      ) : type === 'select' ? (
        <CustomSelect
          value={value as string}
          onChange={(val) => onChange && onChange(val)}
          options={options || []}
          placeholder="선택하세요"
          isDisabled={disabled}
        />
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value as boolean}
            onChange={handleChange}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-[#1f2435] dark:bg-[#1a1e2c] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor={name} className="ml-2 block text-xs text-gray-900 dark:text-gray-300">
            {placeholder || label}
          </label>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={value as string | number}
          onChange={handleChange}
          className={`${baseInputClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      )}
      {helperText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}


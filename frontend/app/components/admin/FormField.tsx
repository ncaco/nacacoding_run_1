'use client';

import { FormFieldProps } from './types';

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  options,
  rows = 3,
  value,
  onChange,
}: FormFieldProps) {
  const baseInputClasses =
    'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white';

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
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
        <select
          id={name}
          name={name}
          required={required}
          value={value as string}
          onChange={handleChange}
          className={baseInputClasses}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value as boolean}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800"
          />
          <label htmlFor={name} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
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
          value={value as string | number}
          onChange={handleChange}
          className={baseInputClasses}
        />
      )}
    </div>
  );
}


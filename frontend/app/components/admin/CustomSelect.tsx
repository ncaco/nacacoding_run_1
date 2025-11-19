'use client';

import Select, { StylesConfig } from 'react-select';

interface CustomSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = '선택하세요',
  isDisabled = false,
  className = '',
}: CustomSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  const customStyles: StylesConfig<any, false> = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '32px',
      height: '32px',
      borderColor: state.isFocused
        ? 'rgb(156 163 175)' // gray-400
        : 'rgb(209 213 219)', // gray-300
      boxShadow: state.isFocused ? '0 0 0 1px rgb(156 163 175)' : 'none',
      '&:hover': {
        borderColor: 'rgb(156 163 175)', // gray-400
      },
      backgroundColor: 'white',
      fontSize: '0.75rem', // text-xs
      cursor: 'pointer',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '2px 8px',
      height: '32px',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '32px',
    }),
    indicatorSeparator: (provided: any) => ({
      display: 'none',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: '4px 8px',
      color: 'rgb(107 114 128)', // gray-500
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: '4px',
      borderRadius: '8px',
      border: '1px solid rgb(229 231 235)', // gray-200
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      zIndex: 50,
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '4px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '0.75rem', // text-xs
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? 'rgb(59 130 246)' // blue-500
        : state.isFocused
        ? 'rgb(243 244 246)' // gray-100
        : 'white',
      color: state.isSelected ? 'white' : 'rgb(17 24 39)', // gray-900
      '&:active': {
        backgroundColor: state.isSelected ? 'rgb(59 130 246)' : 'rgb(229 231 235)', // gray-200
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'rgb(156 163 175)', // gray-400
      fontSize: '0.75rem',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'rgb(17 24 39)', // gray-900
      fontSize: '0.75rem',
    }),
  };

  const darkStyles: StylesConfig<any, false> = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '32px',
      height: '32px',
      borderColor: state.isFocused
        ? 'rgb(48 54 80)' // #303650
        : 'rgb(31 36 53)', // #1f2435
      boxShadow: state.isFocused ? '0 0 0 1px rgb(48 54 80)' : 'none',
      '&:hover': {
        borderColor: 'rgb(48 54 80)', // #303650
      },
      backgroundColor: 'rgb(26 30 44)', // #1a1e2c
      fontSize: '0.75rem',
      cursor: 'pointer',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '2px 8px',
      height: '32px',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
      padding: '0px',
      color: 'white',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '32px',
    }),
    indicatorSeparator: (provided: any) => ({
      display: 'none',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: '4px 8px',
      color: 'rgb(156 163 175)', // gray-400
    }),
    menu: (provided: any) => ({
      ...provided,
      marginTop: '4px',
      borderRadius: '8px',
      border: '1px solid rgb(31 36 53)', // #1f2435
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
      backgroundColor: 'rgb(15 17 25)', // #0f1119
      zIndex: 50,
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '4px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '0.75rem',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? 'rgb(59 130 246)' // blue-500
        : state.isFocused
        ? 'rgb(26 30 44)' // #1a1e2c
        : 'rgb(15 17 25)', // #0f1119
      color: state.isSelected ? 'white' : 'rgb(209 213 219)', // gray-300
      '&:active': {
        backgroundColor: state.isSelected ? 'rgb(59 130 246)' : 'rgb(31 36 53)', // #1f2435
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'rgb(156 163 175)', // gray-400
      fontSize: '0.75rem',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white',
      fontSize: '0.75rem',
    }),
  };

  // 다크모드 감지
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const styles = isDark ? darkStyles : customStyles;

  return (
    <div className={className}>
      <Select
        value={selectedOption}
        onChange={(option) => onChange && option && onChange(option.value)}
        options={options}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isSearchable={false}
        styles={styles}
        classNamePrefix="react-select"
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
      />
    </div>
  );
}


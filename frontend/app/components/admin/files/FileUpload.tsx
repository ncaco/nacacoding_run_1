'use client';

import { useState } from 'react';
import FormActions from '../FormActions';

interface FileUploadProps {
  onSubmit?: (file: File) => void;
  onCancel?: () => void;
}

export default function FileUpload({ onSubmit, onCancel }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && onSubmit) {
      onSubmit(selectedFile);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">파일 업로드</h3>
      <form className="mt-4 space-y-4 sm:mt-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">파일 선택</label>
          <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-8 dark:border-gray-700 sm:px-6 sm:py-10">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-10 w-10 text-gray-400 sm:h-12 sm:w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:text-sm">
                <label className="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 dark:bg-gray-800 dark:text-green-400">
                  <span>파일 선택</span>
                  <input type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, PDF 최대 10MB</p>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-900 dark:text-white">선택된 파일: {selectedFile.name}</p>
              )}
            </div>
          </div>
        </div>
        <FormActions onCancel={onCancel} onSubmit={handleSubmit} submitLabel="업로드" />
      </form>
    </div>
  );
}


'use client';

export default function LoadingState({ message = '로딩 중...' }: { message?: string }) {
  return <div className="text-center text-gray-500 dark:text-gray-400">{message}</div>;
}


'use client';

import { useState } from 'react';

// 일반적으로 많이 사용하는 아이콘들의 SVG path 데이터
const commonIcons = [
  { name: '메뉴', iconId: 'menu', svgCode: 'M4 6h16M4 12h16M4 18h16' },
  { name: '홈', iconId: 'home', svgCode: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: '사용자', iconId: 'user', svgCode: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { name: '설정', iconId: 'settings', svgCode: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { name: '검색', iconId: 'search', svgCode: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { name: '추가', iconId: 'plus', svgCode: 'M12 4v16m8-8H4' },
  { name: '수정', iconId: 'edit', svgCode: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { name: '삭제', iconId: 'delete', svgCode: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
  { name: '닫기', iconId: 'close', svgCode: 'M6 18L18 6M6 6l12 12' },
  { name: '체크', iconId: 'check', svgCode: 'M5 13l4 4L19 7' },
  { name: '화살표 위', iconId: 'arrow-up', svgCode: 'M5 15l7-7 7 7' },
  { name: '화살표 아래', iconId: 'arrow-down', svgCode: 'M19 9l-7 7-7-7' },
  { name: '화살표 왼쪽', iconId: 'arrow-left', svgCode: 'M15 19l-7-7 7-7' },
  { name: '화살표 오른쪽', iconId: 'arrow-right', svgCode: 'M9 5l7 7-7 7' },
  { name: '파일', iconId: 'document', svgCode: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: '폴더', iconId: 'folder', svgCode: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  { name: '이미지', iconId: 'image', svgCode: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: '링크', iconId: 'link', svgCode: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { name: '다운로드', iconId: 'download', svgCode: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
  { name: '업로드', iconId: 'upload', svgCode: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
];

interface IconSelectorProps {
  value: string;
  onChange: (svgCode: string, iconId: string, iconName: string) => void;
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = commonIcons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.iconId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIcon = commonIcons.find((icon) => icon.svgCode === value);

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowSelector(!showSelector)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-[#1f2435] dark:bg-[#1a1e2c] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650] dark:focus:ring-[#303650] flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          {selectedIcon ? (
            <>
              <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={selectedIcon.svgCode} />
              </svg>
              <span>{selectedIcon.name}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">아이콘을 선택하세요</span>
          )}
        </span>
        <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showSelector && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSelector(false)}
          />
          <div className="relative z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-[#1f2435] dark:bg-[#1a1e2c]">
            <div className="border-b border-gray-200 p-2 dark:border-[#1f2435]">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="아이콘 검색..."
                  className="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-8 pr-2 text-xs text-gray-900 placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none dark:border-[#1f2435] dark:bg-[#0f1119] dark:text-white dark:placeholder-gray-500 dark:focus:border-[#303650] dark:focus:bg-[#1f2435]"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon.iconId}
                    type="button"
                    onClick={() => {
                      onChange(icon.svgCode, icon.iconId, icon.name);
                      setShowSelector(false);
                      setSearchTerm('');
                    }}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
                      value === icon.svgCode
                        ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-[#1f2435] dark:bg-[#0f1119] dark:hover:border-[#303650] dark:hover:bg-[#1a1e2c]'
                    }`}
                    title={icon.name}
                  >
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon.svgCode} />
                    </svg>
                    <span className="text-[9px] text-gray-600 dark:text-gray-400 truncate w-full text-center">
                      {icon.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


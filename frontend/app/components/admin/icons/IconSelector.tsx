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
  { name: '사이트', iconId: 'globe', svgCode: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { name: '서버', iconId: 'server', svgCode: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
  { name: '클라우드', iconId: 'cloud', svgCode: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
  { name: '데스크톱', iconId: 'computer-desktop', svgCode: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m-6 0V5a2 2 0 012-2h4a2 2 0 012 2v12.25M9 17.25h6' },
  { name: '모바일', iconId: 'device-phone-mobile', svgCode: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3' },
  { name: '윈도우', iconId: 'window', svgCode: 'M3 8h7m-7 0V6a2 2 0 012-2h14a2 2 0 012 2v2M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8h7m-7 0V6m7 2v10' },
  { name: '그리드', iconId: 'squares-2x2', svgCode: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { name: '브라우저', iconId: 'browser', svgCode: 'M3 8h18M3 8a2 2 0 100 4h18a2 2 0 100-4M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M9 4v4m6-4v4' },
  { name: '태그', iconId: 'tag', svgCode: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { name: '라벨', iconId: 'label', svgCode: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  { name: '목록', iconId: 'list-bullet', svgCode: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { name: '테이블', iconId: 'table-cells', svgCode: 'M3.375 4.5c-.621 0-1.125.504-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-9.75c0-.621-.504-1.125-1.125-1.125H3.375zM3.375 8.25h17.25M9 11.25v3.375m0 0h6m-6 0v-3.375m6 0v3.375m0 0h3.375c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H18v3.375z' },
  { name: '데이터베이스', iconId: 'circle-stack', svgCode: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125' },
  { name: '코드', iconId: 'code-bracket', svgCode: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
  { name: '카테고리', iconId: 'squares-plus', svgCode: 'M12 3v12m0 0v6m0-6h6m-6 0H6m12 0a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: '분류', iconId: 'rectangle-group', svgCode: 'M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.375 15.75c-.621 0-1.125.504-1.125 1.125v3.75c0 .621.504 1.125 1.125 1.125h6c.621 0 1.125-.504 1.125-1.125v-3.75a1.125 1.125 0 00-1.125-1.125h-6zM13.5 15.75v3.75c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125v-3.75a1.125 1.125 0 00-1.125-1.125h-5.25a1.125 1.125 0 00-1.125 1.125z' },
  { name: '트리', iconId: 'tree', svgCode: 'M12 3v18m-3-3h6M9 6h6m-6 6h6m-3-9v3m0 6v3m0 6v3' },
  { name: '계층', iconId: 'bars-3-bottom-left', svgCode: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
  { name: '정렬', iconId: 'bars-arrow-up', svgCode: 'M3 4.5h14.25M3 9h9.75m-9.75 3.75h9.75m-9.75 3.75h9.75M3 19.5h14.25M3 4.5l2.25 2.25M3 19.5l2.25-2.25m0 0l2.25 2.25M8.25 4.5l2.25 2.25m0 0l2.25-2.25M12.75 19.5l2.25-2.25m0 0l2.25 2.25m0 0l2.25-2.25m0 0l2.25 2.25' },
  { name: '아이콘', iconId: 'sparkles', svgCode: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z' },
  { name: '별', iconId: 'star', svgCode: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
  { name: '브러시', iconId: 'paint-brush', svgCode: 'M9.53 16.122a3 3 0 00-5.78 1.128 3 3 0 005.78-1.128zm2.94-3.94a3 3 0 00-5.78 1.128 3 3 0 005.78-1.128zm-2.94 3.94l2.94-3.94m6.88 5.66a3 3 0 01-5.78-1.128 3 3 0 015.78 1.128zm2.94-3.94a3 3 0 01-5.78-1.128 3 3 0 015.78 1.128zm-8.82 3.94l5.78-1.128m-5.78 1.128a3 3 0 105.78-1.128M12 2.25V4.5m5.834.166a1.5 1.5 0 010 2.25l-5.81 5.81a1.5 1.5 0 01-2.18 0l-5.81-5.81a1.5 1.5 0 010-2.25l5.81-5.81a1.5 1.5 0 012.18 0l5.81 5.81z' },
  { name: '색상', iconId: 'swatch', svgCode: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0113 18.75V4.5A2.25 2.25 0 0010.75 2.25h-4.5A2.25 2.25 0 004 4.5v14.25A3.75 3.75 0 016.75 21zm0 0h3.75m-3.75 0v-3.375M9.75 16.5v3.375m0 0h3.75m-3.75 0h-3.375' },
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


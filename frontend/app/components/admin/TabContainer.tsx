'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  queryParam?: string; // URL 쿼리 파라미터 이름 (기본값: 'tab')
}

export default function TabContainer({ tabs, defaultTab, queryParam = 'tab' }: TabContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // URL에서 탭 ID 가져오기
  const tabFromUrl = searchParams.get(queryParam);
  const initialTab = tabFromUrl && tabs.find(tab => tab.id === tabFromUrl) 
    ? tabFromUrl 
    : (defaultTab || tabs[0]?.id);
  
  const [activeTab, setActiveTab] = useState(initialTab);

  // URL 파라미터가 변경되면 탭 업데이트
  useEffect(() => {
    const tabFromUrl = searchParams.get(queryParam);
    if (tabFromUrl && tabs.find(tab => tab.id === tabFromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, queryParam, tabs]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // URL 쿼리 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString());
    params.set(queryParam, tabId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-4 overflow-x-auto sm:space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap border-b-2 px-2 py-3 text-xs font-medium transition-colors sm:px-1 sm:py-4 sm:text-sm ${
                  isActive
                    ? 'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">{activeTabContent}</div>
    </div>
  );
}


'use client';

import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function TabContainer({ tabs, defaultTab }: TabContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

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
                onClick={() => setActiveTab(tab.id)}
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


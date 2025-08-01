import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'line' | 'pills' | 'enclosed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  onTabChange,
  variant = 'line',
  size = 'md',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

  const handleTabClick = (tabId: string) => {
    const tab = items.find(item => item.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onTabChange?.(tabId);
    }
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };

  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    const baseClasses = `${sizes[size]} font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`;
    
    if (tab.disabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'line':
        return `${baseClasses} border-b-2 ${
          isActive
            ? 'text-blue-600 border-blue-600'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
        }`;
      case 'pills':
        return `${baseClasses} rounded-lg ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`;
      case 'enclosed':
        return `${baseClasses} border border-b-0 rounded-t-lg ${
          isActive
            ? 'bg-white text-blue-600 border-gray-300'
            : 'bg-gray-50 text-gray-500 border-gray-300 hover:text-gray-700'
        }`;
      default:
        return baseClasses;
    }
  };

  const activeTabContent = items.find(item => item.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className={`flex ${variant === 'line' ? 'border-b border-gray-200' : 'space-x-1'}`}>
        {items.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={getTabClasses(tab, isActive)}
              disabled={tab.disabled}
              role="tab"
              aria-selected={isActive}
            >
              <span className="flex items-center space-x-2">
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4" role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;

import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'react-router-dom';

interface Tab {
  id: string;
  label: string;
  description: string;
  isPlaceholder?: boolean;
}

interface HeaderProps {
  onMenuClick?: () => void;
  children?: React.ReactNode;
  showProductTabs?: boolean; // Flag để hiển thị product tabs
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  children, 
  showProductTabs = false 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active tab from URL params, default to 'all-products'
  const activeTab = searchParams.get('tab') || 'all-products';

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const PRODUCT_TABS: Tab[] = [
    { id: 'all-products', label: '📦 All Products', description: 'Quản lý tất cả sản phẩm' },
    { id: 'analytics', label: '📊 Dashboard', description: 'Báo cáo và phân tích' },
    { id: 'categories', label: '📋 Categories', description: 'Quản lý danh mục' },
    { id: 'stock', label: '📦 Stock', description: 'Quản lý tồn kho' },
    { id: 'pricing', label: '💰 Pricing', description: 'Quản lý giá cả' },
    { id: 'expiry', label: '⏰ Expiry', description: 'Quản lý hạn sử dụng' },
    { id: 'settings', label: '⚙️ Settings', description: 'Cài đặt hệ thống' }
  ];

  const validTabIds = PRODUCT_TABS.map(tab => tab.id);
  const currentTab = validTabIds.includes(activeTab) ? activeTab : 'all-products';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-10">
      <div className="px-6">
        <div className="flex h-16 justify-between items-center">
          {/* Left side - Menu button for mobile */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Center content - Product tabs or custom children */}
          <div className="flex-1 flex justify-center">
            {showProductTabs ? (
              /* Product Tab Navigation */
              <div className="flex-1 max-w-6xl hidden lg:block">
                <div className="flex justify-center">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {PRODUCT_TABS.map((tab) => {
                      const isActive = currentTab === tab.id;
                      const isPlaceholder = tab.isPlaceholder;
                      
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`
                            group relative overflow-hidden bg-transparent py-2 px-3 text-sm font-medium hover:text-gray-700 focus:z-10 whitespace-nowrap
                            ${isActive 
                              ? 'text-blue-600 border-b-2 border-blue-600' 
                              : 'text-gray-500 border-b-2 border-transparent hover:border-gray-300'
                            }
                            ${isPlaceholder ? 'opacity-75' : ''}
                          `}
                          disabled={false}
                        >
                          <span className="flex items-center space-x-2">
                            <span>{tab.label}</span>
                            {isPlaceholder && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                Soon
                              </span>
                            )}
                          </span>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            {tab.description}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Right side - empty for now */}
          <div className="flex items-center">
            {/* Empty space for balance */}
          </div>
        </div>

        {/* Mobile Tab Navigation - shown below header on smaller screens */}
        {showProductTabs && (
          <div className="lg:hidden border-t border-gray-200 bg-gray-50">
            <div className="px-4 py-3 overflow-x-auto">
              <div className="flex overflow-x-auto">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  {PRODUCT_TABS.map((tab) => {
                    const isActive = currentTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                          group relative min-w-0 flex-1 overflow-hidden bg-transparent py-2 px-1 text-sm font-medium text-center hover:text-gray-700 focus:z-10 whitespace-nowrap
                          ${isActive 
                            ? 'text-blue-600 border-b-2 border-blue-600' 
                            : 'text-gray-500 border-b-2 border-transparent hover:border-gray-300'
                          }
                        `}
                      >
                        <span className="text-xs">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

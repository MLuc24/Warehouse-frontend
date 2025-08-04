import React from 'react'

interface Tab {
  id: string
  label: string
  description: string
  isPlaceholder?: boolean
}

interface ProductTabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabClick: (tabId: string) => void
}

export const ProductTabNavigation: React.FC<ProductTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabClick
}) => {
  return (
    <div className="flex overflow-x-auto">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isPlaceholder = tab.isPlaceholder
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`
                group relative min-w-0 flex-1 overflow-hidden bg-transparent py-4 px-1 text-sm font-medium text-center hover:text-gray-700 focus:z-10 whitespace-nowrap
                ${isActive 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 border-b-2 border-transparent hover:border-gray-300'
                }
                ${isPlaceholder ? 'opacity-75' : ''}
              `}
              disabled={false}
            >
              <span className="flex items-center justify-center space-x-2">
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
          )
        })}
      </nav>
    </div>
  )
}

export default ProductTabNavigation

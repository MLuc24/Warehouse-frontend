import React, { useState } from 'react'
import { Card, Badge } from '../../../components/ui'
import { CategoryTable } from './CategoryTable'
import { DefaultCategoryPanel } from './DefaultCategoryPanel'
import { Coffee, Table, Settings } from 'lucide-react'

/**
 * Category Management Component
 * Main component for managing categories with tabs for different views
 */
export const CategoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'defaults' | 'settings'>('table')

  const tabs = [
    {
      key: 'table' as const,
      label: 'Quản lý danh mục',
      icon: <Table className="w-4 h-4" />,
      component: <CategoryTable />
    },
    {
      key: 'defaults' as const,
      label: 'Danh mục TocoToco',
      icon: <Coffee className="w-4 h-4" />,
      component: <DefaultCategoryPanel />
    },
    {
      key: 'settings' as const,
      label: 'Cài đặt',
      icon: <Settings className="w-4 h-4" />,
      component: (
        <Card className="p-6">
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cài đặt danh mục
            </h3>
            <p className="text-gray-500">
              Tính năng cài đặt sẽ được phát triển trong tương lai
            </p>
          </div>
        </Card>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý danh mục sản phẩm
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý các danh mục cho cửa hàng trà sữa TocoToco
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="primary">
              TocoToco Store
            </Badge>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <Card className="p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      <div>
        {tabs.find(tab => tab.key === activeTab)?.component}
      </div>
    </div>
  )
}

export default CategoryManagement

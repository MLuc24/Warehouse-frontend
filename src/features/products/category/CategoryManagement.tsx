import React, { useState } from 'react'
import { Card, Badge } from '../../../components/ui'
import { CategoryTable } from './CategoryTable'
import { DefaultCategoryPanel } from './DefaultCategoryPanel'
import { Coffee, Table, Settings, Tags, Store } from 'lucide-react'

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
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Tags className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Quản lý danh mục sản phẩm
                  <Badge variant="primary" className="text-xs">
                    Categories
                  </Badge>
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Tổ chức và phân loại sản phẩm cho cửa hàng TocoToco
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">TocoToco Store</div>
                <div className="text-xs text-gray-500">Hệ thống quản lý kho</div>
              </div>
              <Badge variant="success" className="px-3 py-1">
                Hoạt động
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Tab Navigation */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600" />
            Chức năng quản lý
          </h2>
          <p className="text-sm text-gray-600 mt-1">Chọn chức năng để thực hiện các thao tác với danh mục</p>
        </div>
        <div className="p-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200
                  ${activeTab === tab.key
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-200 transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }
                `}
              >
                <span className={activeTab === tab.key ? 'text-blue-600' : 'text-gray-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
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

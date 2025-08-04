import React, { useState, useEffect } from 'react'
import { Card, Button, Alert, Tabs } from '@/components/ui'
import { CategoryTable } from '@/features/products/CategoryTable'
import { StockTable } from '@/features/products'
import { useCategory, useStock } from '@/hooks'

/**
 * Week 4-5 Demo Page - Categories & Stock Management
 * Comprehensive demo of all implemented features
 */
export const Week45DemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('categories')
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError,
    fetchCategories,
    fetchAllCategoryStats 
  } = useCategory()
  
  const { 
    stocks, 
    lowStockProducts,
    loading: stockLoading, 
    error: stockError,
    fetchAllStock,
    fetchLowStockProducts 
  } = useStock()

  // Load initial data
  useEffect(() => {
    fetchCategories()
    fetchAllCategoryStats()
    fetchAllStock()
    fetchLowStockProducts()
  }, [fetchCategories, fetchAllCategoryStats, fetchAllStock, fetchLowStockProducts])

  const tabItems = [
    {
      id: 'categories',
      label: `📋 Categories Management (${categories.length})`,
      content: <CategoryTable />
    },
    {
      id: 'stock',
      label: `📦 Stock Management (${stocks.length})`,
      content: <StockTable />
    },
    {
      id: 'overview',
      label: '📊 Overview',
      content: (
        <div className="p-6 space-y-6">
          <h3 className="text-xl font-bold">Tổng quan Tuần 4-5</h3>
          
          {/* Implementation Status */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">🎯 Trạng thái triển khai</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-green-600 mb-2">✅ Đã hoàn thành</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Category CRUD operations với API</li>
                  <li>• Category statistics & analytics</li>
                  <li>• Bulk category updates</li>
                  <li>• Stock level management</li>
                  <li>• Stock adjustment tools</li>
                  <li>• Low stock alerts system</li>
                  <li>• Stock history tracking</li>
                  <li>• Reorder point management</li>
                  <li>• Advanced search & filtering</li>
                  <li>• Responsive UI components</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-blue-600 mb-2">🔧 Tính năng chính</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• TypeScript types cho Categories & Stock</li>
                  <li>• Custom hooks (useCategory, useStock)</li>
                  <li>• Service layer pattern</li>
                  <li>• Error handling & loading states</li>
                  <li>• Real-time data updates</li>
                  <li>• Bulk operations support</li>
                  <li>• Modal-based workflows</li>
                  <li>• Progress indicators</li>
                  <li>• Status badges & alerts</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">📋 Categories Stats</h4>
              {categoriesLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : categoriesError ? (
                <Alert type="error" title="Error" message={categoriesError} />
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Categories:</span>
                    <span className="font-semibold">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-semibold">
                      {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Stock:</span>
                    <span className="font-semibold">
                      {categories.reduce((sum, cat) => sum + cat.totalStock, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-semibold text-green-600">
                      {categories.reduce((sum, cat) => sum + cat.totalValue, 0).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        notation: 'compact'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">📦 Stock Stats</h4>
              {stockLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : stockError ? (
                <Alert type="error" title="Error" message={stockError} />
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-semibold">{stocks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Stock:</span>
                    <span className="font-semibold text-green-600">
                      {stocks.filter(s => s.stockStatus === 'in-stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Stock:</span>
                    <span className="font-semibold text-yellow-600">
                      {stocks.filter(s => s.stockStatus === 'low-stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Stock:</span>
                    <span className="font-semibold text-red-600">
                      {stocks.filter(s => s.stockStatus === 'out-of-stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Stock Alerts:</span>
                    <span className="font-semibold text-orange-600">
                      {lowStockProducts.length}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Technical Architecture */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">🏗️ Technical Architecture</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-medium text-blue-600 mb-2">Frontend Layer</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• React + TypeScript</li>
                  <li>• Custom Hooks Pattern</li>
                  <li>• Component Composition</li>
                  <li>• State Management</li>
                  <li>• Error Boundaries</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-green-600 mb-2">Service Layer</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• API Service Classes</li>
                  <li>• Singleton Pattern</li>
                  <li>• Error Handling</li>
                  <li>• Type Safety</li>
                  <li>• Consistent Endpoints</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-purple-600 mb-2">Backend Integration</h5>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• REST API Endpoints</li>
                  <li>• DTO Mapping</li>
                  <li>• Validation</li>
                  <li>• Authorization</li>
                  <li>• Database Operations</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  🚀 Week 4-5 Implementation Demo
                </h1>
                <p className="text-gray-600">
                  Categories & Stock Management - Full Implementation
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    fetchCategories()
                    fetchAllCategoryStats()
                    fetchAllStock()
                    fetchLowStockProducts()
                  }}
                  loading={categoriesLoading || stockLoading}
                >
                  Refresh All Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Status Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <Alert 
            type="success" 
            title="🎉 Week 4-5 Complete!" 
            message="Categories Management và Stock Management đã được triển khai đầy đủ với tất cả tính năng theo roadmap."
          />
        </div>

        {/* Tab Content */}
        <div className="bg-white min-h-[calc(100vh-200px)]">
          <Tabs
            items={tabItems}
            defaultTab={activeTab}
            onTabChange={setActiveTab}
            variant="line"
            size="md"
          />
        </div>
      </div>
    </div>
  )
}

export default Week45DemoPage

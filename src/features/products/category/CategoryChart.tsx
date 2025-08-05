import React from 'react'
import type { Category } from '../../../types/category'
import type { CategoryAnalyticsDto } from '../../../types/dashboard'

interface CategoryChartProps {
  categories: Category[] | CategoryAnalyticsDto[]
  isLoading?: boolean
  error?: string | null
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ 
  categories, 
  isLoading = false, 
  error = null 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <p>Lỗi tải dữ liệu: {error}</p>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Không có dữ liệu danh mục</p>
      </div>
    )
  }

  const maxProductCount = Math.max(...categories.map(cat => cat.productCount || 0))

  // Helper function to check if category is CategoryAnalyticsDto
  const isCategoryAnalytics = (cat: Category | CategoryAnalyticsDto): cat is CategoryAnalyticsDto => {
    return 'category' in cat
  }

  // Helper function to get category name
  const getCategoryName = (cat: Category | CategoryAnalyticsDto): string => {
    return isCategoryAnalytics(cat) ? cat.category : cat.name
  }

  // Helper function to get category key
  const getCategoryKey = (cat: Category | CategoryAnalyticsDto, index: number): string => {
    return isCategoryAnalytics(cat) ? `analytics-${index}` : `category-${cat.categoryId}`
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Biểu đồ danh mục sản phẩm</h3>
      <div className="space-y-4">
        {categories.map((category, index) => {
          const productCount = category.productCount || 0
          const percentage = maxProductCount > 0 ? (productCount / maxProductCount) * 100 : 0
          
          return (
            <div key={getCategoryKey(category, index)} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{getCategoryName(category)}</span>
                <span className="text-sm text-gray-500">{productCount} sản phẩm</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Tổng quan</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tổng danh mục:</span>
            <span className="ml-2 font-medium">{categories.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Tổng sản phẩm:</span>
            <span className="ml-2 font-medium">
              {categories.reduce((total, cat) => total + (cat.productCount || 0), 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

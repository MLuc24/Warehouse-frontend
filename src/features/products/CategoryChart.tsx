import React from 'react'
import { Card } from '@/components/ui'
import { BarChart3, TrendingUp } from 'lucide-react'
import type { CategoryAnalyticsDto } from '@/types/dashboard'
import { dashboardService } from '@/services/dashboard'

interface CategoryChartProps {
  categories: CategoryAnalyticsDto[]
  isLoading: boolean
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ categories, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="flex-1 h-3 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="p-6 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Không có dữ liệu danh mục</p>
      </Card>
    )
  }

  const maxValue = Math.max(...categories.map(c => c.totalValue))

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top danh mục</h3>
          <p className="text-sm text-gray-500">Theo giá trị tồn kho</p>
        </div>
        <div className="flex items-center space-x-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">
            {categories.length} danh mục
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => {
          const widthPercent = (category.totalValue / maxValue) * 100
          const color = dashboardService.getColorForCategory(index)
          
          return (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 truncate">
                  {category.category}
                </span>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{category.productCount} SP</span>
                  <span className="font-medium text-gray-900">
                    {dashboardService.formatCurrency(category.totalValue)}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: color,
                      width: `${widthPercent}%` 
                    }}
                  />
                </div>
                <div className="absolute right-0 -top-5">
                  <span className="text-xs font-medium" style={{ color }}>
                    {dashboardService.formatPercentage(category.percentage)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tồn kho: {dashboardService.formatNumber(category.totalStock)}</span>
                <span>
                  TB/SP: {dashboardService.formatCurrency(category.productCount > 0 ? category.totalValue / category.productCount : 0)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {dashboardService.formatNumber(categories.reduce((sum, c) => sum + c.productCount, 0))}
            </p>
            <p className="text-xs text-gray-500">Tổng SP</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {dashboardService.formatCurrency(categories.reduce((sum, c) => sum + c.totalValue, 0))}
            </p>
            <p className="text-xs text-gray-500">Tổng giá trị</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {dashboardService.formatNumber(categories.reduce((sum, c) => sum + c.totalStock, 0))}
            </p>
            <p className="text-xs text-gray-500">Tổng tồn kho</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

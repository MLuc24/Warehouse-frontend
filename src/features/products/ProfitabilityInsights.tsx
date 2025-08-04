import React from 'react'
import { Card } from '@/components/ui'
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react'
import type { ProfitabilityAnalyticsDto } from '@/types/dashboard'
import { dashboardService } from '@/services/dashboard'

interface ProfitabilityInsightsProps {
  insights: ProfitabilityAnalyticsDto | null
  isLoading: boolean
}

export const ProfitabilityInsights: React.FC<ProfitabilityInsightsProps> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card className="p-6 text-center">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Không có dữ liệu phân tích lợi nhuận</p>
      </Card>
    )
  }

  const grossProfit = insights.totalSellingValue - insights.totalPurchaseValue
  const isProfit = grossProfit >= 0

  const metrics = [
    {
      label: 'Tổng giá mua',
      value: dashboardService.formatCurrency(insights.totalPurchaseValue),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Tổng giá bán',
      value: dashboardService.formatCurrency(insights.totalSellingValue),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Lợi nhuận gộp',
      value: dashboardService.formatCurrency(grossProfit),
      icon: isProfit ? TrendingUp : TrendingDown,
      color: isProfit ? 'text-green-600' : 'text-red-600',
      bgColor: isProfit ? 'bg-green-50' : 'bg-red-50'
    },
    {
      label: 'Margin trung bình',
      value: dashboardService.formatPercentage(insights.averageMarginPercent),
      icon: Target,
      color: insights.averageMarginPercent >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: insights.averageMarginPercent >= 0 ? 'bg-blue-50' : 'bg-red-50'
    }
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Phân tích lợi nhuận</h3>
          <p className="text-sm text-gray-500">Tổng quan về khả năng sinh lời</p>
        </div>
        <div className={`flex items-center space-x-1 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isProfit ? 'Có lời' : 'Thua lỗ'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          
          return (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${metric.bgColor} mb-2`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500">
                {metric.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Product Analysis */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Phân tích sản phẩm theo margin</h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-600">
              {dashboardService.formatNumber(insights.highMarginProducts)}
            </p>
            <p className="text-xs text-gray-600">Margin cao</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-2">
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-orange-600">
              {dashboardService.formatNumber(insights.lowMarginProducts)}
            </p>
            <p className="text-xs text-gray-600">Margin thấp</p>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-lg font-bold text-red-600">
              {dashboardService.formatNumber(insights.negativeMarginProducts)}
            </p>
            <p className="text-xs text-gray-600">Margin âm</p>
          </div>
        </div>
      </div>

      {/* Margin Analysis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Hiệu suất margin tổng thể</span>
          <span className={`font-medium ${insights.averageMarginPercent >= 20 ? 'text-green-600' : insights.averageMarginPercent >= 10 ? 'text-orange-600' : 'text-red-600'}`}>
            {insights.averageMarginPercent >= 20 ? 'Xuất sắc' : 
             insights.averageMarginPercent >= 10 ? 'Trung bình' : 'Cần cải thiện'}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              insights.averageMarginPercent >= 20 ? 'bg-green-500' : 
              insights.averageMarginPercent >= 10 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(Math.max(insights.averageMarginPercent, 0), 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </Card>
  )
}

import React from 'react'
import { Card } from '@/components/ui'
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle } from 'lucide-react'
import type { ProductOverviewDto } from '@/types/dashboard'
import { dashboardService } from '@/services/dashboard'

interface AnalyticsCardsProps {
  overview: ProductOverviewDto | null
  isLoading: boolean
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ overview, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (!overview) {
    return null
  }

  const cards = [
    {
      title: 'Tổng sản phẩm',
      value: dashboardService.formatNumber(overview.totalProducts),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: overview.activeProducts > overview.inactiveProducts ? 'up' : 'down',
      subtitle: `${overview.activeProducts} hoạt động`
    },
    {
      title: 'Giá trị kho hàng',
      value: dashboardService.formatCurrency(overview.totalInventoryValue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: 'up',
      subtitle: `TB: ${dashboardService.formatCurrency(overview.averageProductValue)}`
    },
    {
      title: 'Sản phẩm hoạt động',
      value: dashboardService.formatNumber(overview.activeProducts),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: 'up',
      subtitle: `${dashboardService.formatPercentage((overview.activeProducts / overview.totalProducts) * 100)} tổng số`
    },
    {
      title: 'Không hoạt động',
      value: dashboardService.formatNumber(overview.inactiveProducts),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 'down',
      subtitle: overview.inactiveProducts > 0 ? 'Cần chú ý' : 'Tốt'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        const TrendIcon = card.change === 'up' ? TrendingUp : TrendingDown
        
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </p>
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`w-3 h-3 ${card.change === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                  <p className="text-xs text-gray-500">
                    {card.subtitle}
                  </p>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

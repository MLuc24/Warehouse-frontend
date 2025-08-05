import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { RefreshCw, BarChart3, TrendingUp, Calendar, Download } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { AnalyticsCards } from './AnalyticsCards'
import { CategoryChart } from './category'
import { AlertsDashboard } from './AlertsDashboard'
import { ProfitabilityInsights } from './ProfitabilityInsights'

export const AnalyticsManagement: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const {
    overview,
    alerts,
    isLoadingOverview,
    isLoadingStats,
    isLoadingAlerts,
    isLoadingTrends,
    overviewError,
    alertsError,
    trendsError,
    refreshAll
  } = useDashboard()

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshAll()
    } finally {
      setRefreshing(false)
    }
  }

  const hasAnyError = overviewError || alertsError || trendsError
  const isAnyLoading = isLoadingOverview || isLoadingStats || isLoadingAlerts || isLoadingTrends

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Analytics & Reports
            </h2>
            <p className="text-sm text-gray-500">
              Phân tích dữ liệu và báo cáo tổng hợp
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || isAnyLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Error State */}
      {hasAnyError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Không thể tải một số dữ liệu
              </h3>
              <p className="text-sm text-red-600 mt-1">
                {overviewError || alertsError || trendsError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Cards */}
      <AnalyticsCards 
        overview={overview?.overview || null} 
        isLoading={isLoadingOverview} 
      />

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <CategoryChart 
          categories={overview?.topCategories || []} 
          isLoading={isLoadingOverview} 
        />

        {/* Profitability Analysis */}
        <ProfitabilityInsights 
          insights={overview?.profitabilityInsights || null} 
          isLoading={isLoadingOverview} 
        />
      </div>

      {/* Alerts Dashboard */}
      <AlertsDashboard 
        alerts={alerts} 
        isLoading={isLoadingAlerts} 
      />

      {/* Last Updated */}
      {overview?.overview?.lastUpdated && (
        <div className="text-center py-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              Cập nhật lần cuối: {new Date(overview.overview.lastUpdated).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

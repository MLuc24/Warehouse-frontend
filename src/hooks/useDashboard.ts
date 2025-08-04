import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '@/services/dashboard'
import type { 
  ProductDashboardDto, 
  DashboardQuickStats, 
  DashboardAlerts, 
  TrendData 
} from '@/types/dashboard'

interface UseDashboardReturn {
  // Data
  overview: ProductDashboardDto | null
  quickStats: DashboardQuickStats | null
  alerts: DashboardAlerts | null
  trends: TrendData | null
  
  // Loading states
  isLoadingOverview: boolean
  isLoadingStats: boolean
  isLoadingAlerts: boolean
  isLoadingTrends: boolean
  
  // Error states
  overviewError: string | null
  statsError: string | null
  alertsError: string | null
  trendsError: string | null
  
  // Actions
  refreshOverview: () => Promise<void>
  refreshQuickStats: () => Promise<void>
  refreshAlerts: () => Promise<void>
  refreshTrends: () => Promise<void>
  refreshAll: () => Promise<void>
}

export const useDashboard = (): UseDashboardReturn => {
  // Data states
  const [overview, setOverview] = useState<ProductDashboardDto | null>(null)
  const [quickStats, setQuickStats] = useState<DashboardQuickStats | null>(null)
  const [alerts, setAlerts] = useState<DashboardAlerts | null>(null)
  const [trends, setTrends] = useState<TrendData | null>(null)

  // Loading states
  const [isLoadingOverview, setIsLoadingOverview] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false)
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)

  // Error states
  const [overviewError, setOverviewError] = useState<string | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [alertsError, setAlertsError] = useState<string | null>(null)
  const [trendsError, setTrendsError] = useState<string | null>(null)

  // Fetch overview data
  const refreshOverview = useCallback(async () => {
    setIsLoadingOverview(true)
    setOverviewError(null)
    try {
      const data = await dashboardService.getDashboardOverview()
      setOverview(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
      setOverviewError(message)
    } finally {
      setIsLoadingOverview(false)
    }
  }, [])

  // Fetch quick stats
  const refreshQuickStats = useCallback(async () => {
    setIsLoadingStats(true)
    setStatsError(null)
    try {
      const data = await dashboardService.getQuickStats()
      setQuickStats(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
      setStatsError(message)
    } finally {
      setIsLoadingStats(false)
    }
  }, [])

  // Fetch alerts
  const refreshAlerts = useCallback(async () => {
    setIsLoadingAlerts(true)
    setAlertsError(null)
    try {
      const data = await dashboardService.getAlerts()
      setAlerts(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
      setAlertsError(message)
    } finally {
      setIsLoadingAlerts(false)
    }
  }, [])

  // Fetch trends
  const refreshTrends = useCallback(async () => {
    setIsLoadingTrends(true)
    setTrendsError(null)
    try {
      const data = await dashboardService.getTrends()
      setTrends(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra'
      setTrendsError(message)
    } finally {
      setIsLoadingTrends(false)
    }
  }, [])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshOverview(),
      refreshQuickStats(),
      refreshAlerts(),
      refreshTrends()
    ])
  }, [refreshOverview, refreshQuickStats, refreshAlerts, refreshTrends])

  // Initial data load
  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  return {
    // Data
    overview,
    quickStats,
    alerts,
    trends,
    
    // Loading states
    isLoadingOverview,
    isLoadingStats,
    isLoadingAlerts,
    isLoadingTrends,
    
    // Error states
    overviewError,
    statsError,
    alertsError,
    trendsError,
    
    // Actions
    refreshOverview,
    refreshQuickStats,
    refreshAlerts,
    refreshTrends,
    refreshAll
  }
}

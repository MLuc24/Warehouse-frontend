import { apiService } from './api'
import type { 
  ProductDashboardDto, 
  DashboardQuickStats, 
  DashboardAlerts, 
  TrendData
} from '@/types/dashboard'

class DashboardService {
  private readonly baseUrl = '/ProductDashboard'

  async getDashboardOverview(): Promise<ProductDashboardDto> {
    try {
      const response = await apiService.get(`${this.baseUrl}/overview`)
      return response as ProductDashboardDto
    } catch (error) {
      console.error('Error fetching dashboard overview:', error)
      throw new Error('Không thể tải dữ liệu dashboard')
    }
  }

  async getQuickStats(): Promise<DashboardQuickStats> {
    try {
      const response = await apiService.get(`${this.baseUrl}/quick-stats`)
      return response as DashboardQuickStats
    } catch (error) {
      console.error('Error fetching quick stats:', error)
      throw new Error('Không thể tải thống kê nhanh')
    }
  }

  async getAlerts(): Promise<DashboardAlerts> {
    try {
      const response = await apiService.get(`${this.baseUrl}/alerts`)
      return response as DashboardAlerts
    } catch (error) {
      console.error('Error fetching alerts:', error)
      throw new Error('Không thể tải cảnh báo')
    }
  }

  async getTrends(): Promise<TrendData> {
    try {
      const response = await apiService.get(`${this.baseUrl}/trends`)
      return response as TrendData
    } catch (error) {
      console.error('Error fetching trends:', error)
      throw new Error('Không thể tải dữ liệu xu hướng')
    }
  }

  // Utility methods for data transformation
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  formatPercentage(num: number): string {
    return `${num.toFixed(1)}%`
  }

  getAlertSeverity(alertType: string, daysUntilExpiry?: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (alertType === 'EXPIRED' || alertType === 'OUT_OF_STOCK') {
      return 'HIGH'
    }
    if (alertType === 'EXPIRING_TODAY' || (daysUntilExpiry && daysUntilExpiry <= 1)) {
      return 'HIGH'
    }
    if (alertType === 'EXPIRING_SOON' || alertType === 'LOW_STOCK') {
      return daysUntilExpiry && daysUntilExpiry <= 7 ? 'MEDIUM' : 'LOW'
    }
    return 'LOW'
  }

  getColorForCategory(index: number): string {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#06B6D4', // cyan
      '#84CC16', // lime
      '#F97316', // orange
    ]
    return colors[index % colors.length]
  }
}

export const dashboardService = new DashboardService()
export default dashboardService

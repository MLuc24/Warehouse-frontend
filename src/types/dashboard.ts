export interface ProductOverviewDto {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  totalInventoryValue: number
  averageProductValue: number
  lastUpdated: string
}

export interface CategoryAnalyticsDto {
  category: string
  productCount: number
  totalValue: number
  totalStock: number
  percentage: number
}

export interface ProfitabilityAnalyticsDto {
  totalPurchaseValue: number
  totalSellingValue: number
  averageMarginPercent: number
  highMarginProducts: number
  lowMarginProducts: number
  negativeMarginProducts: number
}

export interface ProductDashboardDto {
  overview: ProductOverviewDto
  criticalStockItems: Array<{
    id: number
    name: string
    currentStock: number
    minStock: number
    category: string
    lastUpdated: string
  }>
  expiringItems: Array<{
    id: number
    name: string
    expiryDate: string
    daysUntilExpiry: number
    currentStock: number
    status: string
  }>
  topCategories: CategoryAnalyticsDto[]
  profitabilityInsights: ProfitabilityAnalyticsDto
}

export interface DashboardQuickStats {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  expiredProducts: number
  expiringSoonProducts: number
  totalCategories: number
  totalInventoryValue: number
}

export interface StockAlert {
  id: number
  name: string
  currentStock: number
  minStock: number
  category: string
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK'
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface ExpiryAlert {
  id: number
  name: string
  expiryDate: string
  daysUntilExpiry: number
  currentStock: number
  alertType: 'EXPIRED' | 'EXPIRING_SOON' | 'EXPIRING_TODAY'
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface DashboardAlerts {
  stockAlerts: {
    lowStock: StockAlert[]
    outOfStock: StockAlert[]
  }
  expiryAlerts: {
    expired: ExpiryAlert[]
    expiringSoon: ExpiryAlert[]
    systemAlerts: ExpiryAlert[]
  }
}

export interface TrendData {
  categoryTrends: CategoryAnalyticsDto[]
  pricingTrends: {
    averageMargin: number
    highMarginProducts: Array<{
      id: number
      name: string
      marginPercent: number
      sellingPrice: number
      purchasePrice: number
    }>
    lowMarginProducts: Array<{
      id: number
      name: string
      marginPercent: number
      sellingPrice: number
      purchasePrice: number
    }>
  }
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  percentage?: number
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface DashboardFilters {
  dateRange: {
    startDate: string
    endDate: string
  }
  categories: string[]
  includeInactive: boolean
}

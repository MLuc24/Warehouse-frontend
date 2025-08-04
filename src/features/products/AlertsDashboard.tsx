import React from 'react'
import { Card, Badge } from '@/components/ui'
import { AlertTriangle, Clock, Package } from 'lucide-react'
import type { DashboardAlerts } from '@/types/dashboard'

interface AlertsDashboardProps {
  alerts: DashboardAlerts | null
  isLoading: boolean
}

export const AlertsDashboard: React.FC<AlertsDashboardProps> = ({ alerts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
        <Card className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (!alerts) {
    return null
  }

  const stockAlerts = [
    ...alerts.stockAlerts.outOfStock.map(alert => ({ ...alert, type: 'OUT_OF_STOCK' as const })),
    ...alerts.stockAlerts.lowStock.map(alert => ({ ...alert, type: 'LOW_STOCK' as const }))
  ]

  const expiryAlerts = [
    ...alerts.expiryAlerts.expired.map(alert => ({ ...alert, type: 'EXPIRED' as const })),
    ...alerts.expiryAlerts.expiringSoon.map(alert => ({ ...alert, type: 'EXPIRING_SOON' as const }))
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
      case 'LOW_STOCK':
        return Package
      case 'EXPIRED':
      case 'EXPIRING_SOON':
        return Clock
      default:
        return AlertTriangle
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'OUT_OF_STOCK':
      case 'EXPIRED':
        return 'danger'
      case 'LOW_STOCK':
      case 'EXPIRING_SOON':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const getAlertMessage = (alert: { type: string; currentStock?: number; minStock?: number; daysUntilExpiry?: number }) => {
    switch (alert.type) {
      case 'OUT_OF_STOCK':
        return 'Hết hàng'
      case 'LOW_STOCK':
        return `Còn ${alert.currentStock}/${alert.minStock}`
      case 'EXPIRED':
        return 'Đã hết hạn'
      case 'EXPIRING_SOON':
        return `Còn ${alert.daysUntilExpiry} ngày`
      default:
        return 'Cảnh báo'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stock Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cảnh báo tồn kho</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {stockAlerts.length}
          </Badge>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {stockAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Không có cảnh báo tồn kho</p>
            </div>
          ) : (
            stockAlerts.slice(0, 10).map((alert, index) => {
              const Icon = getAlertIcon(alert.type)
              
              return (
                <div key={`stock-${alert.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${alert.type === 'OUT_OF_STOCK' ? 'text-red-500' : 'text-orange-500'}`} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm truncate max-w-48">
                        {alert.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {alert.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getAlertColor(alert.type)} className="text-xs">
                      {getAlertMessage(alert)}
                    </Badge>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {stockAlerts.length > 10 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Và {stockAlerts.length - 10} cảnh báo khác
            </p>
          </div>
        )}
      </Card>

      {/* Expiry Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cảnh báo hạn sử dụng</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {expiryAlerts.length}
          </Badge>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {expiryAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Không có cảnh báo hạn sử dụng</p>
            </div>
          ) : (
            expiryAlerts.slice(0, 10).map((alert, index) => {
              const Icon = getAlertIcon(alert.type)
              
              return (
                <div key={`expiry-${alert.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${alert.type === 'EXPIRED' ? 'text-red-500' : 'text-orange-500'}`} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm truncate max-w-48">
                        {alert.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        HSD: {new Date(alert.expiryDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getAlertColor(alert.type)} className="text-xs">
                      {getAlertMessage(alert)}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      SL: {alert.currentStock}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {expiryAlerts.length > 10 && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Và {expiryAlerts.length - 10} cảnh báo khác
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { AlertTriangle, Bell, Clock, Package, X } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { formatDate, formatCurrency } from '@/utils/formatUtils'
import { useExpiry } from '@/hooks/useExpiry'
import { ExpiryStatus } from '@/types/expiry'

export const ExpiryAlerts: React.FC = () => {
  const { 
    expiryAlerts, 
    loading, 
    error, 
    fetchExpiryAlerts
  } = useExpiry()
  
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([])

  useEffect(() => {
    fetchExpiryAlerts()
  }, [fetchExpiryAlerts])

  const handleDismissAlert = (productId: number) => {
    setDismissedAlerts(prev => [...prev, productId])
  }

  const getAlertIcon = (status: ExpiryStatus) => {
    switch (status) {
      case ExpiryStatus.Expired:
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case ExpiryStatus.ExpiringSoon:
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertClassName = (status: ExpiryStatus) => {
    switch (status) {
      case ExpiryStatus.Expired:
        return 'border-red-200 bg-red-50'
      case ExpiryStatus.ExpiringSoon:
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const getAlertBadge = (alertLevel: string, status: ExpiryStatus) => {
    switch (status) {
      case ExpiryStatus.Expired:
        return <Badge variant="danger">{alertLevel}</Badge>
      case ExpiryStatus.ExpiringSoon:
        return <Badge variant="warning">{alertLevel}</Badge>
      default:
        return <Badge variant="info">{alertLevel}</Badge>
    }
  }

  const activeAlerts = expiryAlerts.filter(alert => !dismissedAlerts.includes(alert.productId))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải cảnh báo...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-600 mb-2">❌ {error}</div>
        <Button onClick={fetchExpiryAlerts} variant="outline" size="sm">
          Thử lại
        </Button>
      </div>
    )
  }

  if (activeAlerts.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Không có cảnh báo hạn sử dụng nào</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Cảnh báo hạn sử dụng ({activeAlerts.length})
        </h3>
        
        {activeAlerts.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDismissedAlerts(expiryAlerts.map(a => a.productId))}
          >
            Đóng tất cả
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {activeAlerts.map((alert) => (
          <div
            key={alert.productId}
            className={`border rounded-lg p-4 ${getAlertClassName(alert.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.status)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.productName}
                    </p>
                    {getAlertBadge(alert.alertLevel, alert.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    SKU: {alert.sku}
                  </p>
                  
                  <div className="text-sm text-gray-600">
                    {alert.status === ExpiryStatus.Expired ? (
                      <span className="text-red-600 font-medium">
                        Đã hết hạn {Math.abs(alert.daysUntilExpiry)} ngày
                      </span>
                    ) : (
                      <span>
                        Còn <span className="font-medium">{alert.daysUntilExpiry} ngày</span> 
                        {alert.expiryDate && ` (${formatDate(alert.expiryDate)})`}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Tồn kho: {alert.currentStock}</span>
                    {alert.totalValue && (
                      <span>Giá trị: {formatCurrency(alert.totalValue)}</span>
                    )}
                    <span>Tạo: {formatDate(alert.alertCreatedAt)}</span>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDismissAlert(alert.productId)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {dismissedAlerts.length > 0 && (
        <div className="text-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDismissedAlerts([])}
          >
            Hiển thị {dismissedAlerts.length} cảnh báo đã đóng
          </Button>
        </div>
      )}
    </div>
  )
}

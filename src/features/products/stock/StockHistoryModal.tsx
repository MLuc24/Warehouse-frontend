import React, { useEffect } from 'react'
import { Button, Badge } from '@/components/ui'
import { GenericModal, EmptyState } from '@/components/common'
import { Calendar, User } from 'lucide-react'
import type { ProductStock, StockHistory } from '@/types'

interface StockHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  stock: ProductStock | null
  stockHistory: StockHistory[]
  onFetchHistory: (productId: number) => void
  loading?: boolean
}

export const StockHistoryModal: React.FC<StockHistoryModalProps> = ({
  isOpen,
  onClose,
  stock,
  stockHistory,
  onFetchHistory,
  loading = false
}) => {
  useEffect(() => {
    if (isOpen && stock) {
      onFetchHistory(stock.productId)
    }
  }, [isOpen, stock, onFetchHistory])

  const getAdjustmentTypeColor = (type: string) => {
    switch (type) {
      case 'receive': return 'success'
      case 'issue': return 'warning'
      case 'adjust': return 'info'
      case 'transfer': return 'secondary'
      default: return 'secondary'
    }
  }

  const getAdjustmentTypeText = (type: string) => {
    switch (type) {
      case 'receive': return 'Nhập kho'
      case 'issue': return 'Xuất kho'
      case 'adjust': return 'Điều chỉnh'
      case 'transfer': return 'Chuyển kho'
      default: return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Lịch sử tồn kho"
      size="lg"
    >
      <div className="space-y-6">
        {/* Product Info */}
        {stock && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">{stock.productName}</h3>
            <p className="text-sm text-gray-600">SKU: {stock.sku}</p>
            <p className="text-sm text-gray-600">Tồn kho hiện tại: <span className="font-medium">{stock.currentStock} {stock.unit}</span></p>
          </div>
        )}

        {/* History List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Lịch sử thay đổi tồn kho</h4>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : stockHistory.length === 0 ? (
            <EmptyState
              title="Chưa có lịch sử"
              description="Sản phẩm này chưa có lịch sử thay đổi tồn kho"
            />
          ) : (
            <div className="space-y-4">
              {stockHistory.map((history, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={getAdjustmentTypeColor(history.type)}>
                          {getAdjustmentTypeText(history.type)}
                        </Badge>
                        <span className="text-sm font-medium">
                          {history.quantity > 0 ? '+' : ''}{history.quantity} {stock?.unit}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(history.date)}</span>
                        </div>
                        
                        {history.createdBy && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Được thực hiện bởi: {history.createdBy}</span>
                          </div>
                        )}
                        
                        {history.reason && (
                          <div>
                            <span className="font-medium">Lý do: </span>
                            <span>{history.reason}</span>
                          </div>
                        )}
                        
                        {history.notes && (
                          <div>
                            <span className="font-medium">Ghi chú: </span>
                            <span>{history.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {history.previousStock} → {history.newStock}
                      </div>
                      <div className="text-xs text-gray-500">
                        Trước → Sau
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </GenericModal>
  )
}

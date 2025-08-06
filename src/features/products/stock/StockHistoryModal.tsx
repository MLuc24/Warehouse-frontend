import React, { useEffect } from 'react'
import { Button, Badge } from '@/components/ui'
import { GenericModal, EmptyState } from '@/components/common'
import { Calendar, User, History, TrendingUp, TrendingDown, Package } from 'lucide-react'
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
      variant="info"
      icon={<History className="w-5 h-5" />}
    >
      <div className="space-y-6">
        {/* Enhanced Product Info */}
        {stock && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{stock.productName}</h3>
                <p className="text-sm text-gray-600">SKU: {stock.sku}</p>
                <p className="text-sm font-medium text-purple-700">
                  Tồn kho hiện tại: <span className="text-xl">{stock.currentStock}</span> {stock.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced History List */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <History className="w-5 h-5 text-purple-600" />
            <span>Lịch sử thay đổi tồn kho</span>
          </h4>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : stockHistory.length === 0 ? (
            <EmptyState
              title="Chưa có lịch sử"
              description="Sản phẩm này chưa có lịch sử thay đổi tồn kho"
            />
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stockHistory.map((history, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-100 rounded-xl p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:border-blue-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant={getAdjustmentTypeColor(history.type)} className="px-3 py-1">
                          {getAdjustmentTypeText(history.type)}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {history.quantity > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-bold ${
                            history.quantity > 0 ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {history.quantity > 0 ? '+' : ''}{history.quantity} {stock?.unit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(history.date)}</span>
                        </div>
                        
                        {history.createdBy && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Thực hiện bởi: <span className="font-medium">{history.createdBy}</span></span>
                          </div>
                        )}
                        
                        {history.reason && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Lý do: </span>
                            <span className="text-gray-600">{history.reason}</span>
                          </div>
                        )}
                        
                        {history.notes && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Ghi chú: </span>
                            <span className="text-gray-600">{history.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-sm font-bold text-gray-900 mb-1">
                          {history.previousStock} → {history.newStock}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          Trước → Sau
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Actions */}
        <div className="flex justify-end pt-6 border-t-2 border-gray-100">
          <Button 
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Đóng
          </Button>
        </div>
      </div>
    </GenericModal>
  )
}

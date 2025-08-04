import React, { useState, useEffect } from 'react'
import { X, Clock, User, TrendingUp, TrendingDown } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { usePricing } from '@/hooks/usePricing'
import { formatCurrency, formatDate } from '@/utils'
import type { PriceHistoryDto } from '@/types/pricing'

interface PriceHistoryModalProps {
  productId: number
  productName: string
  onClose: () => void
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  productId,
  productName,
  onClose
}) => {
  const { priceHistory, loading, error, fetchPriceHistory } = usePricing()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    fetchPriceHistory(productId, currentPage, pageSize)
  }, [fetchPriceHistory, productId, currentPage])

  const renderPriceChange = (history: PriceHistoryDto) => {
    const changes = []

    // Purchase Price Change
    if (history.oldPurchasePrice !== undefined || history.newPurchasePrice !== undefined) {
      const oldPrice = history.oldPurchasePrice
      const newPrice = history.newPurchasePrice
      
      if (oldPrice !== newPrice) {
        changes.push({
          type: 'purchase',
          label: 'Giá mua',
          oldValue: oldPrice,
          newValue: newPrice,
          isIncrease: (newPrice ?? 0) > (oldPrice ?? 0)
        })
      }
    }

    // Selling Price Change
    if (history.oldSellingPrice !== undefined || history.newSellingPrice !== undefined) {
      const oldPrice = history.oldSellingPrice
      const newPrice = history.newSellingPrice
      
      if (oldPrice !== newPrice) {
        changes.push({
          type: 'selling',
          label: 'Giá bán',
          oldValue: oldPrice,
          newValue: newPrice,
          isIncrease: (newPrice ?? 0) > (oldPrice ?? 0)
        })
      }
    }

    return changes
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải lịch sử giá...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Lịch sử thay đổi giá</h2>
              <p className="text-gray-600">{productName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="text-red-800">❌ {error}</div>
            </div>
          )}

          {/* History Timeline */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {priceHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có lịch sử thay đổi giá</p>
              </div>
            ) : (
              <div className="space-y-4">
                {priceHistory.map((history) => {
                  const changes = renderPriceChange(history)
                  
                  return (
                    <div key={history.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      {/* Header with date and user */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(history.changedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {history.changedBy}
                          </span>
                        </div>
                      </div>

                      {/* Price Changes */}
                      <div className="space-y-2">
                        {changes.map((change, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                            <div className="flex items-center gap-3">
                              <Badge variant={change.type === 'purchase' ? 'info' : 'primary'}>
                                {change.label}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">
                                  {change.oldValue ? formatCurrency(change.oldValue) : 'Chưa có'}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="font-medium">
                                  {change.newValue ? formatCurrency(change.newValue) : 'Chưa có'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {change.isIncrease ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`text-sm font-medium ${
                                change.isIncrease ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {change.isIncrease ? 'Tăng' : 'Giảm'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Reason */}
                      {history.reason && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Lý do: </span>
                            <span className="text-gray-600 italic">"{history.reason}"</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {priceHistory.length >= pageSize && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trang trước
              </Button>
              
              <span className="text-sm text-gray-600">
                Trang {currentPage}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={priceHistory.length < pageSize}
              >
                Trang sau
              </Button>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-6 border-t">
            <Button onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

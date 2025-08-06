import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { GenericModal } from '@/components/common'
import { Edit, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import type { ProductStock, StockAdjustment } from '@/types'

interface StockAdjustmentModalProps {
  isOpen: boolean
  onClose: () => void
  stock: ProductStock | null
  onAdjust: (adjustment: StockAdjustment) => Promise<boolean>
  adjusting?: boolean
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  stock,
  onAdjust,
  adjusting = false
}) => {
  const [adjustmentType, setAdjustmentType] = useState<'Increase' | 'Decrease'>('Increase')
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('')
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [adjustmentNotes, setAdjustmentNotes] = useState('')

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setAdjustmentType('Increase')
    setAdjustmentQuantity('')
    setAdjustmentReason('')
    setAdjustmentNotes('')
  }

  const handleSubmit = async () => {
    if (!stock || !adjustmentQuantity || !adjustmentReason.trim()) {
      return
    }

    const adjustmentData: StockAdjustment = {
      productId: stock.productId,
      adjustmentType,
      quantity: parseInt(adjustmentQuantity),
      reason: adjustmentReason.trim(),
      notes: adjustmentNotes.trim() || undefined
    }

    const success = await onAdjust(adjustmentData)
    if (success) {
      onClose()
    }
  }

  const calculateNewStock = () => {
    if (!stock || !adjustmentQuantity) return stock?.currentStock || 0
    
    const quantity = parseInt(adjustmentQuantity)
    switch (adjustmentType) {
      case 'Increase':
        return stock.currentStock + quantity
      case 'Decrease':
        return Math.max(0, stock.currentStock - quantity)
      default:
        return stock.currentStock
    }
  }

  const reasonOptions = [
    'Nhập hàng mới',
    'Xuất bán',
    'Hàng hỏng/hết hạn',
    'Kiểm kê định kỳ',
    'Điều chỉnh lỗi',
    'Trả hàng nhà cung cấp',
    'Chuyển kho',
    'Khác'
  ]

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Điều chỉnh tồn kho"
      size="md"
      variant="info"
      icon={<Edit className="w-5 h-5" />}
    >
      <div className="space-y-6">
        {/* Enhanced Product Info */}
        {stock && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{stock.productName}</h3>
                <p className="text-sm text-gray-600">SKU: {stock.sku}</p>
                <p className="text-sm font-medium text-blue-700">
                  Tồn kho hiện tại: <span className="text-xl">{stock.currentStock}</span> {stock.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Adjustment Type */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Loại điều chỉnh
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAdjustmentType('Increase')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                adjustmentType === 'Increase'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Tăng tồn kho</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setAdjustmentType('Decrease')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                adjustmentType === 'Decrease'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingDown className="w-5 h-5" />
                <span className="font-medium">Giảm tồn kho</span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Quantity Input */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Số lượng điều chỉnh
          </label>
          <Input
            type="number"
            value={adjustmentQuantity}
            onChange={(e) => setAdjustmentQuantity(e.target.value)}
            placeholder="Nhập số lượng..."
            min="0"
            className="text-lg font-medium text-center"
          />
          {adjustmentQuantity && (
            <div className={`p-3 rounded-lg border-2 ${
              adjustmentType === 'Increase' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Tồn kho sau điều chỉnh:</span>
                <span className={`text-xl font-bold ${
                  adjustmentType === 'Increase' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {calculateNewStock()} {stock?.unit}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Reason Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Lý do điều chỉnh <span className="text-red-500">*</span>
          </label>
          <select
            value={adjustmentReason}
            onChange={(e) => setAdjustmentReason(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Chọn lý do...</option>
            {reasonOptions.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        {/* Enhanced Notes */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Ghi chú thêm (tùy chọn)
          </label>
          <textarea
            value={adjustmentNotes}
            onChange={(e) => setAdjustmentNotes(e.target.value)}
            placeholder="Thêm ghi chú chi tiết về việc điều chỉnh..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
        </div>

        {/* Warning for stock decrease */}
        {adjustmentType === 'Decrease' && adjustmentQuantity && parseInt(adjustmentQuantity) > (stock?.currentStock || 0) && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">Cảnh báo</h4>
                <p className="text-sm text-red-700">
                  Số lượng giảm lớn hơn tồn kho hiện tại. Tồn kho sẽ được đặt về 0.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={adjusting}
            className="px-6 py-2"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!adjustmentQuantity || !adjustmentReason.trim() || adjusting}
            loading={adjusting}
            className={`px-6 py-2 ${
              adjustmentType === 'Increase' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {adjusting ? 'Đang xử lý...' : `${adjustmentType === 'Increase' ? 'Tăng' : 'Giảm'} tồn kho`}
          </Button>
        </div>
      </div>
    </GenericModal>
  )
}

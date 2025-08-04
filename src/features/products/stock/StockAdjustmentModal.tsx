import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { GenericModal } from '@/components/common'
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
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease' | 'set'>('increase')
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('')
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [adjustmentNotes, setAdjustmentNotes] = useState('')

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setAdjustmentType('increase')
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
      case 'increase':
        return stock.currentStock + quantity
      case 'decrease':
        return Math.max(0, stock.currentStock - quantity)
      case 'set':
        return quantity
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

        {/* Adjustment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại điều chỉnh
          </label>
          <select
            value={adjustmentType}
            onChange={(e) => setAdjustmentType(e.target.value as typeof adjustmentType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="increase">Tăng tồn kho</option>
            <option value="decrease">Giảm tồn kho</option>
            <option value="set">Đặt tồn kho</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng {adjustmentType === 'set' ? 'mới' : 'điều chỉnh'}
          </label>
          <Input
            type="number"
            value={adjustmentQuantity}
            onChange={(e) => setAdjustmentQuantity(e.target.value)}
            placeholder="Nhập số lượng..."
            min="0"
          />
          {adjustmentQuantity && (
            <p className="mt-1 text-sm text-gray-600">
              Tồn kho sau điều chỉnh: <span className="font-medium">{calculateNewStock()} {stock?.unit}</span>
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do điều chỉnh *
          </label>
          <select
            value={adjustmentReason}
            onChange={(e) => setAdjustmentReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Chọn lý do...</option>
            {reasonOptions.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={adjustmentNotes}
            onChange={(e) => setAdjustmentNotes(e.target.value)}
            placeholder="Ghi chú thêm..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={adjusting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!adjustmentQuantity || !adjustmentReason.trim() || adjusting}
            loading={adjusting}
          >
            Điều chỉnh tồn kho
          </Button>
        </div>
      </div>
    </GenericModal>
  )
}

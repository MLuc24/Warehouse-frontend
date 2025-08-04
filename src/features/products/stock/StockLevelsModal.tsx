import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { GenericModal } from '@/components/common'
import type { ProductStock, StockLevelsUpdate } from '@/types'

interface StockLevelsModalProps {
  isOpen: boolean
  onClose: () => void
  stock: ProductStock | null
  onUpdate: (data: StockLevelsUpdate) => Promise<boolean>
  updating?: boolean
}

export const StockLevelsModal: React.FC<StockLevelsModalProps> = ({
  isOpen,
  onClose,
  stock,
  onUpdate,
  updating = false
}) => {
  const [minStockLevel, setMinStockLevel] = useState('')
  const [maxStockLevel, setMaxStockLevel] = useState('')

  useEffect(() => {
    if (isOpen && stock) {
      setMinStockLevel(stock.minStockLevel?.toString() || '')
      setMaxStockLevel(stock.maxStockLevel?.toString() || '')
    }
  }, [isOpen, stock])

  useEffect(() => {
    if (!isOpen) {
      setMinStockLevel('')
      setMaxStockLevel('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!stock || !minStockLevel) {
      return
    }

    const stockLevelsData: StockLevelsUpdate = {
      minStockLevel: parseInt(minStockLevel),
      maxStockLevel: maxStockLevel ? parseInt(maxStockLevel) : undefined
    }

    const success = await onUpdate(stockLevelsData)
    if (success) {
      onClose()
    }
  }

  const isValidForm = () => {
    const min = parseInt(minStockLevel)
    const max = maxStockLevel ? parseInt(maxStockLevel) : null
    
    if (!minStockLevel || min < 0) return false
    if (max !== null && (max < 0 || max <= min)) return false
    
    return true
  }

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài đặt mức tồn kho"
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

        {/* Min Stock Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mức tồn tối thiểu *
          </label>
          <Input
            type="number"
            value={minStockLevel}
            onChange={(e) => setMinStockLevel(e.target.value)}
            placeholder="Nhập mức tồn tối thiểu..."
            min="0"
          />
          <p className="mt-1 text-xs text-gray-500">
            Khi tồn kho xuống dưới mức này, hệ thống sẽ cảnh báo cần đặt hàng lại
          </p>
        </div>

        {/* Max Stock Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mức tồn tối đa (tùy chọn)
          </label>
          <Input
            type="number"
            value={maxStockLevel}
            onChange={(e) => setMaxStockLevel(e.target.value)}
            placeholder="Nhập mức tồn tối đa..."
            min="0"
          />
          <p className="mt-1 text-xs text-gray-500">
            Mức tồn tối đa để tránh tồn kho quá nhiều. Để trống nếu không giới hạn
          </p>
        </div>

        {/* Validation Warning */}
        {maxStockLevel && parseInt(maxStockLevel) <= parseInt(minStockLevel || '0') && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Mức tồn tối đa phải lớn hơn mức tồn tối thiểu
            </p>
          </div>
        )}

        {/* Current Thresholds Info */}
        {stock && (stock.minStockLevel || stock.maxStockLevel) && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Cài đặt hiện tại:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              {stock.minStockLevel && (
                <p>Mức tối thiểu: {stock.minStockLevel} {stock.unit}</p>
              )}
              {stock.maxStockLevel && (
                <p>Mức tối đa: {stock.maxStockLevel} {stock.unit}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updating}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidForm() || updating}
            loading={updating}
          >
            Cập nhật điểm đặt hàng
          </Button>
        </div>
      </div>
    </GenericModal>
  )
}

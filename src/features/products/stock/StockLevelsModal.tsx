import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { GenericModal } from '@/components/common'
import { Settings, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'
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
      variant="warning"
      icon={<Settings className="w-5 h-5" />}
    >
      <div className="space-y-6">
        {/* Enhanced Product Info */}
        {stock && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{stock.productName}</h3>
                <p className="text-sm text-gray-600">SKU: {stock.sku}</p>
                <p className="text-sm font-medium text-orange-700">
                  Tồn kho hiện tại: <span className="text-xl">{stock.currentStock}</span> {stock.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Min Stock Level */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span>Mức tồn tối thiểu <span className="text-red-500">*</span></span>
          </label>
          <Input
            type="number"
            value={minStockLevel}
            onChange={(e) => setMinStockLevel(e.target.value)}
            placeholder="Nhập mức tồn tối thiểu..."
            min="0"
            className="text-lg font-medium"
          />
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Khi tồn kho xuống dưới mức này, hệ thống sẽ cảnh báo cần đặt hàng lại</span>
            </p>
          </div>
        </div>

        {/* Enhanced Max Stock Level */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Mức tồn tối đa (tùy chọn)</span>
          </label>
          <Input
            type="number"
            value={maxStockLevel}
            onChange={(e) => setMaxStockLevel(e.target.value)}
            placeholder="Nhập mức tồn tối đa..."
            min="0"
            className="text-lg font-medium"
          />
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700">
              Mức tồn tối đa để tránh tồn kho quá nhiều. Để trống nếu không giới hạn
            </p>
          </div>
        </div>

        {/* Enhanced Validation Warning */}
        {maxStockLevel && parseInt(maxStockLevel) <= parseInt(minStockLevel || '0') && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="text-sm font-semibold text-red-800">Cảnh báo cài đặt</h4>
                <p className="text-sm text-red-700">
                  Mức tồn tối đa phải lớn hơn mức tồn tối thiểu
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Current Settings Info */}
        {stock && (stock.minStockLevel || stock.maxStockLevel) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Cài đặt hiện tại</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {stock.minStockLevel && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-medium text-gray-600">Tối thiểu</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{stock.minStockLevel} {stock.unit}</p>
                </div>
              )}
              {stock.maxStockLevel && (
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-gray-600">Tối đa</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{stock.maxStockLevel} {stock.unit}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={updating}
            className="px-6 py-2"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidForm() || updating}
            loading={updating}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white"
          >
            {updating ? 'Đang cập nhật...' : 'Cập nhật mức tồn kho'}
          </Button>
        </div>
      </div>
    </GenericModal>
  )
}

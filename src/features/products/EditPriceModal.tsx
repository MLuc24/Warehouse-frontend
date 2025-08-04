import React, { useState } from 'react'
import { X, Calculator } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { usePricing } from '@/hooks/usePricing'
import { formatCurrency } from '@/utils'
import type { ProductPricingDto, UpdateProductPricingDto } from '@/types/pricing'

interface EditPriceModalProps {
  product: ProductPricingDto
  onClose: () => void
  onSuccess: () => void
}

export const EditPriceModal: React.FC<EditPriceModalProps> = ({
  product,
  onClose,
  onSuccess
}) => {
  const { updatePricing, loading } = usePricing()
  const [purchasePrice, setPurchasePrice] = useState(
    product.purchasePrice?.toString() || ''
  )
  const [sellingPrice, setSellingPrice] = useState(
    product.sellingPrice?.toString() || ''
  )
  const [reason, setReason] = useState('')

  // Calculate profit margin and amount
  const calculateProfit = () => {
    const purchase = parseFloat(purchasePrice) || 0
    const selling = parseFloat(sellingPrice) || 0
    
    if (purchase <= 0 || selling <= 0) {
      return { margin: null, amount: null }
    }
    
    const amount = selling - purchase
    const margin = (amount / purchase) * 100
    
    return { margin, amount }
  }

  const profit = calculateProfit()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const purchasePriceValue = purchasePrice ? parseFloat(purchasePrice) : undefined
    const sellingPriceValue = sellingPrice ? parseFloat(sellingPrice) : undefined
    
    // Validation
    if (purchasePriceValue !== undefined && purchasePriceValue < 0) {
      alert('Giá mua không được âm')
      return
    }
    
    if (sellingPriceValue !== undefined && sellingPriceValue < 0) {
      alert('Giá bán không được âm')
      return
    }

    const data: UpdateProductPricingDto = {
      productId: product.productId,
      purchasePrice: purchasePriceValue,
      sellingPrice: sellingPriceValue,
      priceChangeReason: reason.trim() || undefined
    }

    try {
      await updatePricing(data)
      alert('Cập nhật giá thành công!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating price:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Chỉnh sửa giá sản phẩm</h2>
              <p className="text-gray-600">{product.productName}</p>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Values Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-3">Giá hiện tại</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Giá mua:</span>
                  <div className="font-medium">
                    {product.purchasePrice ? formatCurrency(product.purchasePrice) : 'Chưa có'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Giá bán:</span>
                  <div className="font-medium">
                    {product.sellingPrice ? formatCurrency(product.sellingPrice) : 'Chưa có'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Lợi nhuận:</span>
                  <div className="font-medium">
                    {product.profitAmount ? formatCurrency(product.profitAmount) : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Tỷ suất:</span>
                  <div className="font-medium">
                    {product.profitMargin ? `${product.profitMargin.toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá mua (VND)
                </label>
                <Input
                  type="number"
                  step="1000"
                  min="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Nhập giá mua"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá bán (VND)
                </label>
                <Input
                  type="number"
                  step="1000"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="Nhập giá bán"
                />
              </div>
            </div>

            {/* Profit Calculation Preview */}
            {(purchasePrice || sellingPrice) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <h3 className="font-medium text-blue-800">Tính toán lợi nhuận</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Lợi nhuận:</span>
                    <div className="font-medium text-blue-900">
                      {profit.amount !== null ? (
                        <span className={profit.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(profit.amount)}
                        </span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700">Tỷ suất:</span>
                    <div className="font-medium text-blue-900">
                      {profit.margin !== null ? (
                        <span className={profit.margin >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {profit.margin.toFixed(1)}%
                        </span>
                      ) : 'N/A'}
                    </div>
                  </div>
                </div>
                {profit.margin !== null && profit.margin < 0 && (
                  <div className="mt-2 text-xs text-red-600">
                    ⚠️ Cảnh báo: Sản phẩm này sẽ bị lỗ
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do thay đổi (tùy chọn)
              </label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Điều chỉnh theo thị trường"
                maxLength={500}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

import React, { useState } from 'react'
import { DollarSign, Percent, Calculator, Settings } from 'lucide-react'
import { Button, Input, Select, Badge } from '@/components/ui'
import { GenericModal } from '@/components/common'
import { usePricing } from '@/hooks/usePricing'
import { PriceUpdateType, type BulkUpdatePricingDto } from '@/types/pricing'
import { formatCurrency } from '@/utils'

interface BulkPriceUpdateProps {
  selectedProductIds: number[]
  selectedProductNames: string[]
  onClose: () => void
  onSuccess: () => void
}

const PRICE_UPDATE_OPTIONS = [
  { 
    value: PriceUpdateType.SetPurchasePrice, 
    label: 'Đặt giá mua cố định',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Đặt giá mua của tất cả sản phẩm về một giá trị cố định'
  },
  { 
    value: PriceUpdateType.SetSellingPrice, 
    label: 'Đặt giá bán cố định',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Đặt giá bán của tất cả sản phẩm về một giá trị cố định'
  },
  { 
    value: PriceUpdateType.IncreasePurchasePercent, 
    label: 'Tăng giá mua (%)',
    icon: <Percent className="w-4 h-4" />,
    description: 'Tăng giá mua theo phần trăm'
  },
  { 
    value: PriceUpdateType.DecreasePurchasePercent, 
    label: 'Giảm giá mua (%)',
    icon: <Percent className="w-4 h-4" />,
    description: 'Giảm giá mua theo phần trăm'
  },
  { 
    value: PriceUpdateType.IncreaseSellingPercent, 
    label: 'Tăng giá bán (%)',
    icon: <Percent className="w-4 h-4" />,
    description: 'Tăng giá bán theo phần trăm'
  },
  { 
    value: PriceUpdateType.DecreaseSellingPercent, 
    label: 'Giảm giá bán (%)',
    icon: <Percent className="w-4 h-4" />,
    description: 'Giảm giá bán theo phần trăm'
  },
  { 
    value: PriceUpdateType.SetMarginPercent, 
    label: 'Đặt tỷ suất lợi nhuận (%)',
    icon: <Calculator className="w-4 h-4" />,
    description: 'Đặt tỷ suất lợi nhuận mong muốn'
  }
]

export const BulkPriceUpdate: React.FC<BulkPriceUpdateProps> = ({
  selectedProductIds,
  selectedProductNames,
  onClose,
  onSuccess
}) => {
  const { updatePricingBulk, loading } = usePricing()
  const [updateType, setUpdateType] = useState<PriceUpdateType>(PriceUpdateType.SetSellingPrice)
  const [value, setValue] = useState('')
  const [reason, setReason] = useState('')
  const [previewResult, setPreviewResult] = useState<string>('')

  // Generate preview text based on update type and value
  const generatePreview = React.useCallback(() => {
    if (!value) return ''
    
    const numValue = parseFloat(value)
    
    if (isNaN(numValue)) return ''
    
    let preview = ''
    switch (updateType) {
      case PriceUpdateType.SetPurchasePrice:
        preview = `Tất cả ${selectedProductIds.length} sản phẩm sẽ có giá mua = ${formatCurrency(numValue)}`
        break
      case PriceUpdateType.SetSellingPrice:
        preview = `Tất cả ${selectedProductIds.length} sản phẩm sẽ có giá bán = ${formatCurrency(numValue)}`
        break
      case PriceUpdateType.IncreasePurchasePercent:
        preview = `Giá mua sẽ tăng ${numValue}% cho ${selectedProductIds.length} sản phẩm`
        break
      case PriceUpdateType.DecreasePurchasePercent:
        preview = `Giá mua sẽ giảm ${numValue}% cho ${selectedProductIds.length} sản phẩm`
        break
      case PriceUpdateType.IncreaseSellingPercent:
        preview = `Giá bán sẽ tăng ${numValue}% cho ${selectedProductIds.length} sản phẩm`
        break
      case PriceUpdateType.DecreaseSellingPercent:
        preview = `Giá bán sẽ giảm ${numValue}% cho ${selectedProductIds.length} sản phẩm`
        break
      case PriceUpdateType.SetMarginPercent:
        preview = `Tỷ suất lợi nhuận sẽ được đặt thành ${numValue}% cho ${selectedProductIds.length} sản phẩm`
        break
    }
    
    setPreviewResult(preview)
  }, [updateType, value, selectedProductIds.length])

  React.useEffect(() => {
    generatePreview()
  }, [generatePreview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!value || isNaN(parseFloat(value))) {
      alert('Vui lòng nhập giá trị hợp lệ')
      return
    }

    const data: BulkUpdatePricingDto = {
      productIds: selectedProductIds,
      updateType,
      value: parseFloat(value),
      priceChangeReason: reason.trim() || undefined
    }

    try {
      const result = await updatePricingBulk(data)
      
      let message = `Đã cập nhật thành công ${result.successCount} sản phẩm`
      if (result.failureCount > 0) {
        message += `\nCó ${result.failureCount} sản phẩm không thể cập nhật`
      }
      
      onSuccess()
      onClose()
      alert(message) // Show success message after closing modal
    } catch (error) {
      console.error('Error in bulk price update:', error)
      alert('Có lỗi xảy ra khi cập nhật giá hàng loạt!')
    }
  }

  const isPercentageType = updateType.includes('Percent')

  return (
    <GenericModal
      isOpen={true}
      onClose={onClose}
      title="Cập nhật giá hàng loạt"
      size="xl"
      icon={<Settings className="w-5 h-5" />}
      variant="warning"
    >
      {/* Selected products info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="info">{selectedProductIds.length} sản phẩm được chọn</Badge>
        </div>
        <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-md p-3">
          {selectedProductNames.map((name, index) => (
            <div key={index} className="text-sm text-gray-700 py-1">
              {index + 1}. {name}
            </div>
          ))}
        </div>
      </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Update Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại cập nhật
              </label>
              <Select
                value={updateType}
                onChange={(value) => setUpdateType(value as PriceUpdateType)}
                options={PRICE_UPDATE_OPTIONS.map(opt => ({
                  value: opt.value,
                  label: opt.label
                }))}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                {PRICE_UPDATE_OPTIONS.find(opt => opt.value === updateType)?.description}
              </p>
            </div>

            {/* Value Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá trị {isPercentageType ? '(%)' : '(VND)'}
              </label>
              <Input
                type="number"
                step={isPercentageType ? "0.1" : "1000"}
                min={isPercentageType ? "0" : "0"}
                max={isPercentageType ? "1000" : undefined}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={isPercentageType ? "Nhập phần trăm (VD: 10)" : "Nhập số tiền (VD: 50000)"}
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do thay đổi (tùy chọn)
              </label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Điều chỉnh giá theo thị trường"
                maxLength={500}
              />
            </div>

            {/* Preview */}
            {previewResult && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Xem trước kết quả:
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      {previewResult}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                disabled={loading || !value}
                className="min-w-[120px]"
              >
                {loading ? 'Đang xử lý...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
    </GenericModal>
  )
}

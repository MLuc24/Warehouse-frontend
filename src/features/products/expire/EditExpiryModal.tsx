import React, { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { Button, Input, Badge } from '@/components/ui'
import { GenericModal } from '@/components/common'
import { expiryService } from '@/services/expiry'
import type { ProductExpiryDto, UpdateProductExpiryDto } from '@/types/expiry'

interface EditExpiryModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductExpiryDto | null
}

export const EditExpiryModal: React.FC<EditExpiryModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<UpdateProductExpiryDto>({
    productId: 0,
    expiryDate: '',
    isPerishable: false,
    storageType: ''
  })

  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.productId,
        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
        isPerishable: product.isPerishable,
        storageType: product.storageType || ''
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      setLoading(true)
      const updateData = {
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined
      }
      
      await expiryService.updateExpiryInfo(updateData)
      onClose()
    } catch (error) {
      console.error('Error updating expiry info:', error)
      alert('Có lỗi xảy ra khi cập nhật thông tin hạn sử dụng!')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UpdateProductExpiryDto, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const storageTypes = [
    'Kho thường',
    'Kho lạnh',
    'Kho đông',
    'Nơi khô ráo',
    'Tránh ánh sáng',
    'Nhiệt độ phòng'
  ]

  if (!product) return null

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Cập nhật hạn sử dụng - ${product.productName}`}
      icon={<Calendar className="w-5 h-5" />}
      size="md"
      variant="default"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">SKU:</span>
            <span>{product.sku}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Danh mục:</span>
            <span>{product.category || 'Chưa phân loại'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Tồn kho:</span>
            <span>{product.currentStock} {product.unit || 'đơn vị'}</span>
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Hạn sử dụng
          </label>
          <Input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-gray-500 mt-1">
            Để trống nếu sản phẩm không có hạn sử dụng
          </p>
        </div>

        {/* Is Perishable */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPerishable}
              onChange={(e) => handleInputChange('isPerishable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Sản phẩm dễ hỏng
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Đánh dấu nếu sản phẩm cần bảo quản đặc biệt
          </p>
        </div>

        {/* Storage Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại lưu trữ
          </label>
          <select
            value={formData.storageType}
            onChange={(e) => handleInputChange('storageType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Chọn loại lưu trữ</option>
            {storageTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Current Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái hiện tại
          </label>
          <div className="flex items-center gap-2">
            <Badge 
              variant={
                product.status === 'Expired' ? 'danger' :
                product.status === 'ExpiringSoon' ? 'warning' :
                product.status === 'ExpiringWithinMonth' ? 'info' :
                'success'
              }
            >
              {product.status === 'Expired' ? 'Đã hết hạn' :
               product.status === 'ExpiringSoon' ? 'Sắp hết hạn' :
               product.status === 'ExpiringWithinMonth' ? 'Hết hạn trong tháng' :
               product.status === 'Fresh' ? 'Còn tốt' : 'Không có HSD'}
            </Badge>
            <span className="text-sm text-gray-600">
              ({product.daysUntilExpiry > 0 ? `${product.daysUntilExpiry} ngày` : 'Đã hết hạn'})
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </GenericModal>
  )
}

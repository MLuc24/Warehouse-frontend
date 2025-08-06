import React, { useState, useEffect, useMemo } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { formatCurrency } from '@/utils'
import type { GoodsReceipt, CreateGoodsReceiptDto, UpdateGoodsReceiptDto, GoodsReceiptDetail } from '@/types'
import { Plus, Search, Copy, Trash2, Package, X, Save } from 'lucide-react'

interface Product {
  productId: number
  productName: string
  productSku: string
  currentStock?: number
  unitPrice?: number
  category?: string
}

interface Supplier {
  supplierId: number
  supplierName: string
  email?: string
  phoneNumber?: string
}

interface UnifiedGoodsReceiptFormProps {
  onSubmit: (data: CreateGoodsReceiptDto | UpdateGoodsReceiptDto) => void
  onCancel: () => void
  goodsReceipt?: GoodsReceipt | null
  suppliers: Supplier[]
  products: Product[]
  isEdit?: boolean
  isSubmitting?: boolean
  variant?: 'modal' | 'inline'
}

interface FormDetail extends GoodsReceiptDetail {
  tempId: string
  errors?: {
    productId?: string
    quantity?: string
    unitPrice?: string
  }
}

const UnifiedGoodsReceiptForm: React.FC<UnifiedGoodsReceiptFormProps> = ({
  onSubmit,
  onCancel,
  goodsReceipt,
  suppliers,
  products,
  isEdit = false,
  isSubmitting = false,
  variant = 'inline'
}) => {
  const [formData, setFormData] = useState({
    supplierId: 0,
    notes: ''
  })
  const [details, setDetails] = useState<FormDetail[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [productSearch, setProductSearch] = useState('')

  // Filtered products for search
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products.slice(0, 5)
    return products.filter(product => 
      product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.productSku.toLowerCase().includes(productSearch.toLowerCase())
    ).slice(0, 5)
  }, [products, productSearch])

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = details.reduce((sum, detail) => sum + (detail.subtotal || 0), 0)
    const totalItems = details.reduce((sum, detail) => sum + detail.quantity, 0)
    const uniqueProducts = details.filter(detail => detail.productId > 0).length
    
    return {
      subtotal,
      totalItems,
      uniqueProducts,
      tax: subtotal * 0.1,
      total: subtotal * 1.1
    }
  }, [details])

  // Reset form when props change
  useEffect(() => {
    if (isEdit && goodsReceipt) {
      setFormData({
        supplierId: goodsReceipt.supplierId,
        notes: goodsReceipt.notes || ''
      })
      setDetails(goodsReceipt.details.map((detail, index) => ({
        ...detail,
        tempId: `existing-${index}`,
        productName: detail.productName || products.find(p => p.productId === detail.productId)?.productName || '',
        productSku: detail.productSku || products.find(p => p.productId === detail.productId)?.productSku || '',
        subtotal: detail.quantity * detail.unitPrice
      })))
    } else {
      setFormData({ supplierId: 0, notes: '' })
      setDetails([])
    }
    setErrors({})
    setProductSearch('')
  }, [isEdit, goodsReceipt, products])

  const addDetail = (productId?: number) => {
    const product = products.find(p => p.productId === productId)
    const newDetail: FormDetail = {
      tempId: `new-${Date.now()}`,
      productId: productId || 0,
      productName: product?.productName || '',
      productSku: product?.productSku || '',
      quantity: 1,
      unitPrice: product?.unitPrice || 0,
      subtotal: product?.unitPrice || 0
    }
    setDetails([...details, newDetail])
    setProductSearch('')
  }

  const updateDetail = (tempId: string, field: keyof FormDetail, value: string | number) => {
    setDetails(details.map(detail => {
      if (detail.tempId === tempId) {
        const updatedDetail = { ...detail, [field]: value }
        
        if (field === 'productId') {
          const product = products.find(p => p.productId === value)
          updatedDetail.productName = product?.productName || ''
          updatedDetail.productSku = product?.productSku || ''
          if (product?.unitPrice && updatedDetail.unitPrice === 0) {
            updatedDetail.unitPrice = product.unitPrice
          }
        }
        
        if (field === 'quantity' || field === 'unitPrice') {
          updatedDetail.subtotal = updatedDetail.quantity * updatedDetail.unitPrice
        }
        
        if (updatedDetail.errors) {
          delete updatedDetail.errors[field as keyof FormDetail['errors']]
        }
        
        return updatedDetail
      }
      return detail
    }))
  }

  const removeDetail = (tempId: string) => {
    setDetails(details.filter(detail => detail.tempId !== tempId))
  }

  const duplicateDetail = (tempId: string) => {
    const detail = details.find(d => d.tempId === tempId)
    if (detail) {
      const newDetail: FormDetail = {
        ...detail,
        tempId: `dup-${Date.now()}`,
        quantity: 1
      }
      newDetail.subtotal = newDetail.quantity * newDetail.unitPrice
      setDetails([...details, newDetail])
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.supplierId || formData.supplierId === 0) {
      newErrors.supplierId = 'Vui lòng chọn nhà cung cấp'
    }

    if (details.length === 0) {
      newErrors.details = 'Vui lòng thêm ít nhất một sản phẩm'
    }

    const updatedDetails = details.map(detail => {
      const detailErrors: FormDetail['errors'] = {}
      
      if (!detail.productId || detail.productId === 0) {
        detailErrors.productId = 'Vui lòng chọn sản phẩm'
      }
      if (!detail.quantity || detail.quantity <= 0) {
        detailErrors.quantity = 'Số lượng phải lớn hơn 0'
      }
      if (!detail.unitPrice || detail.unitPrice <= 0) {
        detailErrors.unitPrice = 'Đơn giá phải lớn hơn 0'
      }
      
      return {
        ...detail,
        errors: Object.keys(detailErrors).length > 0 ? detailErrors : undefined
      }
    })
    
    setDetails(updatedDetails)
    
    if (updatedDetails.some(detail => detail.errors && Object.keys(detail.errors).length > 0)) {
      newErrors.detailsValidation = 'Vui lòng kiểm tra lại thông tin sản phẩm'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData = {
      supplierId: formData.supplierId,
      notes: formData.notes,
      details: details.map(detail => ({
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice
      }))
    }

    if (isEdit && goodsReceipt) {
      onSubmit({
        goodsReceiptId: goodsReceipt.goodsReceiptId!,
        ...submitData
      } as UpdateGoodsReceiptDto)
    } else {
      onSubmit(submitData as CreateGoodsReceiptDto)
    }
  }

  const containerClass = variant === 'modal' 
    ? "space-y-6" 
    : "bg-white rounded-lg shadow-sm border border-gray-200"

  const headerContent = variant === 'inline' ? (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? `Sửa phiếu nhập #${goodsReceipt?.receiptNumber}` : 'Tạo phiếu nhập mới'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit ? `ID: #${goodsReceipt?.goodsReceiptId}` : 'Điền thông tin để tạo phiếu nhập kho'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật phiếu' : 'Tạo phiếu nhập')}
          </Button>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={isSubmitting}
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  ) : null

  const formContent = (
    <form onSubmit={handleSubmit} className={variant === 'inline' ? "p-6 space-y-6" : "space-y-6"}>
      {/* Basic Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Thông tin cơ bản</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supplier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhà cung cấp *
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData(prev => ({ ...prev, supplierId: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Chọn nhà cung cấp</option>
              {suppliers.map(supplier => (
                <option key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Nhập ghi chú cho phiếu nhập..."
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Product Selection */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-green-900">Chi tiết sản phẩm</h3>
          <Button 
            type="button" 
            onClick={() => addDetail()} 
            variant="secondary" 
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Product Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {productSearch && filteredProducts.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white">
              {filteredProducts.map(product => (
                <button
                  key={product.productId}
                  type="button"
                  onClick={() => addDetail(product.productId)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{product.productName}</div>
                      <div className="text-xs text-gray-500">SKU: {product.productSku}</div>
                    </div>
                    {product.unitPrice && (
                      <div className="text-sm font-medium">{formatCurrency(product.unitPrice)}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {errors.details && (
          <p className="mb-4 text-sm text-red-600">{errors.details}</p>
        )}

        {/* Product Details List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {details.map((detail, index) => (
            <div key={detail.tempId} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Product Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sản phẩm {index + 1}
                  </label>
                  <select
                    value={detail.productId}
                    onChange={(e) => updateDetail(detail.tempId, 'productId', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      detail.errors?.productId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value={0}>Chọn sản phẩm</option>
                    {products.map(product => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName} ({product.productSku})
                      </option>
                    ))}
                  </select>
                  {detail.errors?.productId && (
                    <p className="mt-1 text-xs text-red-600">{detail.errors.productId}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng
                  </label>
                  <Input
                    type="number"
                    value={detail.quantity}
                    onChange={(e) => updateDetail(detail.tempId, 'quantity', Number(e.target.value))}
                    min="1"
                    step="1"
                    className={detail.errors?.quantity ? 'border-red-300' : ''}
                  />
                  {detail.errors?.quantity && (
                    <p className="mt-1 text-xs text-red-600">{detail.errors.quantity}</p>
                  )}
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn giá
                  </label>
                  <Input
                    type="number"
                    value={detail.unitPrice}
                    onChange={(e) => updateDetail(detail.tempId, 'unitPrice', Number(e.target.value))}
                    min="0"
                    step="1000"
                    className={detail.errors?.unitPrice ? 'border-red-300' : ''}
                  />
                  {detail.errors?.unitPrice && (
                    <p className="mt-1 text-xs text-red-600">{detail.errors.unitPrice}</p>
                  )}
                </div>

                {/* Subtotal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành tiền
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium">
                    {formatCurrency(detail.subtotal || 0)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-1">
                  <Button
                    type="button"
                    onClick={() => duplicateDetail(detail.tempId)}
                    variant="secondary"
                    size="sm"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => removeDetail(detail.tempId)}
                    variant="danger"
                    size="sm"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {details.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {details.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tổng kết</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600">Số sản phẩm</div>
              <div className="text-lg font-bold text-blue-900">{totals.uniqueProducts}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600">Tổng số lượng</div>
              <div className="text-lg font-bold text-green-900">{totals.totalItems}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600">Tổng tiền</div>
              <div className="text-lg font-bold text-purple-900">{formatCurrency(totals.total)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions for Modal variant */}
      {variant === 'modal' && (
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" onClick={onCancel} variant="secondary">
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật phiếu nhập' : 'Tạo phiếu nhập')}
          </Button>
        </div>
      )}
    </form>
  )

  return (
    <div className={containerClass}>
      {headerContent}
      {formContent}
    </div>
  )
}

export default UnifiedGoodsReceiptForm

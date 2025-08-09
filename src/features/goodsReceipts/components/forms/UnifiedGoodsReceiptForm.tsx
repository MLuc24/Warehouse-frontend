import React, { useState, useEffect, useMemo } from 'react'
import { Button, Textarea } from '@/components/ui'
import { ProductDetailsSection } from '@/components/common'
import { formatCurrency } from '@/utils'
import { Package, X, Save, Mail, Phone, MapPin, DollarSign, ShoppingCart, Package2 } from 'lucide-react'
import type { GoodsReceipt, CreateGoodsReceiptDto, UpdateGoodsReceiptDto, GoodsReceiptDetail } from '@/types'

interface Product {
  productId: number
  productName: string
  productSku: string
  currentStock?: number
  unitPrice?: number
  purchasePrice?: number
  category?: string
  unit?: string
  imageUrl?: string
}

interface Supplier {
  supplierId: number
  supplierName: string
  email?: string
  phoneNumber?: string
  address?: string
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
  unit?: string
  subtotal: number
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
      setDetails(goodsReceipt.details.map((detail, index) => {
        const product = products.find(p => p.productId === detail.productId)
        return {
          ...detail,
          tempId: `existing-${index}`,
          unit: product?.unit || '',
          subtotal: detail.quantity * detail.unitPrice,
          errors: {}
        }
      }))
    } else {
      setFormData({ supplierId: 0, notes: '' })
      setDetails([])
    }
    setErrors({})
  }, [isEdit, goodsReceipt, products])

  // Product details management
  const addDetail = (productId?: number) => {
    const selectedProduct = productId ? products.find(p => p.productId === productId) : null
    const newDetail: FormDetail = {
      tempId: `new-${Date.now()}`,
      productId: productId || 0,
      productName: selectedProduct?.productName || '',
      productSku: selectedProduct?.productSku || '',
      quantity: 1,
      unitPrice: selectedProduct?.purchasePrice || selectedProduct?.unitPrice || 0,
      unit: selectedProduct?.unit || '',
      subtotal: selectedProduct?.purchasePrice || selectedProduct?.unitPrice || 0,
      errors: {}
    }
    setDetails([...details, newDetail])
    if (productId) {
      setProductSearch('')
    }
  }

  const removeDetail = (tempId: string) => {
    setDetails(details.filter(d => d.tempId !== tempId))
  }

  const duplicateDetail = (tempId: string) => {
    const originalDetail = details.find(d => d.tempId === tempId)
    if (originalDetail) {
      const duplicatedDetail: FormDetail = {
        ...originalDetail,
        tempId: `dup-${Date.now()}`
      }
      setDetails([...details, duplicatedDetail])
    }
  }

  const updateDetail = (tempId: string, field: string, value: string | number) => {
    setDetails(details.map(detail => {
      if (detail.tempId === tempId) {
        const updatedDetail = { ...detail }
        
        if (field === 'productId') {
          const selectedProduct = products.find(p => p.productId === Number(value))
          if (selectedProduct) {
            updatedDetail.productId = selectedProduct.productId
            updatedDetail.productName = selectedProduct.productName
            updatedDetail.productSku = selectedProduct.productSku
            updatedDetail.unit = selectedProduct.unit || ''
            updatedDetail.unitPrice = selectedProduct.purchasePrice || selectedProduct.unitPrice || 0
            updatedDetail.subtotal = updatedDetail.quantity * (selectedProduct.purchasePrice || selectedProduct.unitPrice || 0)
          }
        } else if (field === 'quantity') {
          updatedDetail.quantity = Number(value)
          updatedDetail.subtotal = Number(value) * updatedDetail.unitPrice
        } else if (field === 'unitPrice') {
          updatedDetail.unitPrice = Number(value)
          updatedDetail.subtotal = updatedDetail.quantity * Number(value)
        }
        
        return updatedDetail
      }
      return detail
    }))
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.supplierId) {
      newErrors.supplierId = 'Vui lòng chọn nhà cung cấp'
    }

    if (details.length === 0) {
      newErrors.detailsValidation = 'Vui lòng thêm ít nhất một sản phẩm'
    } else {
      details.forEach((detail) => {
        if (!detail.productId) {
          newErrors[`product-${detail.tempId}`] = 'Vui lòng chọn sản phẩm'
        }
        if (detail.quantity <= 0) {
          newErrors[`quantity-${detail.tempId}`] = 'Số lượng phải lớn hơn 0'
        }
        if (detail.unitPrice < 0) {
          newErrors[`unitPrice-${detail.tempId}`] = 'Đơn giá không được âm'
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      details: details.map(detail => ({
        productId: detail.productId,
        productName: detail.productName,
        productSku: detail.productSku,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice
      }))
    }

    onSubmit(submitData)
  }

  // Form Header Component (inline)
  const FormHeader = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-blue-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-md">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? `Sửa phiếu nhập #${goodsReceipt?.receiptNumber}` : 'Tạo phiếu nhập mới'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? `ID: #${goodsReceipt?.goodsReceiptId}` : 'Điền thông tin để tạo phiếu nhập kho'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 font-semibold px-6 py-2.5 shadow-md"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật phiếu' : 'Tạo phiếu nhập')}
          </Button>
          <Button 
            onClick={onCancel}
            variant="secondary"
            disabled={isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2.5 shadow-sm"
          >
            <X className="w-5 h-5 mr-2" />
            Hủy bỏ
          </Button>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
          <div className="flex items-center">
            <Package2 className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Sản phẩm</p>
              <p className="text-lg font-bold text-blue-700">{totals.uniqueProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
          <div className="flex items-center">
            <ShoppingCart className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Tổng số lượng</p>
              <p className="text-lg font-bold text-green-700">{totals.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Tổng tiền</p>
              <p className="text-lg font-bold text-purple-700">{formatCurrency(totals.total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Basic Info Section Component (inline)
  const BasicInfoSection = () => {
    const selectedSupplier = suppliers.find(s => s.supplierId === formData.supplierId)

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-blue-900">Thông tin cơ bản</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Nhà cung cấp *
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData(prev => ({ ...prev, supplierId: Number(e.target.value) }))}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 ${
                errors.supplierId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value={0}>Chọn nhà cung cấp</option>
              {suppliers.map(supplier => (
                <option key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <span className="w-3 h-3 mr-1">⚠️</span>
                {errors.supplierId}
              </p>
            )}
          </div>

          {/* Supplier Info Display */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Thông tin NCC</h4>
            {selectedSupplier ? (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{selectedSupplier.email || 'Chưa có email'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{selectedSupplier.phoneNumber || 'Chưa có SĐT'}</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">{selectedSupplier.address || 'Chưa có địa chỉ'}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chọn nhà cung cấp để xem thông tin</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Ghi chú
          </label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Nhập ghi chú cho phiếu nhập (tùy chọn)..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm resize-none"
          />
        </div>
      </div>
    )
  }

  // Summary Section Component (inline)
  const SummarySection = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-green-600 p-2 rounded-xl">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-green-900">Tổng kết</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <p className="text-sm text-gray-600 font-medium">Sản phẩm</p>
          <p className="text-2xl font-bold text-green-700">{totals.uniqueProducts}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <p className="text-sm text-gray-600 font-medium">Tổng SL</p>
          <p className="text-2xl font-bold text-blue-700">{totals.totalItems}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <p className="text-sm text-gray-600 font-medium">Tạm tính</p>
          <p className="text-xl font-bold text-gray-800">{formatCurrency(totals.subtotal)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 shadow-sm border border-green-200">
          <p className="text-sm text-green-700 font-semibold">Tổng cộng</p>
          <p className="text-2xl font-bold text-green-800">{formatCurrency(totals.total)}</p>
        </div>
      </div>
    </div>
  )

  const containerClass = variant === 'modal' 
    ? "space-y-6"
    : "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"

  return (
    <div className={containerClass}>
      {variant === 'inline' && <FormHeader />}
      
      <form onSubmit={handleSubmit} className={variant === 'inline' ? "p-8 space-y-8" : "space-y-6"}>
        {/* Basic Information */}
        <BasicInfoSection />

        {/* Product Selection */}
        <ProductDetailsSection
          details={details}
          products={products}
          productSearch={productSearch}
          filteredProducts={filteredProducts}
          errors={errors}
          onProductSearchChange={setProductSearch}
          onAddDetail={addDetail}
          onUpdateDetail={updateDetail}
          onRemoveDetail={removeDetail}
          onDuplicateDetail={duplicateDetail}
        />

        {/* Summary */}
        {details.length > 0 && <SummarySection />}

        {/* Validation Errors */}
        {errors.detailsValidation && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700 flex items-center">
              <span className="w-4 h-4 mr-2">⚠️</span>
              {errors.detailsValidation}
            </p>
          </div>
        )}

        {/* Submit Buttons for Modal variant */}
        {variant === 'modal' && (
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" onClick={onCancel} variant="secondary" disabled={isSubmitting}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật phiếu' : 'Tạo phiếu nhập')}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default UnifiedGoodsReceiptForm

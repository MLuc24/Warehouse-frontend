import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui'
import type { GoodsReceipt, CreateGoodsReceiptDto, UpdateGoodsReceiptDto, GoodsReceiptDetail } from '@/types'
import { FormHeader, BasicInfoSection, ProductDetailsSection, SummarySection } from './components'

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
          productName: detail.productName || product?.productName || '',
          productSku: detail.productSku || product?.productSku || '',
          unit: product?.unit,
          subtotal: detail.quantity * detail.unitPrice
        }
      }))
    } else {
      setFormData({ supplierId: 0, notes: '' })
      setDetails([])
    }
    setErrors({})
    setProductSearch('')
  }, [isEdit, goodsReceipt, products])

  const addDetail = (productId?: number) => {
    const product = products.find(p => p.productId === productId)
    const defaultPrice = product?.purchasePrice || product?.unitPrice || 0
    const newDetail: FormDetail = {
      tempId: `new-${Date.now()}`,
      productId: productId || 0,
      productName: product?.productName || '',
      productSku: product?.productSku || '',
      unit: product?.unit,
      quantity: 1,
      unitPrice: defaultPrice,
      subtotal: defaultPrice
    }
    setDetails([...details, newDetail])
    setProductSearch('')
  }

  const updateDetail = (tempId: string, field: string, value: string | number) => {
    setDetails(details.map(detail => {
      if (detail.tempId === tempId) {
        const updatedDetail = { ...detail, [field]: value }
        
        if (field === 'productId') {
          const product = products.find(p => p.productId === value)
          updatedDetail.productName = product?.productName || ''
          updatedDetail.productSku = product?.productSku || ''
          updatedDetail.unit = product?.unit
          // Use purchasePrice if available, fallback to unitPrice
          const defaultPrice = product?.purchasePrice || product?.unitPrice || 0
          if (updatedDetail.unitPrice === 0 || !updatedDetail.unitPrice) {
            updatedDetail.unitPrice = defaultPrice
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
    : "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"

  const headerContent = variant === 'inline' ? (
    <FormHeader
      isEdit={isEdit}
      goodsReceipt={goodsReceipt}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      totals={totals}
    />
  ) : null

  const formContent = (
    <form onSubmit={handleSubmit} className={variant === 'inline' ? "p-8 space-y-8" : "space-y-6"}>
      {/* Basic Information */}
      <BasicInfoSection
        formData={formData}
        suppliers={suppliers}
        errors={errors}
        onChange={(field, value) => {
          if (field === 'supplierId') {
            setFormData(prev => ({ ...prev, supplierId: value as number }))
          } else if (field === 'notes') {
            setFormData(prev => ({ ...prev, notes: value as string }))
          }
        }}
      />

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
      {details.length > 0 && (
        <SummarySection totals={totals} />
      )}

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
  )

  return (
    <div className={containerClass}>
      {headerContent}
      {formContent}
    </div>
  )
}

export default UnifiedGoodsReceiptForm

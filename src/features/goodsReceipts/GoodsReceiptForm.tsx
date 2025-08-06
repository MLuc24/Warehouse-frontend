import React, { useState, useEffect } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { GenericModal } from '@/components/common'
import { formatCurrency } from '@/utils'
import type { GoodsReceipt, CreateGoodsReceiptDto, UpdateGoodsReceiptDto, GoodsReceiptDetail } from '@/types'

interface Product {
  productId: number
  productName: string
  productSku: string
}

interface Supplier {
  supplierId: number
  supplierName: string
}

interface GoodsReceiptFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateGoodsReceiptDto | UpdateGoodsReceiptDto) => void
  goodsReceipt?: GoodsReceipt | null
  suppliers: Supplier[]
  products: Product[]
  isEdit?: boolean
}

interface FormDetail extends GoodsReceiptDetail {
  tempId: string
}

const GoodsReceiptForm: React.FC<GoodsReceiptFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goodsReceipt,
  suppliers,
  products,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    supplierId: 0,
    notes: ''
  })
  const [details, setDetails] = useState<FormDetail[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  // Reset form when modal opens/closes or goodsReceipt changes
  useEffect(() => {
    if (isOpen) {
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
        setFormData({
          supplierId: 0,
          notes: ''
        })
        setDetails([])
      }
      setErrors({})
    }
  }, [isOpen, isEdit, goodsReceipt, products])

  const addDetail = () => {
    const newDetail: FormDetail = {
      tempId: `new-${Date.now()}`,
      productId: 0,
      productName: '',
      productSku: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0
    }
    setDetails([...details, newDetail])
  }

  const removeDetail = (tempId: string) => {
    setDetails(details.filter(detail => detail.tempId !== tempId))
  }

  const updateDetail = (tempId: string, field: keyof FormDetail, value: string | number) => {
    setDetails(details.map(detail => {
      if (detail.tempId === tempId) {
        const updatedDetail = { ...detail, [field]: value }
        
        // Update product info when productId changes
        if (field === 'productId') {
          const product = products.find(p => p.productId === value)
          updatedDetail.productName = product?.productName || ''
          updatedDetail.productSku = product?.productSku || ''
        }
        
        // Recalculate subtotal when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedDetail.subtotal = updatedDetail.quantity * updatedDetail.unitPrice
        }
        
        return updatedDetail
      }
      return detail
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.supplierId || formData.supplierId === 0) {
      newErrors.supplierId = 'Vui lòng chọn nhà cung cấp'
    }

    if (details.length === 0) {
      newErrors.details = 'Vui lòng thêm ít nhất một sản phẩm'
    }

    details.forEach((detail, index) => {
      if (!detail.productId || detail.productId === 0) {
        newErrors[`detail-${index}-product`] = 'Vui lòng chọn sản phẩm'
      }
      if (!detail.quantity || detail.quantity <= 0) {
        newErrors[`detail-${index}-quantity`] = 'Số lượng phải lớn hơn 0'
      }
      if (!detail.unitPrice || detail.unitPrice <= 0) {
        newErrors[`detail-${index}-unitPrice`] = 'Đơn giá phải lớn hơn 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
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
      
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const totalAmount = details.reduce((sum, detail) => sum + (detail.subtotal || 0), 0)

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Sửa phiếu nhập kho' : 'Tạo phiếu nhập kho'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
            rows={3}
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Chi tiết sản phẩm *
            </label>
            <Button type="button" onClick={addDetail} variant="secondary" size="sm">
              Thêm sản phẩm
            </Button>
          </div>
          
          {errors.details && (
            <p className="mb-2 text-sm text-red-600">{errors.details}</p>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {details.map((detail, index) => (
              <div key={detail.tempId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Product Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sản phẩm
                    </label>
                    <select
                      value={detail.productId}
                      onChange={(e) => updateDetail(detail.tempId, 'productId', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Chọn sản phẩm</option>
                      {products.map(product => (
                        <option key={product.productId} value={product.productId}>
                          {product.productName} ({product.productSku})
                        </option>
                      ))}
                    </select>
                    {errors[`detail-${index}-product`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`detail-${index}-product`]}</p>
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
                    />
                    {errors[`detail-${index}-quantity`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`detail-${index}-quantity`]}</p>
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
                    />
                    {errors[`detail-${index}-unitPrice`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`detail-${index}-unitPrice`]}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeDetail(detail.tempId)}
                      variant="danger"
                      size="sm"
                      className="w-full"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>

                {/* Subtotal Display */}
                <div className="mt-2 text-right">
                  <span className="text-sm text-gray-600">
                    Thành tiền: <span className="font-medium">{formatCurrency(detail.subtotal || 0)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {details.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.</p>
            </div>
          )}
        </div>

        {/* Total Amount */}
        {details.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Tổng tiền:</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" onClick={onClose} variant="secondary">
            Hủy
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Tạo phiếu nhập')}
          </Button>
        </div>
      </form>
    </GenericModal>
  )
}

export default GoodsReceiptForm

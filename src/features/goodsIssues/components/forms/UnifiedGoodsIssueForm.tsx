import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { ProductDetailsSection as CommonProductDetailsSection } from '@/components/common'
import { Package, X, Save, Calendar, MapPin } from 'lucide-react'
import type { 
  GoodsIssue, 
  CreateUpdateGoodsIssueDto, 
  CreateUpdateGoodsIssueDetailDto,
  Customer, 
  Product 
} from '@/types'

interface UnifiedGoodsIssueFormProps {
  goodsIssue?: GoodsIssue | null
  customers: Customer[]
  products: Product[]
  onSubmit: (data: CreateUpdateGoodsIssueDto) => Promise<void>
  onCancel: () => void
  loading?: boolean
  variant?: 'modal' | 'inline'
}

interface FormDetail extends CreateUpdateGoodsIssueDetailDto {
  tempId: string // For tracking rows during editing
  productName?: string
  productSku?: string
  unit?: string
  availableStock?: number
  subtotal: number
  errors?: {
    productId?: string
    quantity?: string
    unitPrice?: string
  }
}

export const UnifiedGoodsIssueForm: React.FC<UnifiedGoodsIssueFormProps> = ({
  goodsIssue = null,
  customers,
  products,
  onSubmit,
  onCancel,
  loading = false,
  variant = 'inline'
}) => {
  // Form state
  const [formData, setFormData] = useState({
    customerId: goodsIssue?.customerId || undefined,
    issueDate: goodsIssue?.issueDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    requestedDeliveryDate: goodsIssue?.requestedDeliveryDate?.split('T')[0] || '',
    notes: goodsIssue?.notes || '',
    deliveryAddress: goodsIssue?.deliveryAddress || ''
  })
  
  const [details, setDetails] = useState<FormDetail[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [productSearchTerms, setProductSearchTerms] = useState<Record<string, string>>({})
  const [showProductSearches, setShowProductSearches] = useState<Record<string, boolean>>({})

  // Initialize details from existing goods issue
  useEffect(() => {
    if (goodsIssue?.details) {
      const initialDetails: FormDetail[] = goodsIssue.details.map((detail, index) => {
        const product = products.find(p => p.productId === detail.productId)
        return {
          tempId: `existing-${index}`,
          productId: detail.productId,
          productName: detail.productName || product?.productName || '',
          productSku: product?.sku || '',
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          unit: product?.unit || '',
          availableStock: product?.currentStock,
          subtotal: detail.quantity * detail.unitPrice,
          notes: detail.notes || ''
        }
      })
      setDetails(initialDetails)
      
      // Initialize search terms
      const searchTerms: Record<string, string> = {}
      initialDetails.forEach(detail => {
        searchTerms[detail.tempId] = detail.productName || ''
      })
      setProductSearchTerms(searchTerms)
    }
  }, [goodsIssue, products])

  // Filtered products for search
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products.slice(0, 5)
    return products.filter(product => 
      product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(productSearch.toLowerCase()))
    ).slice(0, 5)
  }, [products, productSearch])

  // Product details management
  const addDetail = (productId?: number) => {
    const selectedProduct = productId ? products.find(p => p.productId === productId) : null
    const newDetail: FormDetail = {
      tempId: `new-${Date.now()}`,
      productId: productId || 0,
      productName: selectedProduct?.productName || '',
      productSku: selectedProduct?.sku || '',
      quantity: 1,
      unitPrice: selectedProduct?.sellingPrice || 0,
      unit: selectedProduct?.unit || '',
      availableStock: selectedProduct?.currentStock,
      subtotal: selectedProduct?.sellingPrice || 0,
      notes: '',
      errors: {}
    }
    setDetails([...details, newDetail])
    if (productId) {
      setProductSearch('')
    }
  }

  const removeDetail = (tempId: string) => {
    setDetails(details.filter(d => d.tempId !== tempId))
    // Clean up search states
    const newSearchTerms = { ...productSearchTerms }
    const newShowSearches = { ...showProductSearches }
    delete newSearchTerms[tempId]
    delete newShowSearches[tempId]
    setProductSearchTerms(newSearchTerms)
    setShowProductSearches(newShowSearches)
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
            updatedDetail.productSku = selectedProduct.sku
            updatedDetail.unit = selectedProduct.unit || ''
            updatedDetail.unitPrice = selectedProduct.sellingPrice || 0
            updatedDetail.availableStock = selectedProduct.currentStock
            updatedDetail.subtotal = updatedDetail.quantity * (selectedProduct.sellingPrice || 0)
          }
        } else if (field === 'quantity') {
          updatedDetail.quantity = Number(value)
          updatedDetail.subtotal = updatedDetail.quantity * updatedDetail.unitPrice
        } else if (field === 'unitPrice') {
          updatedDetail.unitPrice = Number(value)
          updatedDetail.subtotal = updatedDetail.quantity * Number(value)
        } else {
          updatedDetail[field as keyof FormDetail] = value as never
        }
        
        return updatedDetail
      }
      return detail
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (details.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm')
      return
    }

    if (details.some(d => d.productId === 0)) {
      alert('Vui lòng chọn sản phẩm cho tất cả các dòng')
      return
    }

    if (details.some(d => d.quantity <= 0)) {
      alert('Số lượng phải lớn hơn 0')
      return
    }

    if (details.some(d => d.unitPrice < 0)) {
      alert('Đơn giá không được âm')
      return
    }

    // Check stock availability
    const insufficientStock = details.find(d => d.availableStock !== undefined && d.quantity > d.availableStock)
    if (insufficientStock) {
      alert(`Không đủ hàng tồn kho cho sản phẩm ${insufficientStock.productName}. Còn lại: ${insufficientStock.availableStock}`)
      return
    }

    const submitData: CreateUpdateGoodsIssueDto = {
      customerId: formData.customerId,
      issueDate: formData.issueDate || undefined,
      requestedDeliveryDate: formData.requestedDeliveryDate || undefined,
      notes: formData.notes || undefined,
      deliveryAddress: formData.deliveryAddress || undefined,
      details: details.map(detail => ({
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        notes: detail.notes
      }))
    }

    await onSubmit(submitData)
  }

  // Form Header Component (inline)
  const FormHeader = () => {
    const selectedCustomer = customers.find(c => c.customerId === formData.customerId)
    
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-100 border-b border-purple-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 p-3 rounded-xl shadow-md">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {goodsIssue ? `Sửa phiếu xuất #${goodsIssue.issueNumber}` : 'Tạo phiếu xuất mới'}
              </h1>
              <p className="text-gray-600 mt-1">
                {goodsIssue ? `ID: #${goodsIssue.goodsIssueId}` : 'Điền thông tin để tạo phiếu xuất kho'}
              </p>
              {selectedCustomer && (
                <p className="text-sm text-purple-700 font-medium">
                  Khách hàng: {selectedCustomer.customerName}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white border-0 font-semibold px-6 py-2.5 shadow-md"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Đang xử lý...' : (goodsIssue ? 'Cập nhật phiếu' : 'Tạo phiếu xuất')}
            </Button>
            <Button 
              onClick={onCancel}
              variant="secondary"
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2.5 shadow-sm"
            >
              <X className="w-5 h-5 mr-2" />
              Hủy bỏ
            </Button>
          </div>
        </div>
        
      </div>
    )
  }

  // Basic Info Section Component (inline)
  const BasicInfoSection = () => {
    const selectedCustomer = customers.find(c => c.customerId === formData.customerId)

    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-purple-600 p-2 rounded-xl">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-purple-900">Thông tin cơ bản</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer & Date Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Khách hàng
              </label>
              <select
                value={formData.customerId || ''}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
              >
                <option value="">Chọn khách hàng (tùy chọn)</option>
                {customers.map(customer => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Ngày xuất *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                    required
                  />
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Ngày giao dự kiến
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.requestedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, requestedDeliveryDate: e.target.value })}
                    min={formData.issueDate}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                  />
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Địa chỉ giao hàng
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                  placeholder="Nhập địa chỉ giao hàng"
                />
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>

          {/* Customer Info Display */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Thông tin khách hàng</h4>
            {selectedCustomer ? (
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">{selectedCustomer.customerName}</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>📧 {selectedCustomer.email || 'Chưa có email'}</p>
                    <p>📞 {selectedCustomer.phoneNumber || 'Chưa có SĐT'}</p>
                    <p>📍 {selectedCustomer.address || 'Chưa có địa chỉ'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Chọn khách hàng để xem thông tin</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Ghi chú
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Nhập ghi chú cho phiếu xuất (tùy chọn)..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm resize-none"
          />
        </div>
      </div>
    )
  }

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
        <CommonProductDetailsSection
          details={details}
          products={products.map(p => ({ ...p, productSku: p.sku || '' }))}
          productSearch={productSearch}
          filteredProducts={filteredProducts.map(p => ({ ...p, productSku: p.sku || '' }))}
          errors={{}}
          onProductSearchChange={setProductSearch}
          onAddDetail={addDetail}
          onUpdateDetail={updateDetail}
          onRemoveDetail={removeDetail}
          onDuplicateDetail={duplicateDetail}
          title="Chi tiết sản phẩm xuất"
          subtitle="Thêm sản phẩm xuất"
          colorScheme="purple"
        />

        {/* Submit Buttons for Modal variant */}
        {variant === 'modal' && (
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" onClick={onCancel} variant="secondary" disabled={loading}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={loading || details.length === 0}>
              {loading ? 'Đang xử lý...' : (goodsIssue ? 'Cập nhật' : 'Tạo phiếu xuất')}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default UnifiedGoodsIssueForm

import React, { useState, useEffect, useRef } from 'react'
import { Button, Input } from '@/components/ui'
import { formatCurrency } from '@/utils'
import { Plus, Search, Copy, Trash2, Package, ChevronUp } from 'lucide-react'

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

interface FormDetail {
  tempId: string
  productId: number
  productName?: string
  productSku?: string
  quantity: number
  unitPrice: number
  unit?: string
  subtotal: number
  errors?: {
    productId?: string
    quantity?: string
    unitPrice?: string
  }
}

interface ProductDetailsSectionProps {
  details: FormDetail[]
  products: Product[]
  productSearch: string
  filteredProducts: Product[]
  errors: Record<string, string>
  onProductSearchChange: (value: string) => void
  onAddDetail: (productId?: number) => void
  onUpdateDetail: (tempId: string, field: string, value: string | number) => void
  onRemoveDetail: (tempId: string) => void
  onDuplicateDetail: (tempId: string) => void
}

export const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  details,
  products,
  productSearch,
  filteredProducts,
  errors,
  onProductSearchChange,
  onAddDetail,
  onUpdateDetail,
  onRemoveDetail,
  onDuplicateDetail
}) => {
  // Custom Product Selector Component
  const ProductSelector = ({ 
    detail, 
    index, 
    onSelect 
  }: { 
    detail: FormDetail, 
    index: number, 
    onSelect: (productId: number) => void 
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
    const dropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const selectedProduct = products.find(p => p.productId === detail.productId)

    // Calculate dropdown position for portal rendering
    const calculateDropdownPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8, // 8px gap
          left: rect.left + window.scrollX,
          width: rect.width
        })
      }
    }

    // Handle dropdown toggle with position calculation
    const handleToggle = () => {
      if (!isOpen) {
        calculateDropdownPosition()
      }
      setIsOpen(!isOpen)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // Update position on scroll/resize
    useEffect(() => {
      if (isOpen) {
        const handlePositionUpdate = () => {
          calculateDropdownPosition()
        }
        
        window.addEventListener('scroll', handlePositionUpdate)
        window.addEventListener('resize', handlePositionUpdate)
        
        return () => {
          window.removeEventListener('scroll', handlePositionUpdate)
          window.removeEventListener('resize', handlePositionUpdate)
        }
      }
    }, [isOpen])

    return (
      <div className="relative pt-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sản phẩm {index + 1}
        </label>
        
        {/* Selected Product Display */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-between ${
            detail.errors?.productId ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          {selectedProduct ? (
            <div className="flex items-center space-x-3">
              {/* Product Image */}
              <div className="w-8 h-8 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {selectedProduct.imageUrl ? (
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 ${selectedProduct.imageUrl ? 'hidden' : ''}`}>
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {selectedProduct.productName}
                </div>
                <div className="text-xs text-gray-500">
                  SKU: {selectedProduct.productSku}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-gray-500">Chọn sản phẩm</span>
          )}
          <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Portal Dropdown Menu - Renders outside container constraints */}
        {isOpen && typeof document !== 'undefined' && (
          React.createElement(
            'div',
            {
              style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 99999
              }
            },
            <div 
              ref={dropdownRef}
              className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: Math.max(dropdownPosition.width, 300),
                pointerEvents: 'auto'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onSelect(0)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b text-gray-500 text-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-400" />
                  </div>
                  <span>Chọn sản phẩm</span>
                </div>
              </button>
              {products.map(product => (
                <button
                  key={product.productId}
                  type="button"
                  onClick={() => {
                    onSelect(product.productId)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b last:border-b-0 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {/* Product Image */}
                    <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 ${product.imageUrl ? 'hidden' : ''}`}>
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Product Info - Simplified */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {product.productName}
                      </div>
                      <div className="text-xs text-gray-500">SKU: {product.productSku}</div>
                    </div>
                    
                    {/* Price & Stock */}
                    <div className="text-right flex-shrink-0">
                      {(product.purchasePrice || product.unitPrice) && (
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(product.purchasePrice || product.unitPrice || 0)}
                        </div>
                      )}
                      {product.currentStock !== undefined && (
                        <div className="text-xs text-gray-500">Tồn: {product.currentStock}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {detail.errors?.productId && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <span className="w-3 h-3 mr-1">⚠️</span>
            {detail.errors.productId}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded-xl">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-green-900">Chi tiết sản phẩm</h3>
        </div>
        <Button 
          type="button" 
          onClick={() => onAddDetail()} 
          className="bg-green-600 hover:bg-green-700 border-0 px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-200"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Product Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU..."
            value={productSearch}
            onChange={(e) => onProductSearchChange(e.target.value)}
            className="pl-12 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
          />
        </div>
        
        {productSearch && filteredProducts.length > 0 && (
          <div className="mt-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-lg z-[9998] relative">
            {filteredProducts.map(product => (
              <button
                key={product.productId}
                type="button"
                onClick={() => onAddDetail(product.productId)}
                className="w-full px-4 py-3 text-left hover:bg-green-50 border-b last:border-b-0 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 ${product.imageUrl ? 'hidden' : ''}`}>
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Product Info - Simplified */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{product.productName}</div>
                    <div className="text-xs text-gray-500">SKU: {product.productSku}</div>
                  </div>
                  
                  {/* Price & Stock */}
                  <div className="text-right flex-shrink-0">
                    {(product.purchasePrice || product.unitPrice) && (
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(product.purchasePrice || product.unitPrice || 0)}
                      </div>
                    )}
                    {product.currentStock !== undefined && (
                      <div className="text-xs text-gray-500">Tồn: {product.currentStock}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {errors.details && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 flex items-center">
            <span className="w-4 h-4 mr-2">⚠️</span>
            {errors.details}
          </p>
        </div>
      )}

      {/* Product Details List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {details.map((detail, index) => (
          <div key={detail.tempId} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              {/* Product Selection */}
              <div className="md:col-span-3">
                <ProductSelector 
                  detail={detail} 
                  index={index} 
                  onSelect={(productId) => onUpdateDetail(detail.tempId, 'productId', productId)} 
                />
              </div>

              {/* Unit */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Đơn vị
                </label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
                  {detail.unit || 'N/A'}
                </div>
              </div>

              {/* Quantity */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số lượng
                </label>
                <Input
                  type="number"
                  value={detail.quantity}
                  onChange={(e) => onUpdateDetail(detail.tempId, 'quantity', Number(e.target.value))}
                  min="1"
                  step="1"
                  className={`rounded-xl transition-all duration-200 ${detail.errors?.quantity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                />
                {detail.errors?.quantity && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <span className="w-3 h-3 mr-1">⚠️</span>
                    {detail.errors.quantity}
                  </p>
                )}
              </div>

              {/* Unit Price */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Đơn giá
                </label>
                <Input
                  type="number"
                  value={detail.unitPrice}
                  onChange={(e) => onUpdateDetail(detail.tempId, 'unitPrice', Number(e.target.value))}
                  min="0"
                  step="1000"
                  className={`rounded-xl transition-all duration-200 ${detail.errors?.unitPrice ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                />
                {detail.errors?.unitPrice && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <span className="w-3 h-3 mr-1">⚠️</span>
                    {detail.errors.unitPrice}
                  </p>
                )}
              </div>

              {/* Subtotal */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thành tiền
                </label>
                <div className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-sm font-bold text-green-700">
                  {formatCurrency(detail.subtotal || 0)}
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex flex-col space-y-2">
                <Button
                  type="button"
                  onClick={() => onDuplicateDetail(detail.tempId)}
                  className="bg-blue-600 hover:bg-blue-700 border-0 p-2.5 rounded-xl shadow-sm"
                  size="sm"
                  title="Sao chép"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => onRemoveDetail(detail.tempId)}
                  className="bg-red-600 hover:bg-red-700 border-0 p-2.5 rounded-xl shadow-sm"
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
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
          <div className="bg-gray-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">Chưa có sản phẩm nào</p>
          <p className="text-gray-400 text-sm">Nhấn "Thêm sản phẩm" để bắt đầu thêm sản phẩm vào phiếu nhập</p>
        </div>
      )}
    </div>
  )
}

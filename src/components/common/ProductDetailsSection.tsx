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
  title?: string
  subtitle?: string
  colorScheme?: 'green' | 'blue' | 'purple' | 'orange'
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
  title = "Chi tiết sản phẩm",
  subtitle = "Thêm sản phẩm",
  colorScheme = 'green',
  onProductSearchChange,
  onAddDetail,
  onUpdateDetail,
  onRemoveDetail,
  onDuplicateDetail
}) => {
  // Color scheme configurations
  const colorConfigs = {
    green: {
      background: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200',
      iconBg: 'bg-green-600',
      titleText: 'text-green-900',
      button: 'bg-green-600 hover:bg-green-700',
      searchFocus: 'focus:ring-green-500',
      searchHover: 'hover:bg-green-50',
      subtotal: 'from-green-50 to-emerald-50 border-green-200 text-green-700',
      priceText: 'text-green-600'
    },
    blue: {
      background: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-600',
      titleText: 'text-blue-900',
      button: 'bg-blue-600 hover:bg-blue-700',
      searchFocus: 'focus:ring-blue-500',
      searchHover: 'hover:bg-blue-50',
      subtotal: 'from-blue-50 to-cyan-50 border-blue-200 text-blue-700',
      priceText: 'text-blue-600'
    },
    purple: {
      background: 'bg-gradient-to-br from-purple-50 to-violet-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-600',
      titleText: 'text-purple-900',
      button: 'bg-purple-600 hover:bg-purple-700',
      searchFocus: 'focus:ring-purple-500',
      searchHover: 'hover:bg-purple-50',
      subtotal: 'from-purple-50 to-violet-50 border-purple-200 text-purple-700',
      priceText: 'text-purple-600'
    },
    orange: {
      background: 'bg-gradient-to-br from-orange-50 to-amber-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-600',
      titleText: 'text-orange-900',
      button: 'bg-orange-600 hover:bg-orange-700',
      searchFocus: 'focus:ring-orange-500',
      searchHover: 'hover:bg-orange-50',
      subtotal: 'from-orange-50 to-amber-50 border-orange-200 text-orange-700',
      priceText: 'text-orange-600'
    }
  }

  const colors = colorConfigs[colorScheme]

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
      <div className="relative">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">
          Sản phẩm {index + 1}
        </label>
        
        {/* Selected Product Display */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className={`w-full px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-between text-sm ${
            detail.errors?.productId ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          {selectedProduct ? (
            <div className="flex items-center space-x-1.5 min-w-0">
              {/* Product Image */}
              <div className="w-6 h-6 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                  <Package className="w-3 h-3 text-gray-400" />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-xs text-gray-900 truncate">
                  {selectedProduct.productName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {selectedProduct.productSku}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Chọn sản phẩm</span>
          )}
          <ChevronUp className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ml-1 ${isOpen ? 'rotate-180' : ''}`} />
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
              className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
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
                className="w-full px-2.5 py-1.5 text-left hover:bg-gray-50 border-b text-gray-500 text-sm"
              >
                <div className="flex items-center space-x-1.5">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-3 h-3 text-gray-400" />
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
                  className={`w-full px-2.5 py-1.5 text-left ${colors.searchHover} border-b last:border-b-0 transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-1.5">
                    {/* Product Image */}
                    <div className="w-6 h-6 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                        <Package className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Product Info - Simplified */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs text-gray-900 truncate">
                        {product.productName}
                      </div>
                      <div className="text-xs text-gray-500">SKU: {product.productSku}</div>
                    </div>
                    
                    {/* Price & Stock */}
                    <div className="text-right flex-shrink-0">
                      {(product.purchasePrice || product.unitPrice) && (
                        <div className={`text-xs font-semibold ${colors.priceText}`}>
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
    <div className={`${colors.background} border ${colors.border} rounded-2xl p-4 shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className={`${colors.iconBg} p-2 rounded-xl`}>
            <Package className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-lg font-semibold ${colors.titleText}`}>{title}</h3>
        </div>
        <Button 
          type="button" 
          onClick={() => onAddDetail()} 
          className={`${colors.button} border-0 px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-200`}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          {subtitle}
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
            onChange={(e) => onProductSearchChange(e.target.value)}
            className={`pl-10 py-2.5 rounded-xl border-gray-300 focus:ring-2 ${colors.searchFocus} focus:border-transparent shadow-sm`}
          />
        </div>
        
        {productSearch && filteredProducts.length > 0 && (
          <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-lg z-[9998] relative">
            {filteredProducts.map(product => (
              <button
                key={product.productId}
                type="button"
                onClick={() => onAddDetail(product.productId)}
                className={`w-full px-3 py-2.5 text-left ${colors.searchHover} border-b last:border-b-0 transition-colors duration-200`}
              >
                <div className="flex items-center space-x-2">
                  {/* Product Image */}
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                      <Package className="w-5 h-5 text-gray-400" />
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
                      <div className={`text-sm font-semibold ${colors.priceText}`}>
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
        <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center">
            <span className="w-4 h-4 mr-1.5">⚠️</span>
            {errors.details}
          </p>
        </div>
      )}

      {/* Product Details List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {details.map((detail, index) => (
          <div key={detail.tempId} className="border border-gray-200 rounded-lg p-2.5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              {/* Product Selection - Reduced from col-span-3 to col-span-4 */}
              <div className="md:col-span-4">
                <ProductSelector 
                  detail={detail} 
                  index={index} 
                  onSelect={(productId) => onUpdateDetail(detail.tempId, 'productId', productId)} 
                />
              </div>

              {/* Quantity - Increased from col-span-1 to col-span-2 for better proportion */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Số lượng
                </label>
                <Input
                  type="number"
                  value={detail.quantity}
                  onChange={(e) => onUpdateDetail(detail.tempId, 'quantity', Number(e.target.value))}
                  min="1"
                  step="1"
                  className={`text-sm py-1.5 rounded-lg transition-all duration-200 ${detail.errors?.quantity ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                />
                {detail.errors?.quantity && (
                  <p className="mt-0.5 text-xs text-red-600">
                    {detail.errors.quantity}
                  </p>
                )}
              </div>

              {/* Unit - Reduced size */}
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  ĐV
                </label>
                <div className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 text-center">
                  {detail.unit || 'N/A'}
                </div>
              </div>

              {/* Unit Price - Increased from col-span-1 to col-span-2 */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Đơn giá
                </label>
                <Input
                  type="number"
                  value={detail.unitPrice}
                  onChange={(e) => onUpdateDetail(detail.tempId, 'unitPrice', Number(e.target.value))}
                  min="0"
                  step="1000"
                  className={`text-sm py-1.5 rounded-lg transition-all duration-200 ${detail.errors?.unitPrice ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                />
                {detail.errors?.unitPrice && (
                  <p className="mt-0.5 text-xs text-red-600">
                    {detail.errors.unitPrice}
                  </p>
                )}
              </div>

              {/* Subtotal - Increased from col-span-1 to col-span-2 */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                  Thành tiền
                </label>
                <div className={`px-2 py-1.5 bg-gradient-to-r ${colors.subtotal} rounded-lg text-xs font-bold text-center`}>
                  {formatCurrency(detail.subtotal || 0)}
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex flex-row md:flex-col space-x-1 md:space-x-0 md:space-y-1">
                <Button
                  type="button"
                  onClick={() => onDuplicateDetail(detail.tempId)}
                  className="bg-blue-600 hover:bg-blue-700 border-0 p-1.5 rounded-md shadow-sm flex-1 md:flex-none"
                  size="sm"
                  title="Sao chép"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  onClick={() => onRemoveDetail(detail.tempId)}
                  className="bg-red-600 hover:bg-red-700 border-0 p-1.5 rounded-md shadow-sm flex-1 md:flex-none"
                  size="sm"
                  title="Xóa"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {details.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="bg-gray-200 p-2.5 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm mb-1">Chưa có sản phẩm nào</p>
          <p className="text-gray-400 text-xs">Nhấn "{subtitle}" để bắt đầu thêm sản phẩm</p>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { formatCurrency } from '@/utils'
import type { GoodsReceipt } from '@/types'
import { Package, Hash, DollarSign } from 'lucide-react'

interface ProductDetailsTableProps {
  goodsReceipt: GoodsReceipt
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({ 
  goodsReceipt
}) => {
  const calculateSubtotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const totalQuantity = goodsReceipt.details.reduce((sum, detail) => sum + detail.quantity, 0)
  const totalValue = goodsReceipt.details.reduce(
    (sum, detail) => sum + calculateSubtotal(detail.quantity, detail.unitPrice),
    0
  )

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded-xl">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Chi tiết sản phẩm</h3>
            <p className="text-sm text-green-700 mt-1">
              Danh sách {goodsReceipt.details.length} sản phẩm trong phiếu nhập
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Đơn vị
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {goodsReceipt.details.map((detail, index) => {
              const subtotal = calculateSubtotal(detail.quantity, detail.unitPrice)
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  {/* Product Image */}
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {detail.imageUrl ? (
                        <img 
                          src={detail.imageUrl} 
                          alt={detail.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 ${detail.imageUrl ? 'hidden' : ''}`}>
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </td>
                  
                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {detail.productName}
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">
                        SKU: {detail.productSku}
                      </div>
                    </div>
                  </td>
                  
                  {/* Quantity */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {detail.quantity.toLocaleString()}
                    </span>
                  </td>
                  
                  {/* Unit */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {detail.unit || 'N/A'}
                    </span>
                  </td>
                  
                  {/* Unit Price */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900 font-medium">
                      {formatCurrency(detail.unitPrice)}
                    </span>
                  </td>
                  
                  {/* Subtotal */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                      {formatCurrency(subtotal)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr className="border-t-2 border-gray-300">
              <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                Tổng cộng
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-gray-900 bg-blue-100 px-3 py-1 rounded-lg">
                  {totalQuantity.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-right">
                <span className="text-lg font-bold text-green-600 bg-green-100 px-4 py-2 rounded-lg shadow-sm">
                  {formatCurrency(totalValue)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-blue-900">{goodsReceipt.details.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Tổng số lượng</p>
              <p className="text-2xl font-bold text-green-900">{totalQuantity.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Hash className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Tổng giá trị</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsTable

import React from 'react'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/utils'
import type { GoodsReceipt } from '@/types'
import { Package, Hash, DollarSign, Edit, Trash2 } from 'lucide-react'

interface ProductDetailsTableProps {
  goodsReceipt: GoodsReceipt
  onEditProduct?: (detail: GoodsReceipt['details'][0]) => void
  onDeleteProduct?: (detail: GoodsReceipt['details'][0]) => void
  canEdit?: boolean
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({ 
  goodsReceipt,
  onEditProduct,
  onDeleteProduct,
  canEdit = false
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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Chi tiết sản phẩm</h3>
        <p className="text-sm text-gray-600 mt-1">
          Danh sách {goodsReceipt.details.length} sản phẩm trong phiếu nhập
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành tiền
              </th>
              {canEdit && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {goodsReceipt.details.map((detail, index) => {
              const subtotal = calculateSubtotal(detail.quantity, detail.unitPrice)
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {detail.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {detail.productSku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {detail.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(detail.unitPrice)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(subtotal)}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onEditProduct?.(detail)}
                          className="flex items-center"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onDeleteProduct?.(detail)}
                          className="flex items-center"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr className="border-t-2 border-gray-200">
              <td colSpan={canEdit ? 2 : 2} className="px-6 py-4 text-sm font-medium text-gray-900">
                Tổng cộng
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                {totalQuantity.toLocaleString()}
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-right text-lg font-bold text-blue-600">
                {formatCurrency(totalValue)}
              </td>
              {canEdit && <td className="px-6 py-4"></td>}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Tổng sản phẩm</p>
              <p className="text-xl font-bold text-blue-900">{goodsReceipt.details.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Tổng số lượng</p>
              <p className="text-xl font-bold text-green-900">{totalQuantity.toLocaleString()}</p>
            </div>
            <Hash className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Tổng giá trị</p>
              <p className="text-xl font-bold text-purple-900">{formatCurrency(totalValue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsTable

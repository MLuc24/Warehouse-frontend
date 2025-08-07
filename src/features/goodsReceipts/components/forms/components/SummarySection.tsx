import React from 'react'
import { formatCurrency } from '@/utils'
import { DollarSign, Package, ShoppingCart, Calculator } from 'lucide-react'

interface SummarySectionProps {
  totals: {
    subtotal: number
    totalItems: number
    uniqueProducts: number
    tax: number
    total: number
  }
}

export const SummarySection: React.FC<SummarySectionProps> = ({ totals }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-amber-600 p-2 rounded-xl">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-amber-900">Tổng kết đơn hàng</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Sản phẩm</div>
              <div className="text-xl font-bold text-blue-600">{totals.uniqueProducts}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tổng số lượng</div>
              <div className="text-xl font-bold text-green-600">{totals.totalItems}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tạm tính</div>
              <div className="text-xl font-bold text-purple-600">{formatCurrency(totals.subtotal)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tổng cộng</div>
              <div className="text-xl font-bold text-orange-600">{formatCurrency(totals.total)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax breakdown */}
      <div className="mt-4 pt-4 border-t border-amber-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Thuế VAT (10%):</span>
          <span className="font-semibold text-gray-800">{formatCurrency(totals.tax)}</span>
        </div>
      </div>
    </div>
  )
}

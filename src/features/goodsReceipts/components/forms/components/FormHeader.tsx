import React from 'react'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/utils'
import { Package, X, Save } from 'lucide-react'
import type { GoodsReceipt } from '@/types'

interface FormHeaderProps {
  isEdit: boolean
  goodsReceipt?: GoodsReceipt | null
  onSubmit: (e: React.FormEvent) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
  totals: {
    uniqueProducts: number
    totalItems: number
    total: number
  }
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  isEdit,
  goodsReceipt,
  onSubmit,
  onCancel,
  isSubmitting,
  totals
}) => {
  return (
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
            onClick={(e) => onSubmit(e)} 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 font-semibold px-6 py-2.5 shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Đang xử lý...' : (isEdit ? 'Cập nhật phiếu' : 'Tạo phiếu nhập')}
          </Button>
          <button
            onClick={onCancel}
            className="p-2.5 text-gray-600 hover:text-gray-800 hover:bg-white/60 rounded-xl transition-all duration-200 border border-gray-200"
            disabled={isSubmitting}
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-blue-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{totals.uniqueProducts}</div>
          <div className="text-xs text-gray-600">Sản phẩm</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{totals.totalItems}</div>
          <div className="text-xs text-gray-600">Tổng số lượng</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(totals.total)}</div>
          <div className="text-xs text-gray-600">Tổng tiền</div>
        </div>
      </div>
    </div>
  )
}

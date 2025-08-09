import React from 'react'
import { formatCurrency, formatDate } from '@/utils'
import type { GoodsReceipt } from '@/types'
import { Package, User, Calendar, DollarSign, FileText, Building2 } from 'lucide-react'

interface GoodsReceiptInfoProps {
  goodsReceipt: GoodsReceipt
}

const getStatusDisplay = (status?: string) => {
  const statusMap = {
    'Draft': { 
      label: 'Nháp', 
      className: 'bg-gray-100 text-gray-700 border border-gray-300',
      dot: 'bg-gray-400'
    },
    'AwaitingApproval': { 
      label: 'Chờ phê duyệt', 
      className: 'bg-orange-50 text-orange-700 border border-orange-200',
      dot: 'bg-orange-400'
    },
    'Pending': { 
      label: 'Chờ nhà cung cấp', 
      className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      dot: 'bg-yellow-400'
    },
    'SupplierConfirmed': { 
      label: 'Nhà cung cấp đã xác nhận', 
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
      dot: 'bg-blue-400'
    },
    'Completed': { 
      label: 'Hoàn thành', 
      className: 'bg-green-50 text-green-700 border border-green-200',
      dot: 'bg-green-400'
    },
    'Cancelled': { 
      label: 'Đã hủy', 
      className: 'bg-red-50 text-red-700 border border-red-200',
      dot: 'bg-red-400'
    },
    'Rejected': { 
      label: 'Bị từ chối', 
      className: 'bg-red-50 text-red-700 border border-red-200',
      dot: 'bg-red-400'
    }
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || { 
    label: status || 'Không xác định', 
    className: 'bg-gray-50 text-gray-700 border border-gray-200',
    dot: 'bg-gray-400'
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${statusInfo.dot}`}></span>
      {statusInfo.label}
    </span>
  )
}

const GoodsReceiptInfo: React.FC<GoodsReceiptInfoProps> = ({ goodsReceipt }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Phiếu nhập #{goodsReceipt.receiptNumber || goodsReceipt.goodsReceiptId}
            </h2>
            <p className="text-sm text-gray-600">ID: #{goodsReceipt.goodsReceiptId}</p>
          </div>
        </div>
        
        <div className="text-right">
          {getStatusDisplay(goodsReceipt.status)}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Supplier */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2" />
            Nhà cung cấp
          </div>
          <p className="font-medium text-gray-900">
            {goodsReceipt.supplierName || 'N/A'}
          </p>
        </div>

        {/* Created By */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            Người tạo
          </div>
          <p className="font-medium text-gray-900">
            {goodsReceipt.createdByUserName || 'N/A'}
          </p>
        </div>

        {/* Receipt Date */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Ngày tạo
          </div>
          <p className="font-medium text-gray-900">
            {goodsReceipt.receiptDate ? formatDate(goodsReceipt.receiptDate) : 'N/A'}
          </p>
        </div>

        {/* Total Amount */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Tổng tiền
          </div>
          <p className="font-bold text-lg text-gray-900">
            {goodsReceipt.totalAmount ? formatCurrency(goodsReceipt.totalAmount) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Notes */}
      {goodsReceipt.notes && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FileText className="w-4 h-4 mr-2" />
            Ghi chú
          </div>
          <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
            {goodsReceipt.notes}
          </p>
        </div>
      )}

      {/* Product Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2" />
            Sản phẩm
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {goodsReceipt.details?.length || 0} sản phẩm
          </span>
        </div>
      </div>
    </div>
  )
}

export default GoodsReceiptInfo

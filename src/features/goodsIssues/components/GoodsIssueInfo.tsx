import React from 'react'
import { formatCurrency, formatDate } from '@/utils'
import type { GoodsIssue } from '@/types'
import { Package, User, Calendar, DollarSign, FileText, Building2, UserCheck } from 'lucide-react'

interface GoodsIssueInfoProps {
  goodsIssue: GoodsIssue
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
    'Approved': { 
      label: 'Đã phê duyệt', 
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
      dot: 'bg-blue-400'
    },
    'InPreparation': { 
      label: 'Đang chuẩn bị', 
      className: 'bg-purple-50 text-purple-700 border border-purple-200',
      dot: 'bg-purple-400'
    },
    'ReadyForDelivery': { 
      label: 'Sẵn sàng giao hàng', 
      className: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      dot: 'bg-cyan-400'
    },
    'InTransit': { 
      label: 'Đang vận chuyển', 
      className: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      dot: 'bg-yellow-400'
    },
    'Delivered': { 
      label: 'Đã giao hàng', 
      className: 'bg-teal-50 text-teal-700 border border-teal-200',
      dot: 'bg-teal-400'
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

export const GoodsIssueInfo: React.FC<GoodsIssueInfoProps> = ({ goodsIssue }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Phiếu xuất #{goodsIssue.issueNumber || goodsIssue.goodsIssueId}
            </h2>
            <p className="text-sm text-gray-600">ID: #{goodsIssue.goodsIssueId}</p>
          </div>
        </div>
        
        <div className="text-right">
          {getStatusDisplay(goodsIssue.status)}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customer */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <UserCheck className="w-4 h-4 mr-2" />
            Khách hàng
          </div>
          <p className="font-medium text-gray-900">
            {goodsIssue.customerName || 'N/A'}
          </p>
        </div>

        {/* Created By */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            Người tạo
          </div>
          <p className="font-medium text-gray-900">
            {goodsIssue.createdByUserName || 'N/A'}
          </p>
        </div>

        {/* Issue Date */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Ngày xuất
          </div>
          <p className="font-medium text-gray-900">
            {goodsIssue.issueDate ? formatDate(goodsIssue.issueDate) : 'N/A'}
          </p>
        </div>

        {/* Total Amount */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Tổng tiền
          </div>
          <p className="font-bold text-lg text-gray-900">
            {goodsIssue.totalAmount ? formatCurrency(goodsIssue.totalAmount) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      {goodsIssue.deliveryAddress && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Building2 className="w-4 h-4 mr-2" />
            Địa chỉ giao hàng
          </div>
          <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
            {goodsIssue.deliveryAddress}
          </p>
        </div>
      )}

      {/* Notes */}
      {goodsIssue.notes && (
        <div className={`${goodsIssue.deliveryAddress ? 'mt-4' : 'mt-6 pt-6 border-t border-gray-200'}`}>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FileText className="w-4 h-4 mr-2" />
            Ghi chú
          </div>
          <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
            {goodsIssue.notes}
          </p>
        </div>
      )}

      {/* Product Summary */}
      <div className={`${goodsIssue.deliveryAddress || goodsIssue.notes ? 'mt-4' : 'mt-6'} pt-6 border-t border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2" />
            Sản phẩm
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {goodsIssue.details?.length || 0} sản phẩm
          </span>
        </div>
      </div>
    </div>
  )
}

export default GoodsIssueInfo

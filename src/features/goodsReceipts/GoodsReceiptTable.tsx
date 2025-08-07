import React, { useState } from 'react'
import { formatCurrency, formatDate } from '@/utils'
import type { GoodsReceipt } from '@/types'
import { FileText, SortAsc, SortDesc, Package } from 'lucide-react'
import ActionButtons from './components/ActionButtons'

interface GoodsReceiptTableProps {
  goodsReceipts: GoodsReceipt[]
  loading?: boolean
  onRowClick?: (goodsReceipt: GoodsReceipt) => void
  onApprove?: (goodsReceiptId: number) => void
  onReject?: (goodsReceiptId: number) => void
  onComplete?: (goodsReceiptId: number) => void
  onResendEmail?: (goodsReceiptId: number) => void
  onCancel?: (goodsReceiptId: number) => void
  onResubmit?: (goodsReceiptId: number) => void
  onEdit?: (goodsReceipt: GoodsReceipt) => void
  currentUserRole?: string
}

type SortField = 'receiptNumber' | 'supplierName' | 'receiptDate' | 'totalAmount' | 'status'
type SortDirection = 'asc' | 'desc'

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
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['Draft']
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dot}`}></span>
      {statusInfo.label}
    </span>
  )
}

const GoodsReceiptTable: React.FC<GoodsReceiptTableProps> = ({
  goodsReceipts,
  loading = false,
  onRowClick,
  onApprove,
  onReject,
  onComplete,
  onResendEmail,
  onCancel,
  onResubmit,
  onEdit,
  currentUserRole = ''
}) => {
  const [sortField, setSortField] = useState<SortField>('receiptDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <SortAsc className="w-4 h-4 text-gray-400" />
    return sortDirection === 'asc' ? 
      <SortAsc className="w-4 h-4 text-blue-500" /> : 
      <SortDesc className="w-4 h-4 text-blue-500" />
  }

  const sortedGoodsReceipts = [...goodsReceipts].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date
    
    switch (sortField) {
      case 'receiptNumber':
        aValue = a.receiptNumber || ''
        bValue = b.receiptNumber || ''
        break
      case 'supplierName':
        aValue = a.supplierName || ''
        bValue = b.supplierName || ''
        break
      case 'receiptDate':
        aValue = new Date(a.receiptDate || 0)
        bValue = new Date(b.receiptDate || 0)
        break
      case 'totalAmount':
        aValue = a.totalAmount || 0
        bValue = b.totalAmount || 0
        break
      case 'status':
        aValue = a.status || ''
        bValue = b.status || ''
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (goodsReceipts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center h-64 text-center px-6">
          <Package className="w-12 h-12 text-gray-400 mb-4" />
          <div className="text-gray-500 text-lg mb-2">Không có phiếu nhập nào</div>
          <div className="text-gray-400 text-sm">Hãy tạo phiếu nhập đầu tiên của bạn</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('receiptNumber')}
              >
                <div className="flex items-center space-x-1">
                  <span>Số phiếu</span>
                  {getSortIcon('receiptNumber')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('supplierName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Nhà cung cấp</span>
                  {getSortIcon('supplierName')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('receiptDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Ngày tạo</span>
                  {getSortIcon('receiptDate')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <span>Người tạo</span>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tổng tiền</span>
                  {getSortIcon('totalAmount')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Trạng thái</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <span>Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedGoodsReceipts.map((goodsReceipt) => (
              <tr
                key={goodsReceipt.goodsReceiptId}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(goodsReceipt)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {goodsReceipt.receiptNumber || `GR-${goodsReceipt.goodsReceiptId}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {goodsReceipt.goodsReceiptId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {goodsReceipt.supplierName || 'Chưa xác định'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(goodsReceipt.receiptDate || new Date().toISOString())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {goodsReceipt.createdByUserName || 'Chưa xác định'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(goodsReceipt.totalAmount || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusDisplay(goodsReceipt.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionButtons
                      goodsReceipt={goodsReceipt}
                      currentUserRole={currentUserRole}
                      onApprove={onApprove}
                      onReject={onReject}
                      onComplete={onComplete}
                      onResendEmail={onResendEmail}
                      onCancel={onCancel}
                      onResubmit={onResubmit}
                      onEdit={onEdit}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GoodsReceiptTable

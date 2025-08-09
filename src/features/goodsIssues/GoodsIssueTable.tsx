import React, { useState } from 'react'
import { formatCurrency, formatDate } from '@/utils'
import type { GoodsIssue } from '@/types'
import { FileText, SortAsc, SortDesc, Truck } from 'lucide-react'

interface GoodsIssueTableProps {
  goodsIssues: GoodsIssue[]
  loading?: boolean
  onRowClick?: (goodsIssue: GoodsIssue) => void
}

type SortField = 'issueNumber' | 'customerName' | 'issueDate' | 'totalAmount' | 'status'
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
    'Approve': { 
      label: 'Đã phê duyệt', 
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
      dot: 'bg-blue-400'
    },
    'Approved': { 
      label: 'Đã phê duyệt', 
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
      dot: 'bg-blue-400'
    },
    'Preparing': { 
      label: 'Đang chuẩn bị', 
      className: 'bg-purple-50 text-purple-700 border border-purple-200',
      dot: 'bg-purple-400'
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
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['Draft']
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dot}`}></span>
      {statusInfo.label}
    </span>
  )
}

export const GoodsIssueTable: React.FC<GoodsIssueTableProps> = ({
  goodsIssues,
  loading = false,
  onRowClick
}) => {
  const [sortField, setSortField] = useState<SortField>('issueDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedGoodsIssues = [...goodsIssues].sort((a, b) => {
    let aValue: string | number = a[sortField] as string | number
    let bValue: string | number = b[sortField] as string | number

    // Handle special cases
    if (sortField === 'customerName') {
      aValue = a.customerName || ''
      bValue = b.customerName || ''
    } else if (sortField === 'issueDate') {
      aValue = new Date(a.issueDate || a.createdAt).getTime()
      bValue = new Date(b.issueDate || b.createdAt).getTime()
    } else if (sortField === 'totalAmount') {
      aValue = a.totalAmount || 0
      bValue = b.totalAmount || 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <SortAsc className="w-4 h-4 text-gray-400" />
    return sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (goodsIssues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-12 text-center">
          <Truck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phiếu xuất kho nào</h3>
          <p className="text-gray-500">Tạo phiếu xuất kho đầu tiên để bắt đầu quản lý xuất hàng</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('issueNumber')}
              >
                <div className="flex items-center gap-1">
                  Số phiếu
                  {renderSortIcon('issueNumber')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-1">
                  Khách hàng
                  {renderSortIcon('customerName')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('issueDate')}
              >
                <div className="flex items-center gap-1">
                  Ngày xuất
                  {renderSortIcon('issueDate')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center gap-1">
                  Tổng tiền
                  {renderSortIcon('totalAmount')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Trạng thái
                  {renderSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày giao hàng dự kiến
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedGoodsIssues.map((goodsIssue) => (
              <tr 
                key={goodsIssue.goodsIssueId}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(goodsIssue)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {goodsIssue.issueNumber}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {goodsIssue.customerName || 'Không có khách hàng'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {goodsIssue.issueDate ? formatDate(goodsIssue.issueDate) : formatDate(goodsIssue.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {goodsIssue.totalAmount ? formatCurrency(goodsIssue.totalAmount) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusDisplay(goodsIssue.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {goodsIssue.createdByUserName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {goodsIssue.requestedDeliveryDate ? formatDate(goodsIssue.requestedDeliveryDate) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import React from 'react'
import { Button } from '@/components/ui'
import { formatCurrency, formatDate } from '@/utils'
import type { GoodsReceipt } from '@/types'

interface GoodsReceiptTableProps {
  goodsReceipts: GoodsReceipt[]
  loading?: boolean
  onEdit: (goodsReceipt: GoodsReceipt) => void
  onDelete: (goodsReceipt: GoodsReceipt) => void
}

const getStatusDisplay = (status?: string) => {
  const statusMap = {
    'Draft': { label: 'Nháp', className: 'bg-gray-100 text-gray-700' },
    'Pending': { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-700' },
    'Completed': { label: 'Hoàn thành', className: 'bg-green-100 text-green-700' },
    'Cancelled': { label: 'Đã hủy', className: 'bg-red-100 text-red-700' }
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || { 
    label: status || 'Không xác định', 
    className: 'bg-gray-100 text-gray-700' 
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
      {statusInfo.label}
    </span>
  )
}

const GoodsReceiptTable: React.FC<GoodsReceiptTableProps> = ({
  goodsReceipts,
  loading = false,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    )
  }

  if (goodsReceipts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Không có phiếu nhập nào</div>
        <div className="text-gray-400 text-sm">Hãy tạo phiếu nhập đầu tiên của bạn</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số phiếu
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nhà cung cấp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày nhập
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tổng tiền
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người tạo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số sản phẩm
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Thao tác</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {goodsReceipts.map((goodsReceipt) => (
            <tr key={goodsReceipt.goodsReceiptId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {goodsReceipt.receiptNumber || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {goodsReceipt.supplierName || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {goodsReceipt.receiptDate ? formatDate(goodsReceipt.receiptDate) : 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {goodsReceipt.totalAmount ? formatCurrency(goodsReceipt.totalAmount) : 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusDisplay(goodsReceipt.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {goodsReceipt.createdByUserName || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {goodsReceipt.details?.length || 0} sản phẩm
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(goodsReceipt)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(goodsReceipt)}
                    disabled={goodsReceipt.status === 'Completed'}
                  >
                    Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GoodsReceiptTable

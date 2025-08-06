import React, { useState, useEffect } from 'react'
import { Calendar, AlertTriangle, Package, Clock, Edit } from 'lucide-react'
import { Button, Input, Badge, Select } from '@/components/ui'
import { formatDate } from '@/utils/formatUtils'
import { ExpiryStatus } from '@/types/expiry'
import type { ProductExpiryDto } from '@/types/expiry'

interface ExpiryTableProps {
  expiryData: ProductExpiryDto[]
  loading?: boolean
  error?: string | null
  onEditExpiry?: (product: ProductExpiryDto) => void
  onRefresh?: () => void
}

export const ExpiryTable: React.FC<ExpiryTableProps> = ({ 
  expiryData, 
  loading, 
  error, 
  onEditExpiry, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ExpiryStatus | ''>('')
  const [filteredData, setFilteredData] = useState<ProductExpiryDto[]>([])

  useEffect(() => {
    let filtered = expiryData

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    setFilteredData(filtered)
  }, [expiryData, searchTerm, statusFilter])

  const getStatusBadge = (status: ExpiryStatus, daysLeft: number) => {
    switch (status) {
      case ExpiryStatus.Expired:
        return <Badge variant="danger">Đã hết hạn</Badge>
      case ExpiryStatus.ExpiringSoon:
        return <Badge variant="warning">Sắp hết hạn ({daysLeft} ngày)</Badge>
      case ExpiryStatus.ExpiringWithinMonth:
        return <Badge variant="info">Hết hạn trong tháng ({daysLeft} ngày)</Badge>
      case ExpiryStatus.Fresh:
        return <Badge variant="success">Còn tốt ({daysLeft} ngày)</Badge>
      case ExpiryStatus.NoExpiryDate:
        return <Badge variant="secondary">Không có HSD</Badge>
      default:
        return <Badge variant="secondary">N/A</Badge>
    }
  }

  const getRowClassName = (status: ExpiryStatus) => {
    switch (status) {
      case ExpiryStatus.Expired:
        return 'bg-red-50 hover:bg-red-100'
      case ExpiryStatus.ExpiringSoon:
        return 'bg-yellow-50 hover:bg-yellow-100'
      case ExpiryStatus.ExpiringWithinMonth:
        return 'bg-blue-50 hover:bg-blue-100'
      default:
        return 'hover:bg-gray-50'
    }
  }

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: ExpiryStatus.Expired, label: 'Đã hết hạn' },
    { value: ExpiryStatus.ExpiringSoon, label: 'Sắp hết hạn' },
    { value: ExpiryStatus.ExpiringWithinMonth, label: 'Hết hạn trong tháng' },
    { value: ExpiryStatus.Fresh, label: 'Còn tốt' },
    { value: ExpiryStatus.NoExpiryDate, label: 'Không có HSD' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải dữ liệu hạn sử dụng...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">❌ {error}</div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          Thử lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên, SKU, danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as ExpiryStatus)}
            options={statusOptions}
            placeholder="Chọn trạng thái"
          />
        </div>
        
        <div className="text-sm text-gray-600">
          {filteredData.length} / {expiryData.length} sản phẩm
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Đã hết hạn</p>
              <p className="text-2xl font-bold text-red-900">
                {expiryData.filter(p => p.status === ExpiryStatus.Expired).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Sắp hết hạn</p>
              <p className="text-2xl font-bold text-yellow-900">
                {expiryData.filter(p => p.status === ExpiryStatus.ExpiringSoon).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">Trong tháng</p>
              <p className="text-2xl font-bold text-blue-900">
                {expiryData.filter(p => p.status === ExpiryStatus.ExpiringWithinMonth).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Còn tốt</p>
              <p className="text-2xl font-bold text-green-900">
                {expiryData.filter(p => p.status === ExpiryStatus.Fresh).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạn sử dụng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại lưu trữ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.productId} className={getRowClassName(item.status)}>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {item.productName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {item.sku} | {item.category || 'Chưa phân loại'}
                      </div>
                      {item.isPerishable && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">
                          Dễ hỏng
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {item.expiryDate ? formatDate(item.expiryDate) : (
                      <span className="text-gray-400 italic">Không có</span>
                    )}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  {getStatusBadge(item.status, item.daysUntilExpiry)}
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {item.currentStock} {item.unit || 'đơn vị'}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {item.storageType || (
                      <span className="text-gray-400 italic">Chưa có</span>
                    )}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditExpiry?.(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || statusFilter ? 'Không tìm thấy sản phẩm nào' : 'Chưa có dữ liệu hạn sử dụng'}
          </div>
        )}
      </div>
    </div>
  )
}

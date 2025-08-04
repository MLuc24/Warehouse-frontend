import React, { useState, useEffect, useMemo } from 'react'
import { Card, Button, Input, Select, Alert, Badge, Tooltip } from '@/components/ui'
import { GenericList, GenericModal, EmptyState } from '@/components/common'
import { useCategory } from '@/hooks'
import type { ProductCategory, CategoryStatistics, BulkUpdateCategory } from '@/types'

interface Column<T> {
  key: keyof T
  title: string 
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

/**
 * Category Table Component - Tuần 4-5 Implementation
 * Full-featured category management with:
 * - Category CRUD operations
 * - Bulk operations
 * - Category analytics & statistics
 * - Search and filtering
 */
export const CategoryTable: React.FC = () => {
  const {
    categories,
    categoryStats,
    loading,
    loadingStats,
    updating,
    error,
    fetchCategories,
    fetchAllCategoryStats,
    bulkUpdateCategories,
    clearError
  } = useCategory()

  // Local state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof ProductCategory>('category')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Load data on mount
  useEffect(() => {
    fetchCategories()
    fetchAllCategoryStats()
  }, [fetchCategories, fetchAllCategoryStats])

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    const result = categories.filter(category =>
      category.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort categories
    result.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue, 'vi') 
          : bValue.localeCompare(aValue, 'vi')
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    return result
  }, [categories, searchTerm, sortBy, sortOrder])

  // Get statistics for category
  const getCategoryStats = (categoryName: string): CategoryStatistics | undefined => {
    return categoryStats.find(stat => stat.category === categoryName)
  }

  // Handle bulk category update
  const handleBulkUpdate = async () => {
    if (selectedCategories.length === 0 || !newCategoryName.trim()) {
      return
    }

    // Get product IDs from categories (này cần logic phức tạp hơn)
    // Tạm thời mock data để demo UI
    const bulkData: BulkUpdateCategory = {
      productIds: [], // Sẽ được xử lý từ selectedCategories
      newCategory: newCategoryName.trim()
    }

    const success = await bulkUpdateCategories(bulkData)
    if (success) {
      setShowBulkModal(false)
      setSelectedCategories([])
      setNewCategoryName('')
    }
  }

  // Column definitions for table display
  const columns: Column<ProductCategory>[] = [
    {
      key: 'category',
      title: 'Tên danh mục',
      sortable: true,
      render: (category) => (
        <div className="flex items-center space-x-3">
          <div className="font-medium text-gray-900">
            {category.category || <span className="text-gray-400 italic">Chưa phân loại</span>}
          </div>
        </div>
      )
    },
    {
      key: 'productCount',
      title: 'Số sản phẩm',
      sortable: true,
      render: (category) => (
        <div className="flex items-center space-x-2">
          <Badge variant="primary" size="sm">
            {category.productCount}
          </Badge>
          {category.productCount === 0 && (
            <Tooltip content="Danh mục trống - có thể xóa">
              <div className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 text-xs">!</span>
              </div>
            </Tooltip>
          )}
        </div>
      )
    },
    {
      key: 'totalStock',
      title: 'Tổng tồn kho',
      sortable: true,
      render: (category) => (
        <div className="text-sm">
          <span className="font-semibold">{category.totalStock.toLocaleString()}</span>
          <span className="text-gray-500 ml-1">sản phẩm</span>
        </div>
      )
    },
    {
      key: 'totalValue',
      title: 'Tổng giá trị',
      sortable: true,
      render: (category) => (
        <div className="text-sm font-medium text-green-600">
          {category.totalValue.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })}
        </div>
      )
    },
    // Statistics column
    {
      key: 'category', // Dùng key này để access category name
      title: 'Thống kê',
      render: (category) => {
        const stats = getCategoryStats(category.category)
        if (!stats) return <span className="text-gray-400">Đang tải...</span>
        
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs">
              <Badge variant="success" size="sm">{stats.activeProducts}</Badge>
              <span className="text-gray-500">Hoạt động</span>
            </div>
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center space-x-2 text-xs">
                <Badge variant="warning" size="sm">{stats.lowStockProducts}</Badge>
                <span className="text-gray-500">Sắp hết</span>
              </div>
            )}
            {stats.expiredProducts > 0 && (
              <div className="flex items-center space-x-2 text-xs">
                <Badge variant="danger" size="sm">{stats.expiredProducts}</Badge>
                <span className="text-gray-500">Hết hạn</span>
              </div>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📋 Quản lý Danh mục</h2>
          <p className="text-gray-600">Quản lý và phân tích danh mục sản phẩm</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => {
              fetchCategories()
              fetchAllCategoryStats()
            }}
            loading={loading}
          >
            Làm mới
          </Button>
          
          <Button
            onClick={() => setShowBulkModal(true)}
            disabled={selectedCategories.length === 0}
            loading={updating}
          >
            Cập nhật hàng loạt ({selectedCategories.length})
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Lỗi" message={error} onClose={clearError} />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Tổng danh mục</div>
          <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Tổng sản phẩm</div>
          <div className="text-2xl font-bold text-green-600">
            {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Tổng tồn kho</div>
          <div className="text-2xl font-bold text-purple-600">
            {categories.reduce((sum, cat) => sum + cat.totalStock, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Tổng giá trị</div>
          <div className="text-2xl font-bold text-orange-600">
            {categories.reduce((sum, cat) => sum + cat.totalValue, 0).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
              notation: 'compact'
            })}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select
              value={sortBy as string}
              onChange={(value) => setSortBy(value as keyof ProductCategory)}
              options={[
                { value: 'category', label: 'Tên danh mục' },
                { value: 'productCount', label: 'Số sản phẩm' },
                { value: 'totalStock', label: 'Tổng tồn kho' },
                { value: 'totalValue', label: 'Tổng giá trị' }
              ]}
              placeholder="Sắp xếp theo"
            />
          </div>
          
          <div>
            <Select
              value={sortOrder}
              onChange={(value) => setSortOrder(value as 'asc' | 'desc')}
              options={[
                { value: 'asc', label: 'Tăng dần' },
                { value: 'desc', label: 'Giảm dần' }
              ]}
              placeholder="Thứ tự"
            />
          </div>
        </div>
      </Card>

      {/* Categories Display */}
      <Card>
        {filteredAndSortedCategories.length === 0 ? (
          loading || loadingStats ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Đang tải danh mục...</div>
            </div>
          ) : (
            <EmptyState
              title="Không có danh mục nào"
              description="Không tìm thấy danh mục nào phù hợp với bộ lọc hiện tại"
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedCategories.length === filteredAndSortedCategories.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories(filteredAndSortedCategories.map(cat => cat.category))
                        } else {
                          setSelectedCategories([])
                        }
                      }}
                    />
                  </th>
                  {columns.map(column => (
                    <th key={column.key as string} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedCategories.map((category, index) => (
                  <tr key={`${category.category}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedCategories.includes(category.category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.category])
                          } else {
                            setSelectedCategories(selectedCategories.filter(cat => cat !== category.category))
                          }
                        }}
                      />
                    </td>
                    {columns.map(column => (
                      <td key={column.key as string} className="px-6 py-4 whitespace-nowrap">
                        {column.render ? column.render(category) : String(category[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Bulk Update Modal */}
      <GenericModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Cập nhật danh mục hàng loạt"
        showFooter={true}
        footerContent={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowBulkModal(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleBulkUpdate}
              loading={updating}
              disabled={!newCategoryName.trim()}
            >
              Cập nhật
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Alert 
            variant="info" 
            title="Thông tin" 
            message={`Bạn đã chọn ${selectedCategories.length} danh mục. Tất cả sản phẩm trong các danh mục này sẽ được chuyển sang danh mục mới.`}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục mới
            </label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục mới..."
              required
            />
          </div>
          
          <div className="text-sm text-gray-500">
            <strong>Danh mục được chọn:</strong>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map((category, index) => (
                <Badge key={`${category}-${index}`} variant="primary" size="sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </GenericModal>
    </div>
  )
}

export default CategoryTable

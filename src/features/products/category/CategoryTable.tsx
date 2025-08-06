import React, { useState } from 'react'
import { Button, Card, Badge, ConfirmDialog } from '../../../components/ui'
import { Plus, Edit2, Trash2, Package, Users, Clock, Search, Filter, Grid3X3 } from 'lucide-react'
import { CategoryForm } from './CategoryForm'
import { useCategories } from '../../../hooks/useCategory'
import type { Category, CategoryTableColumn, CreateCategoryDto, UpdateCategoryDto } from '../../../types/category'

const columns: CategoryTableColumn[] = [
  { key: 'name', label: 'Tên danh mục', sortable: true },
  { key: 'description', label: 'Mô tả' },
  { key: 'storageType', label: 'Bảo quản' },
  { key: 'isPerishable', label: 'Dễ hỏng', width: '100px' },
  { key: 'productCount', label: 'Sản phẩm', width: '100px' },
  { key: 'status', label: 'Trạng thái', width: '120px' },
  { key: 'updatedAt', label: 'Cập nhật', width: '120px' },
  { key: 'actions', label: 'Thao tác', width: '120px' }
]

const storageTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  'room_temperature': { label: 'Nhiệt độ phòng', icon: '🌡️', color: 'bg-green-100 text-green-800' },
  'refrigerated': { label: 'Tủ lạnh', icon: '❄️', color: 'bg-blue-100 text-blue-800' },
  'frozen': { label: 'Tủ đông', icon: '🧊', color: 'bg-cyan-100 text-cyan-800' },
  'dry_storage': { label: 'Kho khô', icon: '📦', color: 'bg-yellow-100 text-yellow-800' },
  'special': { label: 'Đặc biệt', icon: '🔬', color: 'bg-purple-100 text-purple-800' }
}

export const CategoryTable: React.FC = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Category>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter và sort categories
  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

  const handleSort = (field: keyof Category) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: CreateCategoryDto | UpdateCategoryDto) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, data)
      } else {
        await createCategory(data)
      }
      setShowForm(false)
      setEditingCategory(null)
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error)
    }
  }

  const handleDelete = async () => {
    if (deletingId) {
      try {
        await deleteCategory(deletingId)
        setDeletingId(null)
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error)
      }
    }
  }

  if (showForm) {
    return (
      <CategoryForm
        category={editingCategory || undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false)
          setEditingCategory(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="overflow-hidden border-0 shadow-lg">
        {/* Header Background */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Danh sách danh mục
                </h2>
                <p className="text-emerald-100 text-sm">
                  Quản lý và tổ chức các danh mục sản phẩm
                </p>
              </div>
            </div>

            <Button 
              onClick={handleCreate}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-gradient-to-b from-gray-50 to-white px-6 py-4 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm transition-all"
              />
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    {filteredCategories.length} / {categories.length}
                  </span>
                  <span className="text-emerald-600">danh mục</span>
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {categories.filter(c => c.status).length}
                  </span>
                  <span className="text-blue-600">hoạt động</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-2">❌ {error}</div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.width ? `w-${column.width}` : ''
                      } ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                      onClick={column.sortable ? () => handleSort(column.key as keyof Category) : undefined}
                      style={column.width ? { width: column.width } : {}}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && sortField === column.key && (
                          <span className="text-blue-500">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'Không tìm thấy danh mục nào' : 'Chưa có danh mục nào'}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.categoryId} className="hover:bg-gray-50">
                      {/* Tên danh mục */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg mr-3"
                            style={{ backgroundColor: category.color || '#6B7280' }}
                          >
                            {category.icon ? (
                              <span className="text-lg">
                                {category.icon === 'coffee' ? '☕' : 
                                 category.icon === 'tea' ? '🍵' :
                                 category.icon === 'juice' ? '🧃' :
                                 category.icon === 'milk' ? '🥛' :
                                 category.icon === 'ice-cream' ? '🍦' :
                                 category.icon === 'food' ? '🍰' :
                                 category.icon === 'fruit' ? '🍓' : '📦'}
                              </span>
                            ) : (
                              <Package className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Mô tả */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {category.description || '-'}
                        </div>
                      </td>

                      {/* Loại bảo quản */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.storageType && storageTypeLabels[category.storageType] ? (
                          <Badge 
                            variant="secondary"
                            className={`${storageTypeLabels[category.storageType].color} border-0`}
                          >
                            <span className="mr-1">{storageTypeLabels[category.storageType].icon}</span>
                            {storageTypeLabels[category.storageType].label}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Dễ hỏng */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {category.isPerishable ? (
                          <Badge variant="warning">
                            <Clock className="w-3 h-3 mr-1" />
                            Có
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Không</span>
                        )}
                      </td>

                      {/* Số sản phẩm */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="font-medium">{category.productCount}</span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={category.status ? 'success' : 'secondary'}>
                          {category.status ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </td>

                      {/* Thời gian cập nhật */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.updatedAt ? (
                          new Date(category.updatedAt).toLocaleDateString('vi-VN')
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="p-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingId(category.categoryId)}
                            className="p-1 text-red-600 hover:text-red-700"
                            disabled={category.productCount > 0}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Xác nhận xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}

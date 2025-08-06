import React, { useState, useEffect } from 'react'
import { Button, Card, Input, Textarea, Switch, Badge } from '../../../components/ui'
import { X, Palette, Package, Thermometer, AlertTriangle, Save, RotateCcw } from 'lucide-react'
import type { Category, CategoryFormData, CategoryFormErrors, CreateCategoryDto, UpdateCategoryDto } from '../../../types/category'

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

const storageTypeOptions = [
  { value: 'room_temperature', label: 'Nhiệt độ phòng', icon: '🌡️' },
  { value: 'refrigerated', label: 'Tủ lạnh', icon: '❄️' },
  { value: 'frozen', label: 'Tủ đông', icon: '🧊' },
  { value: 'dry_storage', label: 'Kho khô', icon: '📦' },
  { value: 'special', label: 'Bảo quản đặc biệt', icon: '🔬' }
]

const colorOptions = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'
]

const iconOptions = [
  { value: 'coffee', emoji: '☕', label: 'Cà phê' },
  { value: 'tea', emoji: '🍵', label: 'Trà' },
  { value: 'juice', emoji: '🧃', label: 'Nước ép' },
  { value: 'milk', emoji: '🥛', label: 'Sữa' },
  { value: 'ice-cream', emoji: '🍦', label: 'Kem' },
  { value: 'food', emoji: '🍰', label: 'Thức ăn' },
  { value: 'fruit', emoji: '🍓', label: 'Trái cây' },
  { value: 'package', emoji: '📦', label: 'Gói' }
]

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: 'package',
    color: '#3B82F6',
    storageType: 'room_temperature',
    isPerishable: false,
    defaultMinStock: '',
    defaultMaxStock: '',
    status: true
  })

  const [errors, setErrors] = useState<CategoryFormErrors>({})

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || 'package',
        color: category.color || '#3B82F6',
        storageType: category.storageType || 'room_temperature',
        isPerishable: category.isPerishable,
        defaultMinStock: category.defaultMinStock?.toString() || '',
        defaultMaxStock: category.defaultMaxStock?.toString() || '',
        status: category.status
      })
    }
  }, [category])

  const validateForm = (): boolean => {
    const newErrors: CategoryFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục là bắt buộc'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Tên danh mục không được vượt quá 100 ký tự'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự'
    }

    if (formData.defaultMinStock !== '' && formData.defaultMaxStock !== '') {
      const min = Number(formData.defaultMinStock)
      const max = Number(formData.defaultMaxStock)
      if (min > max) {
        newErrors.defaultMaxStock = 'Mức tối đa phải lớn hơn mức tối thiểu'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      icon: formData.icon,
      color: formData.color,
      storageType: formData.storageType,
      isPerishable: formData.isPerishable,
      defaultMinStock: formData.defaultMinStock !== '' ? Number(formData.defaultMinStock) : undefined,
      defaultMaxStock: formData.defaultMaxStock !== '' ? Number(formData.defaultMaxStock) : undefined,
      status: formData.status
    }

    await onSubmit(submitData)
  }

  const handleReset = () => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || 'package',
        color: category.color || '#3B82F6',
        storageType: category.storageType || 'room_temperature',
        isPerishable: category.isPerishable,
        defaultMinStock: category.defaultMinStock?.toString() || '',
        defaultMaxStock: category.defaultMaxStock?.toString() || '',
        status: category.status
      })
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'package',
        color: '#3B82F6',
        storageType: 'room_temperature',
        isPerishable: false,
        defaultMinStock: '',
        defaultMaxStock: '',
        status: true
      })
    }
    setErrors({})
  }

  return (
    <Card className="overflow-hidden shadow-xl border-0">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {category ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
                </h3>
                <p className="text-emerald-100 text-sm">
                  {category ? 'Cập nhật thông tin danh mục sản phẩm' : 'Thêm danh mục mới vào hệ thống'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
          <form onSubmit={handleSubmit} className="space-y-8">
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-emerald-600" />
            Thông tin cơ bản
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục"
                error={errors.name}
                className="focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Trạng thái</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                <Switch
                  checked={formData.status}
                  onChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
                />
                <Badge variant={formData.status ? 'success' : 'secondary'} className="px-3 py-1">
                  {formData.status ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Mô tả</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả cho danh mục"
              rows={3}
              error={errors.description}
              className="focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Icon và màu sắc */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-emerald-600" />
            Giao diện và hiển thị
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">
                <Palette className="w-4 h-4 inline mr-1" />
                Chọn icon đại diện
              </label>
              <div className="grid grid-cols-4 gap-3">
                {iconOptions.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: icon.value }))}
                    className={`
                      p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105
                      ${formData.icon === icon.value 
                        ? 'border-emerald-500 bg-emerald-50 shadow-md transform scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{icon.emoji}</div>
                    <div className="text-xs font-medium text-gray-600">{icon.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">
                <Palette className="w-4 h-4 inline mr-1" />
                Chọn màu chủ đạo
              </label>
              <div className="grid grid-cols-5 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`
                      w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110 relative
                      ${formData.color === color 
                        ? 'border-gray-800 shadow-lg transform scale-110' 
                        : 'border-gray-200 hover:border-gray-400'
                      }
                    `}
                    style={{ backgroundColor: color }}
                  >
                    {formData.color === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">Màu đã chọn:</div>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded-lg border border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <span className="text-sm font-mono text-gray-800">{formData.color}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cài đặt bảo quản */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Thermometer className="w-5 h-5 mr-2 text-emerald-600" />
            Cài đặt bảo quản và lưu trữ
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <Thermometer className="w-4 h-4 inline mr-1" />
                Điều kiện bảo quản
              </label>
              <select
                value={formData.storageType}
                onChange={(e) => setFormData(prev => ({ ...prev, storageType: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {storageTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Tính chất sản phẩm
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Sản phẩm dễ hỏng</div>
                    <div className="text-sm text-gray-600">
                      {formData.isPerishable ? 'Có hạn sử dụng, cần theo dõi' : 'Không có hạn sử dụng'}
                    </div>
                  </div>
                  <Switch
                    checked={formData.isPerishable}
                    onChange={(checked) => setFormData(prev => ({ ...prev, isPerishable: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cài đặt tồn kho */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-emerald-600" />
            Mức tồn kho mặc định
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Mức tối thiểu</label>
              <Input
                type="number"
                min="0"
                value={formData.defaultMinStock}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultMinStock: e.target.value }))}
                placeholder="Nhập mức tối thiểu"
                className="focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Cảnh báo khi tồn kho thấp hơn mức này</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Mức tối đa</label>
              <Input
                type="number"
                min="0"
                value={formData.defaultMaxStock}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultMaxStock: e.target.value }))}
                placeholder="Nhập mức tối đa"
                error={errors.defaultMaxStock}
                className="focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Mức tồn kho tối đa được khuyến nghị</p>
            </div>
          </div>
        </div>

        {/* Nút action */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt lại</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Đang lưu...' : (category ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  </Card>
  )
}

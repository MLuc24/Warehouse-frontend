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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {category ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nhập tên danh mục"
              error={errors.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.status}
                onChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
              />
              <Badge variant={formData.status ? 'success' : 'secondary'}>
                {formData.status ? 'Hoạt động' : 'Tạm dừng'}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mô tả</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Nhập mô tả cho danh mục"
            rows={3}
            error={errors.description}
          />
        </div>

        {/* Icon và màu sắc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: icon.value }))}
                  className={`
                    p-3 rounded-lg border-2 text-center transition-colors
                    ${formData.icon === icon.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="text-2xl">{icon.emoji}</div>
                  <div className="text-xs mt-1">{icon.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Màu sắc
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`
                    w-10 h-10 rounded-lg border-2 transition-all
                    ${formData.color === color 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-200 hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cài đặt bảo quản */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Cài đặt bảo quản
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Thermometer className="w-4 h-4 inline mr-1" />
                Loại bảo quản
              </label>
              <select
                value={formData.storageType}
                onChange={(e) => setFormData(prev => ({ ...prev, storageType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {storageTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Sản phẩm dễ hỏng
              </label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={formData.isPerishable}
                  onChange={(checked) => setFormData(prev => ({ ...prev, isPerishable: checked }))}
                />
                <span className="text-sm text-gray-600">
                  {formData.isPerishable ? 'Có hạn sử dụng' : 'Không có hạn sử dụng'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cài đặt tồn kho */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Mức tồn kho mặc định</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mức tối thiểu</label>
              <Input
                type="number"
                min="0"
                value={formData.defaultMinStock}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultMinStock: e.target.value }))}
                placeholder="Nhập mức tối thiểu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mức tối đa</label>
              <Input
                type="number"
                min="0"
                value={formData.defaultMaxStock}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultMaxStock: e.target.value }))}
                placeholder="Nhập mức tối đa"
                error={errors.defaultMaxStock}
              />
            </div>
          </div>
        </div>

        {/* Nút action */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt lại
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
          
          <Button
            type="submit"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Đang lưu...' : (category ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

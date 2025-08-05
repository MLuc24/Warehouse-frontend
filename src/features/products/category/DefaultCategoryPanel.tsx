


















import React from 'react'
import { Button, Card, Badge } from '../../../components/ui'
import { Coffee, RefreshCw, Package, Thermometer, Clock } from 'lucide-react'
import { useDefaultCategories } from '../../../hooks/useCategory'

const storageTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  'room_temperature': { label: 'Nhiệt độ phòng', icon: '🌡️', color: 'bg-green-100 text-green-800' },
  'refrigerated': { label: 'Tủ lạnh', icon: '❄️', color: 'bg-blue-100 text-blue-800' },
  'frozen': { label: 'Tủ đông', icon: '🧊', color: 'bg-cyan-100 text-cyan-800' },
  'dry_storage': { label: 'Kho khô', icon: '📦', color: 'bg-yellow-100 text-yellow-800' },
  'special': { label: 'Đặc biệt', icon: '🔬', color: 'bg-purple-100 text-purple-800' }
}

export const DefaultCategoryPanel: React.FC = () => {
  const { categories, loading, error, refetch, seedDefault } = useDefaultCategories()

  const handleSeedDefault = async () => {
    try {
      await seedDefault()
    } catch (error) {
      console.error('Lỗi khi khởi tạo dữ liệu mặc định:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <Coffee className="w-5 h-5 mr-2" />
              Danh mục TocoToco mặc định
            </h2>
            <p className="text-gray-500 mt-1">
              Các danh mục được thiết kế đặc biệt cho cửa hàng trà sữa TocoToco
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            
            <Button onClick={handleSeedDefault} disabled={loading}>
              <Package className="w-4 h-4 mr-2" />
              Khởi tạo dữ liệu mặc định
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải...</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">❌ {error}</div>
            <Button variant="outline" onClick={refetch}>
              Thử lại
            </Button>
          </div>
        </Card>
      ) : categories.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có dữ liệu mặc định
            </h3>
            <p className="text-gray-500 mb-4">
              Nhấn nút "Khởi tạo dữ liệu mặc định" để tạo các danh mục cho TocoToco
            </p>
            <Button onClick={handleSeedDefault}>
              <Package className="w-4 h-4 mr-2" />
              Khởi tạo ngay
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <span>{category.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Chi tiết */}
              <div className="space-y-3">
                {/* Loại bảo quản */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Thermometer className="w-4 h-4 mr-1" />
                    Bảo quản:
                  </span>
                  {storageTypeLabels[category.storageType] ? (
                    <Badge 
                      variant="secondary"
                      className={`${storageTypeLabels[category.storageType].color} border-0 text-xs`}
                    >
                      <span className="mr-1">{storageTypeLabels[category.storageType].icon}</span>
                      {storageTypeLabels[category.storageType].label}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>

                {/* Dễ hỏng */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Dễ hỏng:
                  </span>
                  {category.isPerishable ? (
                    <Badge variant="warning" className="text-xs">
                      Có hạn sử dụng
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">Không</span>
                  )}
                </div>

                {/* Mức tồn kho */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tồn kho:</span>
                  <span className="text-sm font-medium">
                    {category.defaultMinStock} - {category.defaultMaxStock}
                  </span>
                </div>
              </div>

              {/* Ví dụ sản phẩm */}
              {category.exampleProducts && category.exampleProducts.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ví dụ sản phẩm:</h4>
                  <div className="flex flex-wrap gap-1">
                    {category.exampleProducts.slice(0, 3).map((product, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                    {category.exampleProducts.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{category.exampleProducts.length - 3} khác
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Thông tin bổ sung */}
      {categories.length > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Về danh mục TocoToco
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Được thiết kế đặc biệt cho cửa hàng trà sữa TocoToco</p>
                <p>• Bao gồm các loại đồ uống phổ biến và nguyên liệu</p>
                <p>• Có cài đặt bảo quản phù hợp cho từng loại sản phẩm</p>
                <p>• Mức tồn kho được tối ưu hóa cho hoạt động kinh doanh</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

import React, { useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Target, DollarSign, BarChart3 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { usePricing } from '@/hooks/usePricing'
import { formatCurrency, formatPercentage } from '@/utils'

export const PricingAnalytics: React.FC = () => {
  const { pricingAnalysis, loading, error, fetchPricingAnalysis } = usePricing()

  useEffect(() => {
    fetchPricingAnalysis()
  }, [fetchPricingAnalysis])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải phân tích giá...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">❌ {error}</div>
      </div>
    )
  }

  if (!pricingAnalysis) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Không có dữ liệu phân tích</p>
      </div>
    )
  }

  const {
    totalProducts,
    productsWithoutPurchasePrice,
    productsWithoutSellingPrice,
    productsWithNegativeMargin,
    productsWithHighMargin,
    averagePurchasePrice,
    averageSellingPrice,
    averageMarginPercent,
    topProfitableProducts,
    lowMarginProducts
  } = pricingAnalysis

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá mua TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averagePurchasePrice)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá bán TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(averageSellingPrice)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ suất TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(averageMarginPercent)}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Thiếu giá mua</p>
              <p className="text-xl font-bold text-yellow-900">{productsWithoutPurchasePrice}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">Thiếu giá bán</p>
              <p className="text-xl font-bold text-orange-900">{productsWithoutSellingPrice}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Lỗ</p>
              <p className="text-xl font-bold text-red-900">{productsWithNegativeMargin}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Lợi nhuận cao</p>
              <p className="text-xl font-bold text-green-900">{productsWithHighMargin}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Profitable Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Sản phẩm lợi nhuận cao
          </h3>
          {topProfitableProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Không có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {topProfitableProducts.slice(0, 5).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="success">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {product.profitMargin ? formatPercentage(product.profitMargin) : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.profitAmount ? formatCurrency(product.profitAmount) : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Low Margin Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Sản phẩm lợi nhuận thấp
          </h3>
          {lowMarginProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Không có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {lowMarginProducts.slice(0, 5).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="danger">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium text-gray-900">{product.productName}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      {product.profitMargin ? formatPercentage(product.profitMargin) : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.profitAmount ? formatCurrency(product.profitAmount) : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Khuyến nghị</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsWithoutPurchasePrice > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Cập nhật giá mua</h4>
              <p className="text-sm text-yellow-700">
                Có {productsWithoutPurchasePrice} sản phẩm chưa có giá mua. 
                Hãy cập nhật để tính toán lợi nhuận chính xác.
              </p>
            </div>
          )}
          
          {productsWithoutSellingPrice > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Cập nhật giá bán</h4>
              <p className="text-sm text-orange-700">
                Có {productsWithoutSellingPrice} sản phẩm chưa có giá bán. 
                Hãy thiết lập giá bán để có thể kinh doanh.
              </p>
            </div>
          )}
          
          {productsWithNegativeMargin > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Xem xét sản phẩm lỗ</h4>
              <p className="text-sm text-red-700">
                Có {productsWithNegativeMargin} sản phẩm đang bị lỗ. 
                Cần điều chỉnh giá bán hoặc tìm nhà cung cấp tốt hơn.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

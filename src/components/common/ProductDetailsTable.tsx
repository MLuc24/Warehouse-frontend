import { formatCurrency } from '@/utils'
import { Package, Hash, DollarSign, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Generic interface for product details
interface BaseProductDetail {
  productId: number
  productName?: string
  productSku?: string
  quantity: number
  unitPrice: number
  subtotal?: number
  unit?: string
  notes?: string
  imageUrl?: string
}

interface ProductDetailsTableProps<T extends BaseProductDetail> {
  details: T[]
  title: string
  subtitle: string
  colorScheme?: 'green' | 'purple' | 'blue' | 'orange'
  onExport?: () => void
  exportButtonText?: string
  totalAmount?: number
}

export const ProductDetailsTable = <T extends BaseProductDetail>({
  details,
  title,
  subtitle,
  colorScheme = 'green',
  onExport,
  exportButtonText = 'Xuất phiếu',
  totalAmount
}: ProductDetailsTableProps<T>) => {
  // Color scheme configurations
  const colorConfigs = {
    green: {
      headerBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      iconBg: 'bg-green-600',
      titleText: 'text-green-900',
      subtitleText: 'text-green-700',
      summaryBg: 'bg-gradient-to-r from-gray-50 to-green-50',
      subtotalBg: 'bg-green-50',
      subtotalText: 'text-green-600',
      totalBg: 'bg-green-100',
      totalText: 'text-green-600',
      unitBg: 'bg-green-100',
      unitText: 'text-green-800',
      imageBg: 'bg-gradient-to-br from-green-100 to-blue-100'
    },
    purple: {
      headerBg: 'bg-gradient-to-r from-purple-50 to-violet-50',
      iconBg: 'bg-purple-600',
      titleText: 'text-purple-900',
      subtitleText: 'text-purple-700',
      summaryBg: 'bg-gradient-to-r from-gray-50 to-purple-50',
      subtotalBg: 'bg-purple-50',
      subtotalText: 'text-purple-600',
      totalBg: 'bg-purple-100',
      totalText: 'text-purple-600',
      unitBg: 'bg-purple-100',
      unitText: 'text-purple-800',
      imageBg: 'bg-gradient-to-br from-purple-100 to-blue-100'
    },
    blue: {
      headerBg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-600',
      titleText: 'text-blue-900',
      subtitleText: 'text-blue-700',
      summaryBg: 'bg-gradient-to-r from-gray-50 to-blue-50',
      subtotalBg: 'bg-blue-50',
      subtotalText: 'text-blue-600',
      totalBg: 'bg-blue-100',
      totalText: 'text-blue-600',
      unitBg: 'bg-blue-100',
      unitText: 'text-blue-800',
      imageBg: 'bg-gradient-to-br from-blue-100 to-purple-100'
    },
    orange: {
      headerBg: 'bg-gradient-to-r from-orange-50 to-amber-50',
      iconBg: 'bg-orange-600',
      titleText: 'text-orange-900',
      subtitleText: 'text-orange-700',
      summaryBg: 'bg-gradient-to-r from-gray-50 to-orange-50',
      subtotalBg: 'bg-orange-50',
      subtotalText: 'text-orange-600',
      totalBg: 'bg-orange-100',
      totalText: 'text-orange-600',
      unitBg: 'bg-orange-100',
      unitText: 'text-orange-800',
      imageBg: 'bg-gradient-to-br from-orange-100 to-blue-100'
    }
  }

  const colors = colorConfigs[colorScheme]

  const calculateSubtotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const handleExportToPDF = () => {
    if (onExport) {
      onExport()
    } else {
      // For ProductDetailsTable, we'll use the onExport callback from parent
      // The parent component should handle PDF export using pdfService
      alert('Chức năng xuất PDF cần được cấu hình từ component cha')
    }
  }

  if (!details || details.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="text-center">
          <div className="bg-gray-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">Chưa có sản phẩm nào</p>
          <p className="text-gray-400 text-sm">{subtitle} chưa có sản phẩm nào được thêm vào</p>
        </div>
      </div>
    )
  }

  const totalQuantity = details.reduce((sum, detail) => sum + detail.quantity, 0)
  const totalValue = totalAmount || details.reduce(
    (sum, detail) => sum + (detail.subtotal || calculateSubtotal(detail.quantity, detail.unitPrice)),
    0
  )

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-5 border-b border-gray-200 ${colors.headerBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${colors.iconBg} p-2 rounded-xl`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${colors.titleText}`}>{title}</h3>
              <p className={`text-sm ${colors.subtitleText} mt-1`}>
                Danh sách {details.length} sản phẩm trong {subtitle.toLowerCase()}
              </p>
            </div>
          </div>
          <Button
            onClick={handleExportToPDF}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            size="sm"
          >
            <FileText className="w-4 h-4" />
            <span>{exportButtonText}</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Đơn vị
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {details.map((detail, index) => {
              const subtotal = detail.subtotal || calculateSubtotal(detail.quantity, detail.unitPrice)
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  {/* Product Image */}
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {detail.imageUrl ? (
                        <img 
                          src={detail.imageUrl} 
                          alt={detail.productName || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${colors.imageBg} ${detail.imageUrl ? 'hidden' : ''}`}>
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </td>
                  
                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {detail.productName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">
                        SKU: {detail.productSku || 'N/A'}
                      </div>
                      {detail.notes && (
                        <div className="text-xs text-gray-600 mt-1 italic bg-yellow-50 px-2 py-1 rounded">
                          {detail.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Quantity */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {detail.quantity.toLocaleString()}
                    </span>
                  </td>
                  
                  {/* Unit */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors.unitBg} ${colors.unitText}`}>
                      {detail.unit || 'N/A'}
                    </span>
                  </td>
                  
                  {/* Unit Price */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900 font-medium">
                      {formatCurrency(detail.unitPrice)}
                    </span>
                  </td>
                  
                  {/* Subtotal */}
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${colors.subtotalText} ${colors.subtotalBg} px-3 py-1 rounded-lg`}>
                      {formatCurrency(subtotal)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr className="border-t-2 border-gray-300">
              <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                Tổng cộng
              </td>
              <td className="px-6 py-4 text-right">
                <span className={`text-sm font-bold text-gray-900 ${colors.unitBg} px-3 py-1 rounded-lg`}>
                  {totalQuantity.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-right">
                <span className={`text-lg font-bold ${colors.totalText} ${colors.totalBg} px-4 py-2 rounded-lg shadow-sm`}>
                  {formatCurrency(totalValue)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-6 ${colors.summaryBg}`}>
        <div className={`bg-white border ${colors.unitBg.replace('bg-', 'border-').replace('-100', '-200')} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${colors.unitText.replace('text-', 'text-').replace('-800', '-600')} font-medium`}>Tổng sản phẩm</p>
              <p className={`text-2xl font-bold ${colors.unitText.replace('text-', 'text-').replace('-800', '-900')}`}>{details.length}</p>
            </div>
            <div className={`${colors.unitBg} p-3 rounded-xl`}>
              <Package className={`w-6 h-6 ${colors.unitText.replace('text-', 'text-').replace('-800', '-600')}`} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Tổng số lượng</p>
              <p className="text-2xl font-bold text-orange-900">{totalQuantity.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Hash className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Tổng giá trị</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsTable

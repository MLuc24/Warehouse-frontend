import React from 'react'
import type { GoodsIssue } from '@/types'
import { X, Package } from 'lucide-react'
import { GoodsIssueInfo } from './GoodsIssueInfo'
import { ProductDetailsTable } from '@/components/common'
import { ActionButtons } from './ActionButtons'

interface GoodsIssueDetailViewProps {
  goodsIssue: GoodsIssue
  onEdit?: (goodsIssue: GoodsIssue) => void
  onDelete?: (goodsIssue: GoodsIssue) => void
  onBack?: () => void
  onRefresh?: () => void
  currentUserId?: number
  userRole?: string
  onApprove?: (goodsIssue: GoodsIssue) => void
  onReject?: (goodsIssue: GoodsIssue) => void
  onPrepare?: (goodsIssue: GoodsIssue) => void
  onConfirmDelivery?: (goodsIssue: GoodsIssue) => void
  onComplete?: (goodsIssue: GoodsIssue) => void
  onCancel?: (goodsIssue: GoodsIssue) => void
  onResubmit?: (goodsIssue: GoodsIssue) => void
  onResendEmail?: (goodsIssue: GoodsIssue) => void
  onExportIssue?: () => void
  loading?: boolean
}

export const GoodsIssueDetailView: React.FC<GoodsIssueDetailViewProps> = ({
  goodsIssue,
  onEdit,
  onDelete,
  onBack,
  currentUserId,
  userRole,
  onApprove,
  onReject,
  onPrepare,
  onConfirmDelivery,
  onComplete,
  onCancel,
  onResubmit,
  onResendEmail,
  onExportIssue,
  loading = false
}) => {
  const canEdit = goodsIssue.status === 'Draft' || goodsIssue.status === 'Rejected'
  const canDelete = goodsIssue.status === 'Draft' || goodsIssue.status === 'Cancelled'
  const canApprove = goodsIssue.status === 'AwaitingApproval' && (userRole === 'Admin' || userRole === 'Manager')
  const canComplete = goodsIssue.status === 'Delivered' && (userRole === 'Admin' || userRole === 'Manager')

  const handleExportPDF = async () => {
    if (onExportIssue) {
      onExportIssue()
    } else {
      try {
        const { pdfService } = await import('@/services/pdfService')
        await pdfService.downloadGoodsIssuePDF(goodsIssue)
      } catch (error) {
        console.error('Error exporting PDF:', error)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="bg-green-600 p-3 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết phiếu xuất</h1>
            <p className="text-sm text-gray-600 mt-1">
              Phiếu số: {goodsIssue.issueNumber || 'Đang tạo...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Workflow Action Buttons */}
            <ActionButtons
              goodsIssue={goodsIssue}
              currentUserId={currentUserId}
              userRole={userRole}
              onEdit={onEdit ? () => onEdit(goodsIssue) : undefined}
              onDelete={onDelete ? () => onDelete(goodsIssue) : undefined}
              onApprove={onApprove ? () => onApprove(goodsIssue) : undefined}
              onReject={onReject ? () => onReject(goodsIssue) : undefined}
              onPrepare={onPrepare ? () => onPrepare(goodsIssue) : undefined}
              onConfirmDelivery={onConfirmDelivery ? () => onConfirmDelivery(goodsIssue) : undefined}
              onComplete={onComplete ? () => onComplete(goodsIssue) : undefined}
              onCancel={onCancel ? () => onCancel(goodsIssue) : undefined}
              onResubmit={onResubmit ? () => onResubmit(goodsIssue) : undefined}
              onResendEmail={onResendEmail ? () => onResendEmail(goodsIssue) : undefined}
              loading={loading}
            />
          </div>

          {/* Divider */}
          {(canEdit || canDelete || canApprove || canComplete) && (
            <div className="h-6 border-l border-gray-300"></div>
          )}

          {/* Status Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            goodsIssue.status === 'Completed' ? 'bg-green-100 text-green-800' :
            goodsIssue.status === 'Delivered' ? 'bg-teal-100 text-teal-800' :
            goodsIssue.status === 'Preparing' ? 'bg-purple-100 text-purple-800' :
            goodsIssue.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
            goodsIssue.status === 'AwaitingApproval' ? 'bg-yellow-100 text-yellow-800' :
            goodsIssue.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
            goodsIssue.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            goodsIssue.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {goodsIssue.status === 'Completed' ? 'Hoàn thành' :
             goodsIssue.status === 'Delivered' ? 'Đã giao hàng' :
             goodsIssue.status === 'Preparing' ? 'Đang chuẩn bị' :
             goodsIssue.status === 'Approved' ? 'Đã phê duyệt' :
             goodsIssue.status === 'AwaitingApproval' ? 'Chờ duyệt' :
             goodsIssue.status === 'Draft' ? 'Nháp' :
             goodsIssue.status === 'Rejected' ? 'Từ chối' :
             goodsIssue.status === 'Cancelled' ? 'Đã hủy' :
             goodsIssue.status}
          </span>
          
          {/* Close Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Info */}
        <GoodsIssueInfo goodsIssue={goodsIssue} />
        
        {/* Product Details */}
        <ProductDetailsTable
          details={goodsIssue.details}
          title="Chi tiết sản phẩm"
          subtitle="phiếu xuất"
          colorScheme="green"
          onExport={handleExportPDF}
          exportButtonText="Xuất phiếu"
          totalAmount={goodsIssue.totalAmount}
        />
      </div>
    </div>
  )
}

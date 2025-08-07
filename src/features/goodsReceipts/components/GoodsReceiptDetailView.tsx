import React from 'react'
import { Button } from '@/components/ui'
import type { GoodsReceipt } from '@/types'
import { X, Package } from 'lucide-react'
import GoodsReceiptInfo from './display/GoodsReceiptInfo'
import ProductDetailsTable from './display/ProductDetailsTable'
import ActionButtons from './ActionButtons'

interface GoodsReceiptDetailViewProps {
  goodsReceipt: GoodsReceipt
  onEdit: () => void
  onDelete: () => void
  onBack: () => void
  onRefresh?: () => void
  currentUserRole: string
  currentUserId?: number
  onApprove?: (goodsReceiptId: number) => void
  onReject?: (goodsReceiptId: number) => void
  onComplete?: (goodsReceiptId: number) => void
  onResendEmail?: (goodsReceiptId: number) => void
  onCancel?: (goodsReceiptId: number) => void
  onResubmit?: (goodsReceiptId: number) => void
}

const GoodsReceiptDetailView: React.FC<GoodsReceiptDetailViewProps> = ({
  goodsReceipt,
  onEdit,
  onDelete,
  onBack,
  currentUserRole,
  currentUserId,
  onApprove,
  onReject,
  onComplete,
  onResendEmail,
  onCancel,
  onResubmit
}) => {
  const canEdit = goodsReceipt.status === 'Draft' || goodsReceipt.status === 'Rejected'
  const canDelete = goodsReceipt.status === 'Draft' || goodsReceipt.status === 'Cancelled'
  const canApprove = goodsReceipt.status === 'AwaitingApproval' && (currentUserRole === 'Admin' || currentUserRole === 'Manager')
  const canComplete = goodsReceipt.status === 'SupplierConfirmed' && (currentUserRole === 'Admin' || currentUserRole === 'Manager')

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết phiếu nhập</h1>
            <p className="text-sm text-gray-600 mt-1">
              Phiếu số: {goodsReceipt.receiptNumber || 'Đang tạo...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Workflow Action Buttons */}
            <ActionButtons
              goodsReceipt={goodsReceipt}
              currentUserRole={currentUserRole}
              currentUserId={currentUserId}
              onEdit={() => onEdit()}
              onDelete={onDelete ? (_id) => onDelete() : undefined}
              onApprove={onApprove}
              onReject={onReject}
              onCancel={onCancel}
              onResubmit={onResubmit}
              onComplete={onComplete}
              onResendEmail={onResendEmail}
              disabled={false}
            />
          </div>

          {/* Divider */}
          {(canEdit || canDelete || canApprove || canComplete) && (
            <div className="h-6 border-l border-gray-300"></div>
          )}

          {/* Status Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            goodsReceipt.status === 'Completed' ? 'bg-green-100 text-green-800' :
            goodsReceipt.status === 'AwaitingApproval' ? 'bg-yellow-100 text-yellow-800' :
            goodsReceipt.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
            goodsReceipt.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {goodsReceipt.status === 'Completed' ? 'Hoàn thành' :
             goodsReceipt.status === 'AwaitingApproval' ? 'Chờ duyệt' :
             goodsReceipt.status === 'Draft' ? 'Nháp' :
             goodsReceipt.status === 'Rejected' ? 'Từ chối' :
             goodsReceipt.status}
          </span>
          
          {/* Close Button */}
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Info */}
        <GoodsReceiptInfo goodsReceipt={goodsReceipt} />
        
        {/* Product Details */}
        <ProductDetailsTable 
          goodsReceipt={goodsReceipt} 
        />
      </div>
    </div>
  )
}

export default GoodsReceiptDetailView

import React, { useState } from 'react'
import { Button } from '@/components/ui'
import type { GoodsReceipt } from '@/types'
import { Edit, Trash2, X, Check, FileX, Package, Mail } from 'lucide-react'
import GoodsReceiptInfo from './display/GoodsReceiptInfo'
import ProductDetailsTable from './display/ProductDetailsTable'
import { goodsReceiptService } from '@/services'

interface GoodsReceiptDetailViewProps {
  goodsReceipt: GoodsReceipt
  onEdit: () => void
  onDelete: () => void
  onBack: () => void
  onRefresh?: () => void
  currentUserRole: string
}

const GoodsReceiptDetailView: React.FC<GoodsReceiptDetailViewProps> = ({
  goodsReceipt,
  onEdit,
  onDelete,
  onBack,
  onRefresh,
  currentUserRole
}) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleEditProduct = (detail: GoodsReceipt['details'][0]) => {
    // TODO: Implement edit product functionality
    console.log('Edit product:', detail)
  }

  const handleDeleteProduct = (detail: GoodsReceipt['details'][0]) => {
    // TODO: Implement delete product functionality
    console.log('Delete product:', detail)
  }

  const handleApprove = async () => {
    if (!goodsReceipt.goodsReceiptId) return
    
    setIsLoading(true)
    try {
      await goodsReceiptService.approveOrReject({
        goodsReceiptId: goodsReceipt.goodsReceiptId,
        action: 'Approve'
      })
      // Refresh data after successful action
      onRefresh?.()
    } catch (error) {
      console.error('Error approving goods receipt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!goodsReceipt.goodsReceiptId) return
    
    setIsLoading(true)
    try {
      await goodsReceiptService.approveOrReject({
        goodsReceiptId: goodsReceipt.goodsReceiptId,
        action: 'Reject',
        notes: 'Từ chối phiếu nhập'
      })
      // Refresh data after successful action
      onRefresh?.()
    } catch (error) {
      console.error('Error rejecting goods receipt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!goodsReceipt.goodsReceiptId) return
    
    setIsLoading(true)
    try {
      await goodsReceiptService.completeReceipt(goodsReceipt.goodsReceiptId, {
        goodsReceiptId: goodsReceipt.goodsReceiptId
      })
      // Refresh data after successful action
      onRefresh?.()
    } catch (error) {
      console.error('Error completing goods receipt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!goodsReceipt.goodsReceiptId) return
    
    setIsLoading(true)
    try {
      await goodsReceiptService.resendSupplierEmail(goodsReceipt.goodsReceiptId)
      // Refresh data after successful action
      onRefresh?.()
    } catch (error) {
      console.error('Error resending email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!goodsReceipt.goodsReceiptId) return
    
    setIsLoading(true)
    try {
      await goodsReceiptService.cancelReceipt(goodsReceipt.goodsReceiptId)
      // Refresh data after successful action
      onRefresh?.()
    } catch (error) {
      console.error('Error cancelling goods receipt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResubmit = async () => {
    if (!goodsReceipt.goodsReceiptId) return
    
    setIsLoading(true)
    try {
      await goodsReceiptService.resubmitReceipt(goodsReceipt.goodsReceiptId)
      // Refresh data after successful action
      onRefresh?.()
    } catch (error) {
      console.error('Error resubmitting goods receipt:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
            {/* Edit and Delete Actions */}
            {canEdit && (
              <Button
                onClick={onEdit}
                variant="secondary"
                size="sm"
                className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg px-3 py-2 font-medium"
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Sửa
              </Button>
            )}
            
            {canDelete && (
              <Button
                onClick={onDelete}
                variant="danger"
                size="sm"
                className="flex items-center bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg px-3 py-2 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Xóa
              </Button>
            )}

            {/* Workflow Actions */}
            {canApprove && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white border-0 rounded-lg px-3 py-2 font-medium shadow-sm"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Duyệt
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white border-0 rounded-lg px-3 py-2 font-medium shadow-sm"
                >
                  <FileX className="w-4 h-4 mr-1.5" />
                  Từ chối
                </Button>
              </>
            )}

            {/* Cancel for AwaitingApproval (User can cancel their own) */}
            {goodsReceipt.status === 'AwaitingApproval' && !canApprove && (
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="danger"
                className="flex items-center bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg px-3 py-2 font-medium"
              >
                <X className="w-4 h-4 mr-1.5" />
                Hủy
              </Button>
            )}
            
            {/* Actions for Pending status */}
            {goodsReceipt.status === 'Pending' && (
              <>
                <Button
                  onClick={onEdit}
                  disabled={isLoading}
                  variant="secondary"
                  className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg px-3 py-2 font-medium"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Sửa
                </Button>
                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  variant="secondary"
                  className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg px-3 py-2 font-medium"
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  Gửi lại
                </Button>
              </>
            )}

            {/* Actions for Rejected status */}
            {goodsReceipt.status === 'Rejected' && (
              <>
                <Button
                  onClick={onEdit}
                  disabled={isLoading}
                  variant="secondary"
                  className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg px-3 py-2 font-medium"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Sửa
                </Button>
                <Button
                  onClick={handleResubmit}
                  disabled={isLoading}
                  className="flex items-center bg-orange-600 hover:bg-orange-700 text-white border-0 rounded-lg px-3 py-2 font-medium shadow-sm"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Gửi lại
                </Button>
              </>
            )}
            
            {canComplete && (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white border-0 rounded-lg px-3 py-2 font-medium shadow-sm"
              >
                <Package className="w-4 h-4 mr-1.5" />
                Hoàn thành
              </Button>
            )}
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
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          canEdit={canEdit}
        />
      </div>
    </div>
  )
}

export default GoodsReceiptDetailView

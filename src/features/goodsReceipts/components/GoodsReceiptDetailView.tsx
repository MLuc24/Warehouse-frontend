import React, { useState } from 'react'
import { Button } from '@/components/ui'
import type { GoodsReceipt } from '@/types'
import { Edit, Trash2, X, Check, FileX, Package } from 'lucide-react'
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
      onRefresh?.()
    } catch (error) {
      console.error('Error completing goods receipt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canEdit = goodsReceipt.status === 'Draft' || goodsReceipt.status === 'Rejected'
  const canDelete = goodsReceipt.status === 'Draft' || goodsReceipt.status === 'Cancelled'
  const canApprove = goodsReceipt.status === 'AwaitingApproval' && (currentUserRole === 'Admin' || currentUserRole === 'Manager')
  const canComplete = goodsReceipt.status === 'SupplierConfirmed' && (currentUserRole === 'Admin' || currentUserRole === 'Manager')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết phiếu nhập</h1>
        </div>
        
        <div className="flex items-center space-x-2">
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

        {/* Action Buttons Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác</h3>
          <div className="flex flex-wrap items-center gap-3">
            {/* Edit and Delete Actions */}
            {(canEdit || canDelete) && (
              <>
                {canEdit && (
                  <Button
                    onClick={onEdit}
                    variant="secondary"
                    size="sm"
                    className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                )}
                
                {canDelete && (
                  <Button
                    onClick={onDelete}
                    variant="danger"
                    size="sm"
                    className="flex items-center bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa phiếu
                  </Button>
                )}
                
                {(canEdit || canDelete) && (canApprove || canComplete) && (
                  <div className="h-6 border-l border-gray-300 mx-2"></div>
                )}
              </>
            )}

            {/* Workflow Actions */}
            {canApprove && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Phê duyệt
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  <FileX className="w-4 h-4 mr-2" />
                  Từ chối
                </Button>
              </>
            )}
            
            {canComplete && (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white border-0"
              >
                <Package className="w-4 h-4 mr-2" />
                Hoàn thành nhập kho
              </Button>
            )}

            {/* Show message if no actions available */}
            {!canEdit && !canDelete && !canApprove && !canComplete && (
              <div className="text-sm text-gray-500 italic">
                Không có thao tác khả dụng cho trạng thái hiện tại
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoodsReceiptDetailView

import React from 'react'
import { Button } from '@/components/ui'
import { Check, X, Package, Mail, Trash2, Edit } from 'lucide-react'
import type { GoodsReceipt } from '@/types'

interface ActionButtonsProps {
  goodsReceipt: GoodsReceipt
  currentUserRole?: string
  currentUserId?: number
  onApprove?: (goodsReceiptId: number) => void
  onReject?: (goodsReceiptId: number) => void
  onComplete?: (goodsReceiptId: number) => void
  onResendEmail?: (goodsReceiptId: number) => void
  onCancel?: (goodsReceiptId: number) => void
  onResubmit?: (goodsReceiptId: number) => void
  onEdit?: (goodsReceipt: GoodsReceipt) => void
  onDelete?: (goodsReceiptId: number) => void
  disabled?: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  goodsReceipt,
  currentUserRole = '',
  currentUserId,
  onApprove,
  onReject,
  onComplete,
  onResendEmail,
  onCancel,
  onResubmit,
  onEdit,
  onDelete,
  disabled = false
}) => {
  const { status } = goodsReceipt
  
  // Kiểm tra role
  const isAdmin = currentUserRole === 'Admin'
  const isManager = currentUserRole === 'Manager'
  const isEmployee = currentUserRole === 'Employee'
  const canApproveReject = isAdmin || isManager
  
  // Kiểm tra creator
  const isCreator = currentUserId === goodsReceipt.createdByUserId
  
  // Debug logging - TẠM THỜI để kiểm tra dữ liệu
  console.log('🔍 ActionButtons Debug:', {
    goodsReceiptId: goodsReceipt.goodsReceiptId,
    status,
    currentUserRole,
    currentUserId,
    createdByUserId: goodsReceipt.createdByUserId,
    isCreator,
    isAdmin,
    isManager, 
    isEmployee,
    canApproveReject
  })

  // Nếu currentUserId chưa có thì chờ load
  if (currentUserId === undefined) {
    console.log('⏳ Waiting for currentUserId to load...')
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    )
  }
  
  const buttons: React.ReactNode[] = []

  // Logic theo matrix quyền hạn:
  switch (status) {
    case 'SupplierConfirmed':
      // Tất cả roles → nhập kho
      buttons.push(
        <Button
          key="complete"
          size="sm"
          onClick={() => onComplete?.(goodsReceipt.goodsReceiptId!)}
          disabled={disabled}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Package className="w-3 h-3 mr-1" />
          Nhập kho
        </Button>
      )
      break

    case 'Pending':
      // admin/manager → sửa, gửi lại | employee → rỗng
      if (canApproveReject) {
        buttons.push(
          <Button
            key="edit"
            size="sm"
            variant="secondary"
            onClick={() => onEdit?.(goodsReceipt)}
            disabled={disabled}
          >
            <Edit className="w-3 h-3 mr-1" />
            Sửa
          </Button>
        )
        
        buttons.push(
          <Button
            key="resend"
            size="sm"
            variant="secondary"
            onClick={() => onResendEmail?.(goodsReceipt.goodsReceiptId!)}
            disabled={disabled}
          >
            <Mail className="w-3 h-3 mr-1" />
            Gửi lại
          </Button>
        )
      }
      // Employee không có action gì
      break

    case 'AwaitingApproval':
      // admin/manager → duyệt/từ chối
      if (canApproveReject) {
        buttons.push(
          <Button
            key="approve"
            size="sm"
            onClick={() => onApprove?.(goodsReceipt.goodsReceiptId!)}
            disabled={disabled}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-3 h-3 mr-1" />
            Duyệt
          </Button>
        )
        
        buttons.push(
          <Button
            key="reject"
            size="sm"
            variant="danger"
            onClick={() => onReject?.(goodsReceipt.goodsReceiptId!)}
            disabled={disabled}
          >
            <X className="w-3 h-3 mr-1" />
            Từ chối
          </Button>
        )
      }
      // employee creator → hủy
      else if (isEmployee && isCreator) {
        buttons.push(
          <Button
            key="cancel"
            size="sm"
            variant="danger"
            onClick={() => onCancel?.(goodsReceipt.goodsReceiptId!)}
            disabled={disabled}
          >
            <X className="w-3 h-3 mr-1" />
            Hủy
          </Button>
        )
      }
      // Employee khác → rỗng
      break

    case 'Rejected':
      // admin/manager → rỗng
      // employee creator → xóa, sửa, gửi lại
      if (isEmployee && isCreator) {
        buttons.push(
          <Button
            key="delete"
            size="sm"
            variant="danger"
            onClick={() => onDelete?.(goodsReceipt.goodsReceiptId!)}
            disabled={disabled}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa
          </Button>
        )
        
        buttons.push(
          <Button
            key="edit"
            size="sm"
            variant="secondary"
            onClick={() => onEdit?.(goodsReceipt)}
            disabled={disabled}
          >
            <Edit className="w-3 h-3 mr-1" />
            Sửa
          </Button>
        )
        
        buttons.push(
          <Button
            key="resubmit"
            size="sm"
            onClick={() => onResubmit?.(goodsReceipt.goodsReceiptId!)}
            disabled={disabled}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Check className="w-3 h-3 mr-1" />
            Gửi lại
          </Button>
        )
      }
      // Admin/manager và employee khác → rỗng
      break

    case 'Completed':
      // Tất cả → rỗng
      break

    case 'Cancelled':
      // admin/manager/employee2 → không hiện
      // employee creator → xóa
      if (isEmployee && isCreator) {
        buttons.push(
          <Button
            key="delete"
            size="sm"
            variant="danger"
            onClick={() => onDelete?.(goodsReceipt.goodsReceiptId!)}
            disabled={disabled}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa
          </Button>
        )
      }
      break

    default:
      // Status không xác định → rỗng
      break
  }

  // Nếu không có button nào thì return null
  if (buttons.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {buttons}
    </div>
  )
}

export default ActionButtons

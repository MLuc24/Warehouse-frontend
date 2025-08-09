import React from 'react'
import { Button } from '@/components/ui/Button'
import type { GoodsIssue } from '@/types'
import { 
  Check, 
  X, 
  Package, 
  Truck, 
  CheckCircle, 
  Mail,
  Edit,
  Trash2
} from 'lucide-react'

interface ActionButtonsProps {
  goodsIssue: GoodsIssue
  currentUserId?: number
  userRole?: string
  onEdit?: (goodsIssue: GoodsIssue) => void
  onDelete?: (goodsIssue: GoodsIssue) => void
  onApprove?: (goodsIssue: GoodsIssue) => void
  onReject?: (goodsIssue: GoodsIssue) => void
  onPrepare?: (goodsIssue: GoodsIssue) => void
  onConfirmDelivery?: (goodsIssue: GoodsIssue) => void
  onComplete?: (goodsIssue: GoodsIssue) => void
  onCancel?: (goodsIssue: GoodsIssue) => void
  onResubmit?: (goodsIssue: GoodsIssue) => void
  onResendEmail?: (goodsIssue: GoodsIssue) => void
  loading?: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  goodsIssue,
  currentUserId,
  userRole = '',
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onPrepare,
  onConfirmDelivery,
  onComplete,
  onCancel,
  onResubmit,
  onResendEmail,
  loading = false
}) => {
  const { status } = goodsIssue
  
  // Kiểm tra role
  const isAdmin = userRole === 'Admin'
  const isManager = userRole === 'Manager'
  const isEmployee = userRole === 'Employee'
  const canApproveReject = isAdmin || isManager
  
  // Kiểm tra creator
  const isCreator = currentUserId === goodsIssue.createdByUserId

  // Nếu currentUserId chưa có thì chờ load
  if (currentUserId === undefined) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-pulse">Đang tải...</div>
      </div>
    )
  }
  
  const buttons: React.ReactNode[] = []

  // Logic theo matrix quyền hạn và status workflow của GoodsIssue:
  switch (status) {
    case 'Draft':
      // Creator có thể sửa và xóa
      if (isCreator) {
        buttons.push(
          <Button
            key="edit"
            size="sm"
            variant="secondary"
            onClick={() => onEdit?.(goodsIssue)}
            disabled={loading}
          >
            <Edit className="w-3 h-3 mr-1" />
            Sửa
          </Button>
        )
        
        buttons.push(
          <Button
            key="delete"
            size="sm"
            variant="danger"
            onClick={() => onDelete?.(goodsIssue)}
            disabled={loading}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Xóa
          </Button>
        )
      }
      break

    case 'AwaitingApproval':
      // Admin/Manager có thể duyệt hoặc từ chối
      if (canApproveReject) {
        buttons.push(
          <Button
            key="approve"
            size="sm"
            onClick={() => onApprove?.(goodsIssue)}
            disabled={loading}
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
            onClick={() => onReject?.(goodsIssue)}
            disabled={loading}
          >
            <X className="w-3 h-3 mr-1" />
            Từ chối
          </Button>
        )
      }
      // Employee creator có thể hủy
      else if (isEmployee && isCreator) {
        buttons.push(
          <Button
            key="cancel"
            size="sm"
            variant="danger"
            onClick={() => onCancel?.(goodsIssue)}
            disabled={loading}
          >
            <X className="w-3 h-3 mr-1" />
            Hủy
          </Button>
        )
      }
      break

    case 'Approved':
      // Admin/Manager/WarehouseStaff có thể bắt đầu chuẩn bị
      if (canApproveReject || userRole === 'WarehouseStaff') {
        buttons.push(
          <Button
            key="prepare"
            size="sm"
            onClick={() => onPrepare?.(goodsIssue)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Package className="w-3 h-3 mr-1" />
            Chuẩn bị
          </Button>
        )
      }
      break

    case 'InPreparation':
      // Warehouse staff có thể đánh dấu sẵn sàng giao hàng (chuyển sang ReadyForDelivery)
      // Backend không có endpoint này nên tạm thời bỏ qua
      break

    case 'ReadyForDelivery':
      // Delivery staff có thể bắt đầu giao hàng (chuyển sang InTransit)
      // Backend không có endpoint này nên tạm thời bỏ qua
      break

    case 'InTransit':
      // Delivery staff có thể xác nhận đã giao (chuyển sang Delivered)
      if (canApproveReject || userRole === 'DeliveryStaff') {
        buttons.push(
          <Button
            key="confirm-delivery"
            size="sm"
            onClick={() => onConfirmDelivery?.(goodsIssue)}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Truck className="w-3 h-3 mr-1" />
            Xác nhận giao
          </Button>
        )
      }
      break

    case 'Delivered':
      // Admin/Manager có thể hoàn thành
      if (canApproveReject) {
        buttons.push(
          <Button
            key="complete"
            size="sm"
            onClick={() => onComplete?.(goodsIssue)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Button>
        )
      }
      break

    case 'Rejected':
      // Employee creator có thể xóa, sửa, gửi lại
      if (isEmployee && isCreator) {
        buttons.push(
          <Button
            key="delete"
            size="sm"
            variant="danger"
            onClick={() => onDelete?.(goodsIssue)}
            disabled={loading}
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
            onClick={() => onEdit?.(goodsIssue)}
            disabled={loading}
          >
            <Edit className="w-3 h-3 mr-1" />
            Sửa
          </Button>
        )
        
        buttons.push(
          <Button
            key="resubmit"
            size="sm"
            onClick={() => onResubmit?.(goodsIssue)}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Check className="w-3 h-3 mr-1" />
            Gửi lại
          </Button>
        )
      }
      break

    case 'Completed':
      // Tất cả → rỗng (có thể thêm resend email sau)
      if (onResendEmail) {
        buttons.push(
          <Button
            key="resend-email"
            size="sm"
            variant="outline"
            onClick={() => onResendEmail?.(goodsIssue)}
            disabled={loading}
          >
            <Mail className="w-3 h-3 mr-1" />
            Gửi email
          </Button>
        )
      }
      break

    case 'Cancelled':
      // Employee creator → xóa
      if (isEmployee && isCreator) {
        buttons.push(
          <Button
            key="delete"
            size="sm"
            variant="danger"
            onClick={() => onDelete?.(goodsIssue)}
            disabled={loading}
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

export { ActionButtons }

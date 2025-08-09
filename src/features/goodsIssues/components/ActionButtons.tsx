import React from 'react'
import { Button } from '@/components/ui/Button'
import type { GoodsIssue, GoodsIssueStatus } from '@/types'
import { 
  Check, 
  X, 
  Send, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Mail,
  FileDown,
  Edit,
  Eye,
  Trash2
} from 'lucide-react'

interface ActionButtonsProps {
  goodsIssue: GoodsIssue
  currentUserId?: number
  userRole?: string
  onEdit?: (goodsIssue: GoodsIssue) => void
  onView?: (goodsIssue: GoodsIssue) => void
  onDelete?: (goodsIssue: GoodsIssue) => void
  onSubmitForApproval?: (goodsIssue: GoodsIssue) => void
  onApprove?: (goodsIssue: GoodsIssue) => void
  onReject?: (goodsIssue: GoodsIssue) => void
  onPrepare?: (goodsIssue: GoodsIssue) => void
  onMarkReadyForDelivery?: (goodsIssue: GoodsIssue) => void
  onStartDelivery?: (goodsIssue: GoodsIssue) => void
  onConfirmDelivery?: (goodsIssue: GoodsIssue) => void
  onComplete?: (goodsIssue: GoodsIssue) => void
  onCancel?: (goodsIssue: GoodsIssue) => void
  onResubmit?: (goodsIssue: GoodsIssue) => void
  onResendEmail?: (goodsIssue: GoodsIssue) => void
  onExportPDF?: (goodsIssue: GoodsIssue) => void
  loading?: boolean
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  goodsIssue,
  currentUserId,
  userRole = 'User',
  onEdit,
  onView,
  onDelete,
  onSubmitForApproval,
  onApprove,
  onReject,
  onPrepare,
  onMarkReadyForDelivery,
  onStartDelivery,
  onConfirmDelivery,
  onComplete,
  onCancel,
  onResubmit,
  onResendEmail,
  onExportPDF,
  loading = false
}) => {
  const status = goodsIssue.status as GoodsIssueStatus
  const isCreator = currentUserId === goodsIssue.createdByUserId
  const canApprove = userRole === 'Manager' || userRole === 'Admin'
  const canManageDelivery = userRole === 'Manager' || userRole === 'Admin' || userRole === 'WarehouseStaff'

  const getAvailableActions = () => {
    const actions: React.ReactElement[] = []

    // View action - always available
    if (onView) {
      actions.push(
        <Button
          key="view"
          variant="outline"
          size="sm"
          onClick={() => onView(goodsIssue)}
          disabled={loading}
        >
          <Eye className="w-4 h-4" />
          Xem
        </Button>
      )
    }

    // Status-specific workflow actions
    switch (status) {
      case 'Draft':
        if (isCreator && onEdit) {
          actions.push(
            <Button
              key="edit"
              variant="outline"
              size="sm"
              onClick={() => onEdit(goodsIssue)}
              disabled={loading}
            >
              <Edit className="w-4 h-4" />
              Sửa
            </Button>
          )
        }
        if (isCreator && onSubmitForApproval) {
          actions.push(
            <Button
              key="submit-approval"
              variant="primary"
              size="sm"
              onClick={() => onSubmitForApproval(goodsIssue)}
              disabled={loading}
            >
              <Send className="w-4 h-4" />
              Gửi phê duyệt
            </Button>
          )
        }
        if (isCreator && onDelete) {
          actions.push(
            <Button
              key="delete"
              variant="danger"
              size="sm"
              onClick={() => onDelete(goodsIssue)}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
          )
        }
        break

      case 'AwaitingApproval':
        if (canApprove && onApprove) {
          actions.push(
            <Button
              key="approve"
              variant="success"
              size="sm"
              onClick={() => onApprove(goodsIssue)}
              disabled={loading}
            >
              <Check className="w-4 h-4" />
              Phê duyệt
            </Button>
          )
        }
        if (canApprove && onReject) {
          actions.push(
            <Button
              key="reject"
              variant="danger"
              size="sm"
              onClick={() => onReject(goodsIssue)}
              disabled={loading}
            >
              <X className="w-4 h-4" />
              Từ chối
            </Button>
          )
        }
        if (onCancel) {
          actions.push(
            <Button
              key="cancel"
              variant="outline"
              size="sm"
              onClick={() => onCancel(goodsIssue)}
              disabled={loading}
            >
              <XCircle className="w-4 h-4" />
              Hủy
            </Button>
          )
        }
        break

      case 'Approved':
        if (canManageDelivery && onPrepare) {
          actions.push(
            <Button
              key="prepare"
              variant="primary"
              size="sm"
              onClick={() => onPrepare(goodsIssue)}
              disabled={loading}
            >
              <Package className="w-4 h-4" />
              Chuẩn bị hàng
            </Button>
          )
        }
        break

      case 'InPreparation':
        if (canManageDelivery && onMarkReadyForDelivery) {
          actions.push(
            <Button
              key="ready-delivery"
              variant="primary"
              size="sm"
              onClick={() => onMarkReadyForDelivery(goodsIssue)}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4" />
              Sẵn sàng giao
            </Button>
          )
        }
        break

      case 'ReadyForDelivery':
        if (canManageDelivery && onStartDelivery) {
          actions.push(
            <Button
              key="start-delivery"
              variant="primary"
              size="sm"
              onClick={() => onStartDelivery(goodsIssue)}
              disabled={loading}
            >
              <Truck className="w-4 h-4" />
              Bắt đầu giao
            </Button>
          )
        }
        break

      case 'InTransit':
        if (canManageDelivery && onConfirmDelivery) {
          actions.push(
            <Button
              key="confirm-delivery"
              variant="success"
              size="sm"
              onClick={() => onConfirmDelivery(goodsIssue)}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4" />
              Xác nhận giao
            </Button>
          )
        }
        break

      case 'Delivered':
        if (canManageDelivery && onComplete) {
          actions.push(
            <Button
              key="complete"
              variant="success"
              size="sm"
              onClick={() => onComplete(goodsIssue)}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4" />
              Hoàn thành
            </Button>
          )
        }
        break

      case 'Rejected':
        if (isCreator && onEdit) {
          actions.push(
            <Button
              key="edit"
              variant="outline"
              size="sm"
              onClick={() => onEdit(goodsIssue)}
              disabled={loading}
            >
              <Edit className="w-4 h-4" />
              Sửa
            </Button>
          )
        }
        if (isCreator && onResubmit) {
          actions.push(
            <Button
              key="resubmit"
              variant="primary"
              size="sm"
              onClick={() => onResubmit(goodsIssue)}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" />
              Gửi lại
            </Button>
          )
        }
        break
    }

    // Common actions for completed workflows
    if (['Approved', 'InPreparation', 'ReadyForDelivery', 'InTransit', 'Delivered', 'Completed'].includes(status)) {
      if (onExportPDF) {
        actions.push(
          <Button
            key="export-pdf"
            variant="outline"
            size="sm"
            onClick={() => onExportPDF(goodsIssue)}
            disabled={loading}
          >
            <FileDown className="w-4 h-4" />
            PDF
          </Button>
        )
      }
      if (onResendEmail) {
        actions.push(
          <Button
            key="resend-email"
            variant="outline"
            size="sm"
            onClick={() => onResendEmail(goodsIssue)}
            disabled={loading}
          >
            <Mail className="w-4 h-4" />
            Gửi email
          </Button>
        )
      }
    }

    return actions
  }

  const availableActions = getAvailableActions()

  if (availableActions.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {availableActions}
    </div>
  )
}

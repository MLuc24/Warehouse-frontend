import React from 'react'
import { Button } from '@/components/ui'
import { Check, X, Package, Mail } from 'lucide-react'
import type { GoodsReceipt } from '@/types'

interface ActionButtonsProps {
  goodsReceipt: GoodsReceipt
  currentUserRole: string
  onApprove?: (goodsReceiptId: number) => void
  onReject?: (goodsReceiptId: number) => void
  onComplete?: (goodsReceiptId: number) => void
  onResendEmail?: (goodsReceiptId: number) => void
  disabled?: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  goodsReceipt,
  currentUserRole,
  onApprove,
  onReject,
  onComplete,
  onResendEmail,
  disabled = false
}) => {
  const { status } = goodsReceipt
  const isAdmin = currentUserRole === 'Admin'
  const isManager = currentUserRole === 'Manager'
  const isEmployee = currentUserRole === 'Employee'
  const canApprove = isAdmin || isManager
  const canComplete = isAdmin || isManager || isEmployee

  // Không hiện button nào nếu phiếu đã hoàn thành hoặc đã hủy
  if (status === 'Completed' || status === 'Cancelled' || status === 'Rejected') {
    return null
  }

  const buttons = []

  // Nếu phiếu đang chờ phê duyệt và user có quyền approve
  if (status === 'AwaitingApproval' && canApprove) {
    buttons.push(
      <Button
        key="approve"
        size="sm"
        onClick={() => onApprove?.(goodsReceipt.goodsReceiptId!)}
        disabled={disabled}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Check className="w-3 h-3 mr-1" />
        Phê duyệt
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

  // Nếu phiếu đang chờ supplier và có thể gửi lại email
  if (status === 'Pending') {
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

  // Nếu supplier đã xác nhận và user có quyền complete
  if (status === 'SupplierConfirmed' && canComplete) {
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
  }

  if (buttons.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1">
      {buttons}
    </div>
  )
}

export default ActionButtons

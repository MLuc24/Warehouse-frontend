export interface GoodsReceiptDetail {
  productId: number
  productName?: string
  productSku?: string
  quantity: number
  unitPrice: number
  subtotal?: number
  unit?: string
  imageUrl?: string
}

export interface GoodsReceipt {
  goodsReceiptId?: number
  receiptNumber?: string
  supplierId: number
  supplierName?: string
  createdByUserId?: number
  createdByUserName?: string
  receiptDate?: string
  totalAmount?: number
  notes?: string
  status?: GoodsReceiptStatus
  details: GoodsReceiptDetail[]
}

export interface CreateGoodsReceiptDto {
  supplierId: number
  notes?: string
  details: {
    productId: number
    quantity: number
    unitPrice: number
  }[]
}

export interface UpdateGoodsReceiptDto {
  goodsReceiptId: number
  supplierId: number
  notes?: string
  status?: GoodsReceiptStatus
  details: {
    productId: number
    quantity: number
    unitPrice: number
  }[]
}

export interface GoodsReceiptFilterDto {
  receiptNumber?: string
  supplierId?: number
  supplierName?: string
  fromDate?: string
  toDate?: string
  status?: GoodsReceiptStatus
  minAmount?: number
  maxAmount?: number
  pageNumber?: number
  pageSize?: number
}

export interface PagedGoodsReceiptResult {
  items: GoodsReceipt[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export const GoodsReceiptStatus = {
  Draft: 'Draft',
  AwaitingApproval: 'AwaitingApproval',
  Pending: 'Pending', 
  SupplierConfirmed: 'SupplierConfirmed',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Rejected: 'Rejected'
} as const

export type GoodsReceiptStatus = typeof GoodsReceiptStatus[keyof typeof GoodsReceiptStatus]

// Workflow types
export interface WorkflowStatus {
  currentStatus: GoodsReceiptStatus
  availableActions: string[]
  canEdit: boolean
  canApprove: boolean
  canComplete: boolean
  requiresSupplierConfirmation: boolean
  approvalInfo?: ApprovalInfo
  supplierConfirmationInfo?: SupplierConfirmationInfo
  completionInfo?: CompletionInfo
}

export interface ApprovalInfo {
  approvedByUserName?: string
  approvedDate?: string
  approvalNotes?: string
}

export interface SupplierConfirmationInfo {
  confirmed?: boolean
  confirmedDate?: string
  emailSent: boolean
}

export interface CompletionInfo {
  completedByUserName?: string
  completedDate?: string
}

export interface ApprovalDto {
  goodsReceiptId: number
  action: 'Approve' | 'Reject'
  notes?: string
}

export interface SupplierConfirmationDto {
  confirmationToken: string
  confirmed: boolean
  notes?: string
}

export interface CompleteReceiptDto {
  goodsReceiptId: number
  notes?: string
}

export interface CanDeleteResult {
  canDelete: boolean
}

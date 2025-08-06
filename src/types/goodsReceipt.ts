export interface GoodsReceiptDetail {
  productId: number
  productName?: string
  productSku?: string
  quantity: number
  unitPrice: number
  subtotal?: number
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
  Pending: 'Pending', 
  Completed: 'Completed',
  Cancelled: 'Cancelled'
} as const

export type GoodsReceiptStatus = typeof GoodsReceiptStatus[keyof typeof GoodsReceiptStatus]

export interface CanDeleteResult {
  canDelete: boolean
}

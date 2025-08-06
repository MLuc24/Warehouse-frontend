import { 
  GOODS_RECEIPT_STATUS_LABELS, 
  GOODS_RECEIPT_STATUS_COLORS,
  VALIDATION_RULES 
} from '@/constants/goodsReceipt'
import type { GoodsReceipt, GoodsReceiptDetail } from '@/types'

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// Get status label in Vietnamese
export const getStatusLabel = (status: string): string => {
  return GOODS_RECEIPT_STATUS_LABELS[status as keyof typeof GOODS_RECEIPT_STATUS_LABELS] || status
}

// Get status color for Badge component
export const getStatusColor = (status: string): 'gray' | 'yellow' | 'green' | 'red' => {
  return GOODS_RECEIPT_STATUS_COLORS[status as keyof typeof GOODS_RECEIPT_STATUS_COLORS] || 'gray'
}

// Calculate total amount from details
export const calculateTotalAmount = (details: GoodsReceiptDetail[]): number => {
  return details.reduce((total, detail) => {
    return total + (detail.quantity * detail.unitPrice)
  }, 0)
}

// Calculate subtotal for a detail item
export const calculateSubtotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice
}

// Validate quantity
export const validateQuantity = (quantity: number): string | null => {
  if (quantity < VALIDATION_RULES.QUANTITY.MIN || quantity > VALIDATION_RULES.QUANTITY.MAX) {
    return `Số lượng phải từ ${VALIDATION_RULES.QUANTITY.MIN} đến ${VALIDATION_RULES.QUANTITY.MAX.toLocaleString()}`
  }
  return null
}

// Validate unit price
export const validateUnitPrice = (price: number): string | null => {
  if (price < VALIDATION_RULES.UNIT_PRICE.MIN || price > VALIDATION_RULES.UNIT_PRICE.MAX) {
    return `Đơn giá phải từ ${VALIDATION_RULES.UNIT_PRICE.MIN} đến ${VALIDATION_RULES.UNIT_PRICE.MAX.toLocaleString()}`
  }
  return null
}

// Check if goods receipt can be edited
export const canEditGoodsReceipt = (status: string): boolean => {
  return status === 'Draft' || status === 'Pending'
}

// Check if goods receipt can be deleted
export const canDeleteGoodsReceipt = (status: string): boolean => {
  return status === 'Draft' || status === 'Cancelled'
}

// Generate receipt number display format
export const formatReceiptNumber = (receiptNumber: string): string => {
  return receiptNumber || 'Chưa có số phiếu'
}

// Sort goods receipts by date (newest first)
export const sortGoodsReceiptsByDate = (receipts: GoodsReceipt[]): GoodsReceipt[] => {
  return [...receipts].sort((a, b) => {
    if (!a.receiptDate || !b.receiptDate) return 0
    return new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime()
  })
}

// Filter goods receipts by status
export const filterGoodsReceiptsByStatus = (receipts: GoodsReceipt[], status: string): GoodsReceipt[] => {
  if (!status) return receipts
  return receipts.filter(receipt => receipt.status === status)
}

// Search goods receipts by receipt number or supplier name
export const searchGoodsReceipts = (receipts: GoodsReceipt[], searchTerm: string): GoodsReceipt[] => {
  if (!searchTerm.trim()) return receipts
  
  const term = searchTerm.toLowerCase()
  return receipts.filter(receipt => 
    receipt.receiptNumber?.toLowerCase().includes(term) ||
    receipt.supplierName?.toLowerCase().includes(term)
  )
}

// Check for duplicate products in details
export const hasDuplicateProducts = (details: GoodsReceiptDetail[]): boolean => {
  const productIds = details.map(detail => detail.productId)
  return productIds.length !== new Set(productIds).size
}

// Remove duplicate products from details (keep last occurrence)
export const removeDuplicateProducts = (details: GoodsReceiptDetail[]): GoodsReceiptDetail[] => {
  const seen = new Set<number>()
  return details.filter(detail => {
    if (seen.has(detail.productId)) {
      return false
    }
    seen.add(detail.productId)
    return true
  }).reverse() // Reverse to keep last occurrence
}

// Generate default values for new goods receipt
export const getDefaultGoodsReceipt = (): Partial<GoodsReceipt> => {
  return {
    supplierId: 0,
    notes: '',
    details: []
  }
}

// Generate default values for new goods receipt detail
export const getDefaultGoodsReceiptDetail = (): Omit<GoodsReceiptDetail, 'productId'> => {
  return {
    quantity: 1,
    unitPrice: 0
  }
}

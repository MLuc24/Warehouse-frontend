import type { GoodsReceipt, GoodsReceiptDetail, GoodsReceiptStatus } from '@/types'
import { GOODS_RECEIPT_STATUS_LABELS, GOODS_RECEIPT_STATUS_COLORS } from '@/constants/goodsReceipt'

// Format tiền tệ VND
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Format ngày tháng
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// Format ngày ngắn gọn
export const formatShortDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(dateString))
}

// Lấy label của status
export const getStatusLabel = (status: GoodsReceiptStatus): string => {
  return GOODS_RECEIPT_STATUS_LABELS[status] || status
}

// Lấy màu của status
export const getStatusColor = (status: GoodsReceiptStatus): string => {
  return GOODS_RECEIPT_STATUS_COLORS[status] || 'gray'
}

// Tính tổng tiền của một detail
export const calculateDetailSubtotal = (detail: GoodsReceiptDetail): number => {
  return detail.quantity * detail.unitPrice
}

// Tính tổng tiền của phiếu nhập
export const calculateTotalAmount = (details: GoodsReceiptDetail[]): number => {
  return details.reduce((total, detail) => total + calculateDetailSubtotal(detail), 0)
}

// Kiểm tra có thể chỉnh sửa phiếu nhập không
export const canEditGoodsReceipt = (status: GoodsReceiptStatus): boolean => {
  return status === 'Draft' || status === 'Pending'
}

// Kiểm tra có thể xóa phiếu nhập không
export const canDeleteGoodsReceipt = (status: GoodsReceiptStatus): boolean => {
  return status === 'Draft' || status === 'Cancelled'
}

// Validate detail item
export const validateDetail = (detail: GoodsReceiptDetail): string[] => {
  const errors: string[] = []
  
  if (!detail.productId) {
    errors.push('Vui lòng chọn sản phẩm')
  }
  
  if (!detail.quantity || detail.quantity < 1) {
    errors.push('Số lượng phải lớn hơn 0')
  }
  
  if (detail.quantity > 999999) {
    errors.push('Số lượng không được vượt quá 999,999')
  }
  
  if (!detail.unitPrice || detail.unitPrice <= 0) {
    errors.push('Đơn giá phải lớn hơn 0')
  }
  
  if (detail.unitPrice > 999999999.99) {
    errors.push('Đơn giá không được vượt quá 999,999,999.99')
  }
  
  return errors
}

// Validate goods receipt
export const validateGoodsReceipt = (receipt: Partial<GoodsReceipt>): string[] => {
  const errors: string[] = []
  
  if (!receipt.supplierId) {
    errors.push('Vui lòng chọn nhà cung cấp')
  }
  
  if (!receipt.details || receipt.details.length === 0) {
    errors.push('Phải có ít nhất 1 sản phẩm')
  }
  
  if (receipt.details) {
    // Kiểm tra duplicate products
    const productIds = receipt.details.map(d => d.productId)
    const uniqueProductIds = new Set(productIds)
    if (productIds.length !== uniqueProductIds.size) {
      errors.push('Không được có sản phẩm trùng lặp')
    }
    
    // Validate từng detail
    receipt.details.forEach((detail, index) => {
      const detailErrors = validateDetail(detail)
      detailErrors.forEach(error => {
        errors.push(`Sản phẩm ${index + 1}: ${error}`)
      })
    })
  }
  
  return errors
}

// Generate receipt number format
export const generateReceiptNumberPattern = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `GR${year}${month}${day}`
}

// Parse receipt date for display
export const parseReceiptDate = (dateString: string): Date => {
  return new Date(dateString)
}

// Format receipt number for search
export const formatReceiptNumberForSearch = (receiptNumber: string): string => {
  return receiptNumber.toUpperCase().trim()
}

// Create empty detail item
export const createEmptyDetail = (): GoodsReceiptDetail => ({
  productId: 0,
  productName: '',
  productSku: '',
  quantity: 1,
  unitPrice: 0
})

// Create empty goods receipt
export const createEmptyGoodsReceipt = (): Partial<GoodsReceipt> => ({
  supplierId: 0,
  notes: '',
  details: [createEmptyDetail()]
})

// Sort goods receipts by date (newest first)
export const sortGoodsReceiptsByDate = (receipts: GoodsReceipt[]): GoodsReceipt[] => {
  return [...receipts].sort((a, b) => {
    if (!a.receiptDate || !b.receiptDate) return 0
    return new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime()
  })
}

// Filter goods receipts by status
export const filterGoodsReceiptsByStatus = (
  receipts: GoodsReceipt[], 
  status: GoodsReceiptStatus
): GoodsReceipt[] => {
  return receipts.filter(receipt => receipt.status === status)
}

// Search goods receipts by text
export const searchGoodsReceipts = (
  receipts: GoodsReceipt[], 
  searchTerm: string
): GoodsReceipt[] => {
  if (!searchTerm.trim()) return receipts
  
  const term = searchTerm.toLowerCase().trim()
  return receipts.filter(receipt => 
    receipt.receiptNumber?.toLowerCase().includes(term) ||
    receipt.supplierName?.toLowerCase().includes(term) ||
    receipt.notes?.toLowerCase().includes(term)
  )
}

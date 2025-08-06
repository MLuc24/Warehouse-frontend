export const GOODS_RECEIPT_STATUS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
} as const

export const GOODS_RECEIPT_STATUS_LABELS = {
  [GOODS_RECEIPT_STATUS.DRAFT]: 'Nháp',
  [GOODS_RECEIPT_STATUS.PENDING]: 'Chờ xử lý',
  [GOODS_RECEIPT_STATUS.COMPLETED]: 'Hoàn thành',
  [GOODS_RECEIPT_STATUS.CANCELLED]: 'Đã hủy'
} as const

export const GOODS_RECEIPT_STATUS_COLORS = {
  [GOODS_RECEIPT_STATUS.DRAFT]: 'gray',
  [GOODS_RECEIPT_STATUS.PENDING]: 'yellow',
  [GOODS_RECEIPT_STATUS.COMPLETED]: 'green',
  [GOODS_RECEIPT_STATUS.CANCELLED]: 'red'
} as const

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const GOODS_RECEIPT_ROUTES = {
  LIST: '/goods-receipts',
  CREATE: '/goods-receipts/create',
  EDIT: '/goods-receipts/edit',
  DETAIL: '/goods-receipts/detail'
} as const

export const VALIDATION_RULES = {
  QUANTITY: {
    MIN: 1,
    MAX: 999999
  },
  UNIT_PRICE: {
    MIN: 0.01,
    MAX: 999999999.99
  },
  MIN_DETAILS: 1
} as const

export const ERROR_MESSAGES = {
  FETCH_ERROR: 'Có lỗi xảy ra khi tải dữ liệu phiếu nhập',
  CREATE_ERROR: 'Có lỗi xảy ra khi tạo phiếu nhập',
  UPDATE_ERROR: 'Có lỗi xảy ra khi cập nhật phiếu nhập',
  DELETE_ERROR: 'Có lỗi xảy ra khi xóa phiếu nhập',
  INVALID_QUANTITY: 'Số lượng phải từ 1 đến 999,999',
  INVALID_PRICE: 'Đơn giá phải từ 0.01 đến 999,999,999.99',
  REQUIRED_SUPPLIER: 'Vui lòng chọn nhà cung cấp',
  REQUIRED_DETAILS: 'Phải có ít nhất 1 sản phẩm',
  DUPLICATE_PRODUCT: 'Sản phẩm đã tồn tại trong danh sách'
} as const

export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Tạo phiếu nhập thành công',
  UPDATE_SUCCESS: 'Cập nhật phiếu nhập thành công',
  DELETE_SUCCESS: 'Xóa phiếu nhập thành công'
} as const

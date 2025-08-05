export interface ProductExpiryDto {
  productId: number
  sku: string
  productName: string
  category?: string
  expiryDate?: string
  isPerishable: boolean
  storageType?: string
  currentStock: number
  unit?: string  // Added unit field
  daysUntilExpiry: number
  status: ExpiryStatus
}

export const ExpiryStatus = {
  NoExpiryDate: 'NoExpiryDate',
  Fresh: 'Fresh',
  ExpiringWithinMonth: 'ExpiringWithinMonth',
  ExpiringSoon: 'ExpiringSoon',
  Expired: 'Expired'
} as const

export type ExpiryStatus = typeof ExpiryStatus[keyof typeof ExpiryStatus]

export interface UpdateProductExpiryDto {
  productId: number
  expiryDate?: string
  isPerishable: boolean
  storageType?: string
}

export interface ExpiryReportDto {
  totalPerishableProducts: number
  expiredProducts: number
  expiringSoonProducts: number
  expiringWithinMonthProducts: number
  totalExpiredValue: number
  totalExpiringSoonValue: number
  expiredItems: ProductExpiryDto[]
  expiringSoonItems: ProductExpiryDto[]
  expiringWithinMonthItems: ProductExpiryDto[]
}

export interface ExpirySearchDto {
  status?: ExpiryStatus
  expiryFromDate?: string
  expiryToDate?: string
  category?: string
  storageType?: string
  isPerishable?: boolean
  page?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}

export interface ExpiryAlertDto {
  productId: number
  sku: string
  productName: string
  expiryDate?: string
  currentStock: number
  unit?: string  // Added unit field
  totalValue?: number
  status: ExpiryStatus
  daysUntilExpiry: number
  alertLevel: string
  alertCreatedAt: string
}

export interface ExpiryAlertSettingsDto {
  daysBeforeExpiry: number
  earlyWarningDays: number
  enableEmailNotification: boolean
  enableSystemNotification: boolean
  notificationEmails: string[]
}

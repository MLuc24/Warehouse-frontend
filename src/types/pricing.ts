export interface ProductPricingDto {
  productId: number
  sku: string
  productName: string
  imageUrl?: string
  purchasePrice?: number
  sellingPrice?: number
  profitMargin?: number
  profitAmount?: number
  lastPriceUpdate?: string
}

export interface UpdateProductPricingDto {
  productId: number
  purchasePrice?: number
  sellingPrice?: number
  priceChangeReason?: string
}

export interface BulkUpdatePricingDto {
  productIds: number[]
  updateType: PriceUpdateType
  value: number
  priceChangeReason?: string
}

export const PriceUpdateType = {
  SetPurchasePrice: 'SetPurchasePrice',
  SetSellingPrice: 'SetSellingPrice',
  IncreasePurchasePercent: 'IncreasePurchasePercent',
  DecreasePurchasePercent: 'DecreasePurchasePercent',
  IncreaseSellingPercent: 'IncreaseSellingPercent',
  DecreaseSellingPercent: 'DecreaseSellingPercent',
  SetMarginPercent: 'SetMarginPercent'
} as const

export type PriceUpdateType = typeof PriceUpdateType[keyof typeof PriceUpdateType]

export interface PriceHistoryDto {
  id: number
  productId: number
  productName: string
  sku: string
  oldPurchasePrice?: number
  newPurchasePrice?: number
  oldSellingPrice?: number
  newSellingPrice?: number
  reason?: string
  changedBy: string
  changedAt: string
}

export interface PricingAnalysisDto {
  totalProducts: number
  productsWithoutPurchasePrice: number
  productsWithoutSellingPrice: number
  productsWithNegativeMargin: number
  productsWithHighMargin: number
  averagePurchasePrice: number
  averageSellingPrice: number
  averageMarginPercent: number
  topProfitableProducts: ProductPricingDto[]
  lowMarginProducts: ProductPricingDto[]
}

export interface BulkOperationResultDto {
  successCount: number
  failureCount: number
  failedItems: Array<{
    id: number
    error: string
  }>
}

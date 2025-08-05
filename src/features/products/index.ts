// Product Master Page (Gộp tất cả header, tab navigation, overview thành 1 component)
export { ProductMasterPage } from './ProductMasterPage'

// Product Header (Moved out of overview)
export { ProductHeader } from './ProductHeader'

// Product Overview Components (Chỉ chứa 3 lớp chính: ProductList, ProductInline, ProductStats)
export * from './overview'

// Categories & Stock Management (Tuần 4-5)
export * from './category'
export { StockTable } from './stock'

// Pricing Management (Tuần 6)
export * from './pricing'

// Expiry Management (Tuần 7)
export { ExpiryManagement, ExpiryTable, ExpiryAlerts, EditExpiryModal } from './expire'

// Analytics & Reports (Tuần 8)
export { AnalyticsManagement } from './AnalyticsManagement'
export { AnalyticsCards } from './AnalyticsCards'
export { AlertsDashboard } from './AlertsDashboard'
export { ProfitabilityInsights } from './ProfitabilityInsights'

// Integration & Polish (Tuần 10)
export { ImportExportModal } from './ImportExportModal'
export { SettingsManagement } from './SettingsManagement'

// Utility Components
export { ComingSoonPlaceholder } from './ComingSoonPlaceholder'

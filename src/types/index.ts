// Auth types
export interface LoginRequest {
  username: string; // Can be username or email
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface User {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: boolean;
  createdAt: string;
}

export interface CompleteRegistrationRequest {
  contact: string;  // Email hoặc phone
  type: string;     // "Email" hoặc "Phone"
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SendVerificationRequest {
  contact: string;  // Email hoặc phone  
  type: string;     // "Email" hoặc "Phone"
  purpose: string;  // "Registration" hoặc "ForgotPassword"
}

export interface VerifyCodeRequest {
  contact: string;
  code: string;
  type: string;
  purpose: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Product types
export interface Product {
  productId: number;
  sku: string;
  productName: string;
  description?: string;
  supplierId?: number;
  supplierName?: string;
  categoryId?: number;
  categoryName?: string;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  imageUrl?: string;
  status?: boolean;
  createdAt?: string;
  currentStock: number;
  totalIssued: number;
  totalReceived: number;
  totalValue?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  expiryDate?: string;
  storageType?: string; // 🔥 FIXED: Add missing storageType
  isPerishable?: boolean; // 🔥 FIXED: Add missing isPerishable
}

export interface CreateProduct {
  sku: string;
  productName: string;
  description?: string;
  supplierId?: number;
  categoryId?: number;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  imageUrl?: string;
  status?: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
  expiryDate?: string;
  storageType?: string; // 🔥 FIXED: Add missing storageType
  isPerishable?: boolean; // 🔥 FIXED: Add missing isPerishable
}

export interface UpdateProduct {
  sku: string;
  productName: string;
  description?: string;
  supplierId?: number;
  categoryId?: number;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  imageUrl?: string;
  status?: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
  expiryDate?: string;
  storageType?: string; // 🔥 FIXED: Add missing storageType
  isPerishable?: boolean; // 🔥 FIXED: Add missing isPerishable
}

export interface ProductSearch {
  keyword?: string;
  sku?: string;
  supplierId?: number;
  status?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductStats {
  productId: number;
  productName: string;
  sku: string;
  totalReceived: number;
  totalIssued: number;
  currentStock: number;
  totalValue: number;
  monthlyMovements: MonthlyMovement[];
}

export interface MonthlyMovement {
  month: number;
  year: number;
  received: number;
  issued: number;
}

export interface ProductInventory {
  productId: number;
  sku: string;
  productName: string;
  currentStock: number;
  minStockLevel: number;
  unit?: string;
  lastUpdated: string;
}

// Category types (Updated - Using new Category model)
export interface Category {
  categoryId: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  storageType?: string;
  isPerishable: boolean;
  defaultMinStock?: number;
  defaultMaxStock?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  productCount: number;
}

export interface CreateCategory {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  storageType?: string;
  isPerishable?: boolean;
  defaultMinStock?: number;
  defaultMaxStock?: number;
  status?: boolean;
}

export interface UpdateCategory {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  storageType?: string;
  isPerishable?: boolean;
  defaultMinStock?: number;
  defaultMaxStock?: number;
  status?: boolean;
}

export interface DefaultCategory {
  name: string;
  description: string;
  icon: string;
  color: string;
  exampleProducts: string[];
  storageType: string;
  isPerishable: boolean;
  defaultMinStock: number;
  defaultMaxStock: number;
}

// Legacy types for backward compatibility
export interface ProductCategory {
  category: string;
  productCount: number;
  totalValue: number;
  totalStock: number;
}

export interface CategoryStatistics {
  category: string;
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  expiredProducts: number;
  totalPurchaseValue: number;
  totalSellingValue: number;
  averagePurchasePrice: number;
  averageSellingPrice: number;
}

export interface BulkUpdateCategory {
  productIds: number[];
  newCategory: string;
}

// Stock types (Tuần 4-5)
export interface ProductStock {
  productId: number;
  sku: string;
  productName: string;
  category?: string;
  currentStock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  totalValue?: number;
  lastUpdated: string;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
}

export interface StockAdjustment {
  productId: number;
  adjustmentType: 'Increase' | 'Decrease';
  quantity: number;
  reason: string;
  notes?: string;
}

export interface StockHistory {
  id: number;
  productId: number;
  date: string;
  type: 'receive' | 'issue' | 'adjust' | 'transfer';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  notes?: string;
  createdBy: string;
}

export interface BulkStockUpdate {
  updates: Array<{
    productId: number;
    adjustmentType: 'Increase' | 'Decrease';
    quantity: number;
    reason: string;
  }>;
}

export interface StockLevelsUpdate {
  minStockLevel: number;
  maxStockLevel?: number;
}

// Supplier types
export interface Supplier {
  supplierId: number;
  supplierName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  taxCode?: string;
  createdAt?: string;
  status: string; // "Active" | "Expired"
  totalProducts: number;
  totalReceipts: number;
  totalPurchaseValue?: number;
}

export interface CreateSupplier {
  supplierName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  taxCode?: string;
}

export interface UpdateSupplier {
  supplierName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  taxCode?: string;
}

export interface SupplierSearch {
  keyword?: string;
  email?: string;
  phoneNumber?: string;
  taxCode?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SupplierListResponse {
  items: Supplier[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupplierStats {
  supplierId: number;
  supplierName: string;
  totalProducts: number;
  totalReceipts: number;
  totalPurchaseValue: number;
  monthlyPurchases: MonthlyPurchase[];
}

export interface MonthlyPurchase {
  month: number;
  year: number;
  amount: number;
  receipts: number;
}

// Common types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Export pricing types
export * from './pricing'

// Export expiry types
export * from './expiry'

// Export dashboard types
export * from './dashboard'

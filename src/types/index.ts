// Auth types
export interface LoginRequest {
  username: string;
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
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: string;
  verificationCode: string;
}

// Product types
export interface Product {
  productId: number;
  sku: string;
  productName: string;
  description?: string;
  supplierId?: number;
  supplierName?: string;
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
}

export interface CreateProduct {
  sku: string;
  productName: string;
  description?: string;
  supplierId?: number;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  imageUrl?: string;
  status?: boolean;
}

export interface UpdateProduct {
  sku: string;
  productName: string;
  description?: string;
  supplierId?: number;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  imageUrl?: string;
  status?: boolean;
}

export interface ProductSearch {
  keyword?: string;
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

// Supplier types
export interface Supplier {
  supplierId: number;
  supplierName: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  taxCode?: string;
  createdAt?: string;
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

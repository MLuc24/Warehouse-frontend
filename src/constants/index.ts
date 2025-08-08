// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5063/api';

// Export units constants
export * from './units';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'warehouse_auth_token',
  USER_DATA: 'warehouse_user_data',
  THEME: 'warehouse_theme',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    LOGOUT: '/Auth/logout',
    ME: '/Auth/me',
    COMPLETE_REGISTRATION: '/Auth/complete-registration',
    SEND_VERIFICATION: '/Auth/verification/send-code',
    VERIFY_CODE: '/Auth/verification/verify-code',
    RESET_PASSWORD: '/Auth/forgot-password/reset',
  },
  PRODUCTS: {
    LIST: '/Product',
    CREATE: '/Product',
    UPDATE: (id: number) => `/Product/${id}`,
    DELETE: (id: number) => `/Product/${id}`,
    GET_BY_ID: (id: number) => `/Product/${id}`,
    GET_BY_SKU: (sku: string) => `/Product/sku/${sku}`,
    STATS: (id: number) => `/Product/${id}/stats`,
    TOP_PRODUCTS: '/Product/top-products',
    LOW_STOCK: '/Product/low-stock',
    BY_SUPPLIER: (supplierId: number) => `/Product/by-supplier/${supplierId}`,
    ACTIVE: '/Product/active',
    CAN_DELETE: (id: number) => `/Product/${id}/can-delete`,
    REACTIVATE: (id: number) => `/Product/${id}/reactivate`,
    HAS_INVENTORY_MOVEMENTS: (id: number) => `/Product/${id}/has-inventory-movements`,
    // Categories endpoints (legacy)
    CATEGORIES: {
      LIST: '/productcategory',
      LIST_NAMES: '/productcategory/list',
      STATISTICS: '/productcategory/statistics',
      CATEGORY_STATS: (category: string) => `/productcategory/${encodeURIComponent(category)}/statistics`,
      BULK_UPDATE: '/productcategory/bulk-update',
    },
    // Stock endpoints
    STOCK: {
      LIST: '/ProductStock',
      LOW_STOCK: '/ProductStock/low-stock',
      UPDATE: (id: number) => `/ProductStock/${id}`,
      BULK_UPDATE: '/ProductStock/bulk-update',
      HISTORY: (id: number) => `/ProductStock/${id}/history`,
      ADJUST: '/ProductStock/adjust',
      SET_STOCK_LEVELS: (id: number) => `/ProductStock/${id}/reorder-point`,
    },
  },
  CATEGORIES: {
    LIST: '/Category',
    CREATE: '/Category',
    UPDATE: (id: number) => `/Category/${id}`,
    DELETE: (id: number) => `/Category/${id}`,
    GET_BY_ID: (id: number) => `/Category/${id}`,
    ACTIVE: '/Category/active',
    DEFAULT: '/Category/default',
    SEED: '/Category/seed',
  },
  SUPPLIERS: {
    LIST: '/Supplier',
    CREATE: '/Supplier',
    UPDATE: (id: number) => `/Supplier/${id}`,
    DELETE: (id: number) => `/Supplier/${id}`,
    GET_BY_ID: (id: number) => `/Supplier/${id}`,
    STATS: (id: number) => `/Supplier/${id}/statistics`,
    TOP_SUPPLIERS: '/Supplier/top',
    CAN_DELETE: (id: number) => `/Supplier/${id}/can-delete`,
    REACTIVATE: (id: number) => `/Supplier/${id}/reactivate`,
    ACTIVE: '/Supplier/active',
  },
  WAREHOUSES: {
    LIST: '/warehouse',
    CREATE: '/warehouse',
    UPDATE: (id: number) => `/warehouse/${id}`,
    DELETE: (id: number) => `/warehouse/${id}`,
    GET_BY_ID: (id: number) => `/warehouse/${id}`,
    EXISTS: (id: number) => `/warehouse/${id}/exists`,
  },
  CUSTOMERS: {
    LIST: '/Customer',
    CREATE: '/Customer',
    UPDATE: (id: number) => `/Customer/${id}`,
    DELETE: (id: number) => `/Customer/${id}`,
    GET_BY_ID: (id: number) => `/Customer/${id}`,
    REACTIVATE: (id: number) => `/Customer/${id}/reactivate`,
    STATISTICS: (id: number) => `/Customer/${id}/statistics`,
    TOP: '/Customer/top',
    ACTIVE: '/Customer/active',
    BY_TYPE: (type: string) => `/Customer/by-type/${type}`,
    CAN_DELETE: (id: number) => `/Customer/${id}/can-delete`,
  },
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products/create',
    EDIT: (id: number) => `/products/${id}/edit`,
    VIEW: (id: number) => `/products/${id}`,
  },
  SUPPLIERS: {
    LIST: '/suppliers',
    CREATE: '/suppliers/create',
    EDIT: (id: number) => `/suppliers/${id}/edit`,
    VIEW: (id: number) => `/suppliers/${id}`,
  },
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers/create',
    EDIT: (id: number) => `/customers/${id}/edit`,
    VIEW: (id: number) => `/customers/${id}`,
  },
  WAREHOUSES: {
    LIST: '/warehouses',
    CREATE: '/warehouses/create',
    EDIT: (id: number) => `/warehouses/${id}/edit`,
    VIEW: (id: number) => `/warehouses/${id}`,
  },
  GOODS_RECEIPTS: {
    LIST: '/goods-receipts',
    CREATE: '/goods-receipts/create',
    EDIT: (id: number) => `/goods-receipts/${id}/edit`,
    VIEW: (id: number) => `/goods-receipts/${id}`,
  },
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
  USER: 'User',
} as const;

// Table pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
} as const;

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Toast duration
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

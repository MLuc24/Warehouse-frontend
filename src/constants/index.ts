// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5063/api';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'warehouse_auth_token',
  USER_DATA: 'warehouse_user_data',
  THEME: 'warehouse_theme',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    COMPLETE_REGISTRATION: '/auth/complete-registration',
    SEND_VERIFICATION: '/auth/verification/send-code',
    VERIFY_CODE: '/auth/verification/verify-code',
    RESET_PASSWORD: '/auth/forgot-password/reset',
  },
  PRODUCTS: {
    LIST: '/product',
    CREATE: '/product',
    UPDATE: (id: number) => `/product/${id}`,
    DELETE: (id: number) => `/product/${id}`,
    GET_BY_ID: (id: number) => `/product/${id}`,
    GET_BY_SKU: (sku: string) => `/product/sku/${sku}`,
    STATS: (id: number) => `/product/${id}/stats`,
    TOP_PRODUCTS: '/product/top-products',
    LOW_STOCK: '/product/low-stock',
    BY_SUPPLIER: (supplierId: number) => `/product/by-supplier/${supplierId}`,
  },
  SUPPLIERS: {
    LIST: '/supplier',
    CREATE: '/supplier',
    UPDATE: (id: number) => `/supplier/${id}`,
    DELETE: (id: number) => `/supplier/${id}`,
    GET_BY_ID: (id: number) => `/supplier/${id}`,
    STATS: (id: number) => `/supplier/${id}/statistics`,
    TOP_SUPPLIERS: '/supplier/top',
    CAN_DELETE: (id: number) => `/supplier/${id}/can-delete`,
  },
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
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
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
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

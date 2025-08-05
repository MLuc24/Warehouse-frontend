// Category types and interfaces

export interface Category {
  categoryId: number
  name: string
  description?: string
  icon?: string
  color?: string
  storageType?: string
  isPerishable: boolean
  defaultMinStock?: number
  defaultMaxStock?: number
  status: boolean
  createdAt?: string
  updatedAt?: string
  productCount: number
}

export interface CreateCategoryDto {
  name: string
  description?: string
  icon?: string
  color?: string
  storageType?: string
  isPerishable: boolean
  defaultMinStock?: number
  defaultMaxStock?: number
  status: boolean
}

export interface UpdateCategoryDto {
  name: string
  description?: string
  icon?: string
  color?: string
  storageType?: string
  isPerishable: boolean
  defaultMinStock?: number
  defaultMaxStock?: number
  status: boolean
}

export interface DefaultCategory {
  name: string
  description: string
  icon: string
  color: string
  exampleProducts: string[]
  storageType: string
  isPerishable: boolean
  defaultMinStock: number
  defaultMaxStock: number
}

// Form data interface
export interface CategoryFormData {
  name: string
  description: string
  icon: string
  color: string
  storageType: string
  isPerishable: boolean
  defaultMinStock: string
  defaultMaxStock: string
  status: boolean
}

// Form errors interface
export interface CategoryFormErrors {
  name?: string
  description?: string
  defaultMinStock?: string
  defaultMaxStock?: string
}

// Table column interface
export interface CategoryTableColumn {
  key: keyof Category | 'actions'
  label: string
  sortable?: boolean
  width?: string
}

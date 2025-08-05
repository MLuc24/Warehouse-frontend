import { apiService } from './api'
import type { Category, CreateCategoryDto, UpdateCategoryDto, DefaultCategory } from '../types/category'

// API endpoints
const ENDPOINTS = {
  categories: '/category',
  active: '/category/active',
  default: '/category/default',
  seed: '/category/seed',
  byId: (id: number) => `/category/${id}`
}

export const categoryApi = {
  // Lấy tất cả danh mục
  getAll: async (): Promise<Category[]> => {
    return await apiService.get<Category[]>(ENDPOINTS.categories)
  },

  // Lấy danh mục đang hoạt động
  getActive: async (): Promise<Category[]> => {
    return await apiService.get<Category[]>(ENDPOINTS.active)
  },

  // Lấy danh mục theo ID
  getById: async (id: number): Promise<Category> => {
    return await apiService.get<Category>(ENDPOINTS.byId(id))
  },

  // Tạo danh mục mới
  create: async (data: CreateCategoryDto): Promise<Category> => {
    return await apiService.post<Category>(ENDPOINTS.categories, data)
  },

  // Cập nhật danh mục
  update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    return await apiService.put<Category>(ENDPOINTS.byId(id), data)
  },

  // Xóa danh mục
  delete: async (id: number): Promise<void> => {
    await apiService.delete(ENDPOINTS.byId(id))
  },

  // Lấy danh mục mặc định TocoToco
  getDefault: async (): Promise<DefaultCategory[]> => {
    return await apiService.get<DefaultCategory[]>(ENDPOINTS.default)
  },

  // Khởi tạo dữ liệu mặc định
  seedDefault: async (): Promise<void> => {
    await apiService.post(ENDPOINTS.seed)
  },

  // Lấy danh mục cho dropdown/select
  getForDropdown: async (): Promise<Array<{value: string, label: string}>> => {
    const categories = await apiService.get<Category[]>(ENDPOINTS.active)
    return categories.map(category => ({
      value: category.categoryId.toString(),
      label: category.name
    }))
  }
}

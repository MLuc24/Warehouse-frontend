import { useState, useEffect } from 'react'
import { categoryApi } from '../services/category'
import type { Category, CreateCategoryDto, UpdateCategoryDto, DefaultCategory } from '../types/category'

// Hook để quản lý danh sách danh mục
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryApi.getAll()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
    const newCategory = await categoryApi.create(data)
    setCategories(prev => [...prev, newCategory])
    return newCategory
  }

  const updateCategory = async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    const updatedCategory = await categoryApi.update(id, data)
    setCategories(prev => prev.map(cat => 
      cat.categoryId === id ? updatedCategory : cat
    ))
    return updatedCategory
  }

  const deleteCategory = async (id: number): Promise<void> => {
    await categoryApi.delete(id)
    setCategories(prev => prev.filter(cat => cat.categoryId !== id))
  }

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

// Hook để quản lý danh mục đang hoạt động
export const useActiveCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActiveCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryApi.getActive()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchActiveCategories
  }
}

// Hook để quản lý danh mục mặc định
export const useDefaultCategories = () => {
  const [categories, setCategories] = useState<DefaultCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDefaultCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryApi.getDefault()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  const seedDefaultCategories = async (): Promise<void> => {
    await categoryApi.seedDefault()
    await fetchDefaultCategories()
  }

  useEffect(() => {
    fetchDefaultCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchDefaultCategories,
    seedDefault: seedDefaultCategories
  }
}

import React from 'react'
import { ComingSoonPlaceholder } from './ComingSoonPlaceholder'

/**
 * Category Table Component - Tuần 4-5 Implementation
 * Will include:
 * - Category CRUD operations
 * - Drag & drop reordering  
 * - Bulk operations
 * - Category analytics
 */
export const CategoryTable: React.FC = () => {
  return (
    <ComingSoonPlaceholder
      title="📋 Categories Management"
      description="Quản lý danh mục sản phẩm với đầy đủ tính năng CRUD"
      expectedWeeks={4}
      features={[
        'Danh sách danh mục với phân trang',
        'Thêm, sửa, xóa danh mục',
        'Kéo thả để sắp xếp thứ tự',
        'Thao tác hàng loạt',
        'Thống kê sản phẩm theo danh mục',
        'Tìm kiếm và lọc danh mục'
      ]}
    />
  )
}

export default CategoryTable

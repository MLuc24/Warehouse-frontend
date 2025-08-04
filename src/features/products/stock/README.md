# Stock Management Components

Thư mục này chứa các components được refactor từ `StockTable.tsx` để tăng tính module hóa và dễ bảo trì.

## Cấu trúc Components

### 📁 Main Components

- **`StockTable.tsx`** - Component chính tập hợp tất cả các modules con
- **`StockList.tsx`** - Component hiển thị danh sách stock dạng card layout
- **`StockFilters.tsx`** - Component filter và search

### 📁 Modal Components  

- **`StockAdjustmentModal.tsx`** - Modal điều chỉnh tồn kho
- **`ReorderPointModal.tsx`** - Modal cài đặt điểm đặt hàng lại
- **`StockHistoryModal.tsx`** - Modal xem lịch sử tồn kho

### 📁 UI Components

- **`StockStatusBadge.tsx`** - Badge hiển thị trạng thái tồn kho
- **`StockProgressBar.tsx`** - Progress bar hiển thị mức tồn kho

## Cách sử dụng

```tsx
import { StockTable } from '@/features/products/stock'

// Hoặc import specific components
import { 
  StockList, 
  StockFilters, 
  StockAdjustmentModal 
} from '@/features/products/stock'
```

## Tính năng

- ✅ Stock level management
- ✅ Low stock alerts
- ✅ Stock adjustment tools  
- ✅ Stock history tracking
- ✅ Reorder point management
- ✅ Filter và search
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

## Benefits của việc refactor

1. **Modularity**: Mỗi component có 1 trách nhiệm cụ thể
2. **Reusability**: Có thể tái sử dụng components con
3. **Maintainability**: Dễ sửa đổi và debug
4. **Testing**: Dễ test từng component riêng biệt
5. **Performance**: Chỉ re-render components cần thiết

/**
 * Common Units of Measurement for Products
 * Các đơn vị tính phổ biến cho sản phẩm
 */

export interface UnitOption {
  value: string;
  label: string;
  category: 'weight' | 'volume' | 'length' | 'area' | 'piece' | 'time' | 'other';
}

export const COMMON_UNITS: UnitOption[] = [
  // Đơn vị đếm (Piece)
  { value: 'cái', label: 'Cái', category: 'piece' },
  { value: 'chiếc', label: 'Chiếc', category: 'piece' },
  { value: 'con', label: 'Con', category: 'piece' },
  { value: 'bộ', label: 'Bộ', category: 'piece' },
  { value: 'hộp', label: 'Hộp', category: 'piece' },
  { value: 'thùng', label: 'Thùng', category: 'piece' },
  { value: 'túi', label: 'Túi', category: 'piece' },
  { value: 'gói', label: 'Gói', category: 'piece' },
  { value: 'chai', label: 'Chai', category: 'piece' },
  { value: 'lọ', label: 'Lọ', category: 'piece' },
  { value: 'cuộn', label: 'Cuộn', category: 'piece' },
  { value: 'tấm', label: 'Tấm', category: 'piece' },
  { value: 'thanh', label: 'Thanh', category: 'piece' },
  { value: 'cây', label: 'Cây', category: 'piece' },
  { value: 'viên', label: 'Viên', category: 'piece' },
  { value: 'hạt', label: 'Hạt', category: 'piece' },

  // Đơn vị khối lượng (Weight)
  { value: 'kg', label: 'Kilogram (kg)', category: 'weight' },
  { value: 'g', label: 'Gram (g)', category: 'weight' },
  { value: 'tấn', label: 'Tấn', category: 'weight' },
  { value: 'tạ', label: 'Tạ', category: 'weight' },
  { value: 'yến', label: 'Yến', category: 'weight' },
  { value: 'lạng', label: 'Lạng', category: 'weight' },

  // Đơn vị thể tích (Volume)
  { value: 'lít', label: 'Lít', category: 'volume' },
  { value: 'ml', label: 'Milliliter (ml)', category: 'volume' },
  { value: 'm³', label: 'Mét khối (m³)', category: 'volume' },
  { value: 'cm³', label: 'Centimet khối (cm³)', category: 'volume' },

  // Đơn vị độ dài (Length)
  { value: 'm', label: 'Mét (m)', category: 'length' },
  { value: 'cm', label: 'Centimet (cm)', category: 'length' },
  { value: 'mm', label: 'Millimet (mm)', category: 'length' },
  { value: 'km', label: 'Kilomet (km)', category: 'length' },
  { value: 'inch', label: 'Inch', category: 'length' },

  // Đơn vị diện tích (Area)
  { value: 'm²', label: 'Mét vuông (m²)', category: 'area' },
  { value: 'cm²', label: 'Centimet vuông (cm²)', category: 'area' },
  { value: 'ha', label: 'Hecta (ha)', category: 'area' },

  // Đơn vị thời gian (Time)
  { value: 'ngày', label: 'Ngày', category: 'time' },
  { value: 'tháng', label: 'Tháng', category: 'time' },
  { value: 'năm', label: 'Năm', category: 'time' },
  { value: 'giờ', label: 'Giờ', category: 'time' },

  // Đơn vị khác (Other)
  { value: 'đôi', label: 'Đôi', category: 'other' },
  { value: 'cặp', label: 'Cặp', category: 'other' },
  { value: 'lô', label: 'Lô', category: 'other' },
  { value: 'chục', label: 'Chục', category: 'other' },
  { value: 'trăm', label: 'Trăm', category: 'other' }
];

export const UNIT_CATEGORIES = {
  piece: 'Đơn vị đếm',
  weight: 'Khối lượng',
  volume: 'Thể tích',
  length: 'Độ dài',
  area: 'Diện tích',
  time: 'Thời gian',
  other: 'Khác'
};

/**
 * Get units by category
 */
export const getUnitsByCategory = (category: UnitOption['category']): UnitOption[] => {
  return COMMON_UNITS.filter(unit => unit.category === category);
};

/**
 * Get all units as options for dropdown
 */
export const getUnitsAsOptions = () => {
  return COMMON_UNITS.map(unit => ({
    value: unit.value,
    label: unit.label
  }));
};

/**
 * Get units grouped by category for optgroup
 */
export const getUnitsGrouped = () => {
  const grouped: Record<string, UnitOption[]> = {};
  
  COMMON_UNITS.forEach(unit => {
    if (!grouped[unit.category]) {
      grouped[unit.category] = [];
    }
    grouped[unit.category].push(unit);
  });
  
  return grouped;
};

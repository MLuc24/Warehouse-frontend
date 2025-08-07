import React from 'react'
import { Textarea } from '@/components/ui'
import { Package, Mail, Phone, MapPin } from 'lucide-react'

interface Supplier {
  supplierId: number
  supplierName: string
  email?: string
  phoneNumber?: string
  address?: string
}

interface BasicInfoSectionProps {
  formData: {
    supplierId: number
    notes: string
  }
  suppliers: Supplier[]
  errors: Record<string, string>
  onChange: (field: string, value: string | number) => void
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  suppliers,
  errors,
  onChange
}) => {
  const selectedSupplier = suppliers.find(s => s.supplierId === formData.supplierId)

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-blue-900">Thông tin cơ bản</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Selection */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Nhà cung cấp *
          </label>
          <select
            value={formData.supplierId}
            onChange={(e) => onChange('supplierId', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
          >
            <option value={0}>Chọn nhà cung cấp</option>
            {suppliers.map(supplier => (
              <option key={supplier.supplierId} value={supplier.supplierId}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
          {errors.supplierId && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {errors.supplierId}
            </p>
          )}

          {/* Supplier Details */}
          {selectedSupplier && (
            <div className="mt-4 p-4 bg-white border border-blue-200 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Thông tin nhà cung cấp</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-medium">{selectedSupplier.supplierName}</span>
                </div>
                {selectedSupplier.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{selectedSupplier.email}</span>
                  </div>
                )}
                {selectedSupplier.phoneNumber && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{selectedSupplier.phoneNumber}</span>
                  </div>
                )}
                {selectedSupplier.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{selectedSupplier.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Ghi chú
          </label>
          <Textarea
            value={formData.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('notes', e.target.value)}
            placeholder="Nhập ghi chú cho phiếu nhập..."
            rows={4}
            className="rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )
}

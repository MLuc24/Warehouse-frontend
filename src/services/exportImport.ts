import type { Product } from '@/types'

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx'
  fields: string[]
  filename?: string
}

export interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  duplicates: number
}

class ExportImportService {
  // Export data to CSV
  exportToCSV(data: any[], options: ExportOptions): void {
    if (data.length === 0) {
      throw new Error('Không có dữ liệu để xuất')
    }

    const headers = options.fields
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(field => {
          const value = this.getNestedValue(row, field)
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ''
        }).join(',')
      )
    ].join('\n')

    this.downloadFile(csvContent, options.filename || 'export.csv', 'text/csv')
  }

  // Export data to JSON
  exportToJSON(data: any[], options: ExportOptions): void {
    if (data.length === 0) {
      throw new Error('Không có dữ liệu để xuất')
    }

    const filteredData = data.map(item => {
      const filtered: any = {}
      options.fields.forEach(field => {
        filtered[field] = this.getNestedValue(item, field)
      })
      return filtered
    })

    const jsonContent = JSON.stringify(filteredData, null, 2)
    this.downloadFile(jsonContent, options.filename || 'export.json', 'application/json')
  }

  // Import data from CSV
  async importFromCSV(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const csvData = e.target?.result as string
          const lines = csvData.split('\n').filter(line => line.trim())
          
          if (lines.length < 2) {
            throw new Error('File CSV không hợp lệ hoặc rỗng')
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
          const rows = lines.slice(1)
          
          const imported: any[] = []
          const errors: string[] = []
          
          rows.forEach((row, index) => {
            try {
              const values = this.parseCSVRow(row)
              if (values.length !== headers.length) {
                errors.push(`Dòng ${index + 2}: Số cột không khớp`)
                return
              }
              
              const item: any = {}
              headers.forEach((header, headerIndex) => {
                item[header] = values[headerIndex]?.trim().replace(/"/g, '') || ''
              })
              
              imported.push(item)
            } catch (error) {
              errors.push(`Dòng ${index + 2}: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`)
            }
          })

          resolve({
            success: errors.length === 0,
            imported: imported.length,
            errors,
            duplicates: 0 // Would need additional logic to detect duplicates
          })
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Không thể đọc file'))
      reader.readAsText(file)
    })
  }

  // Import data from JSON
  async importFromJSON(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const jsonData = e.target?.result as string
          const data = JSON.parse(jsonData)
          
          if (!Array.isArray(data)) {
            throw new Error('File JSON phải chứa một mảng dữ liệu')
          }

          resolve({
            success: true,
            imported: data.length,
            errors: [],
            duplicates: 0
          })
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Không thể đọc file JSON'))
        }
      }

      reader.onerror = () => reject(new Error('Không thể đọc file'))
      reader.readAsText(file)
    })
  }

  // Utility methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private parseCSVRow(row: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      const nextChar = row[i + 1]
      
      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"'
        i++ // Skip next quote
      } else if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  // Product-specific export templates
  getProductExportFields(): string[] {
    return [
      'id',
      'name',
      'sku',
      'category',
      'purchasePrice',
      'sellingPrice',
      'currentStock',
      'minStock',
      'maxStock',
      'expiryDate',
      'supplier',
      'status',
      'createdAt',
      'updatedAt'
    ]
  }

  validateProductImport(data: any[]): string[] {
    const errors: string[] = []
    const requiredFields = ['name', 'sku', 'purchasePrice', 'sellingPrice']
    
    data.forEach((item, index) => {
      requiredFields.forEach(field => {
        if (!item[field] || item[field].toString().trim() === '') {
          errors.push(`Dòng ${index + 1}: Thiếu trường bắt buộc "${field}"`)
        }
      })
      
      // Validate prices
      if (item.purchasePrice && isNaN(Number(item.purchasePrice))) {
        errors.push(`Dòng ${index + 1}: Giá mua không hợp lệ`)
      }
      
      if (item.sellingPrice && isNaN(Number(item.sellingPrice))) {
        errors.push(`Dòng ${index + 1}: Giá bán không hợp lệ`)
      }
      
      // Validate stock quantities
      if (item.currentStock && isNaN(Number(item.currentStock))) {
        errors.push(`Dòng ${index + 1}: Số lượng tồn kho không hợp lệ`)
      }
    })
    
    return errors
  }
}

export const exportImportService = new ExportImportService()
export default exportImportService

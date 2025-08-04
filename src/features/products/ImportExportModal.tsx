import React, { useState, useRef } from 'react'
import { Modal, Button, Input, Select } from '@/components/ui'
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { exportImportService, type ExportOptions, type ImportResult } from '@/services/exportImport'

interface ImportExportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete?: (result: ImportResult) => void
  title: string
  data?: Record<string, unknown>[]
  exportFields?: string[]
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  title,
  data = [],
  exportFields = []
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')
  const [selectedFields, setSelectedFields] = useState<string[]>(exportFields)
  const [filename, setFilename] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      const options: ExportOptions = {
        format: exportFormat,
        fields: selectedFields,
        filename: filename || `${title.toLowerCase().replace(/\s+/g, '_')}_export.${exportFormat}`
      }

      if (exportFormat === 'csv') {
        exportImportService.exportToCSV(data, options)
      } else {
        exportImportService.exportToJSON(data, options)
      }

      onClose()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setImporting(true)
    setImportResult(null)

    try {
      let result: ImportResult
      
      if (importFile.name.endsWith('.csv')) {
        result = await exportImportService.importFromCSV(importFile)
      } else if (importFile.name.endsWith('.json')) {
        result = await exportImportService.importFromJSON(importFile)
      } else {
        throw new Error('Định dạng file không được hỗ trợ')
      }

      setImportResult(result)
      onImportComplete?.(result)
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Lỗi không xác định'],
        duplicates: 0
      })
    } finally {
      setImporting(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImportFile(file)
      setImportResult(null)
    }
  }

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Import/Export ${title}`}
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'export'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Xuất dữ liệu
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'import'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Nhập dữ liệu
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Định dạng
                </label>
                <Select
                  value={exportFormat}
                  onChange={(value: string) => setExportFormat(value as 'csv' | 'json')}
                  options={[
                    { value: 'csv', label: 'CSV' },
                    { value: 'json', label: 'JSON' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên file
                </label>
                <Input
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder={`${title.toLowerCase()}_export.${exportFormat}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn trường dữ liệu
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {exportFields.map(field => (
                  <label key={field} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldToggle(field)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-gray-700">{field}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Sẽ xuất {data.length} bản ghi với {selectedFields.length} trường dữ liệu
              </p>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn file để nhập
              </label>
              <div className="flex items-center space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Chọn file
                </Button>
                {importFile && (
                  <span className="text-sm text-gray-600">
                    {importFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                Hỗ trợ file CSV và JSON. Đảm bảo định dạng dữ liệu đúng trước khi nhập.
              </p>
            </div>

            {/* Import Result */}
            {importResult && (
              <div className={`border rounded-lg p-4 ${
                importResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start space-x-2">
                  {importResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      importResult.success ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {importResult.success ? 'Nhập dữ liệu thành công' : 'Nhập dữ liệu thất bại'}
                    </h4>
                    <div className="mt-2 text-sm">
                      <p>Đã nhập: {importResult.imported} bản ghi</p>
                      {importResult.duplicates > 0 && (
                        <p>Trùng lặp: {importResult.duplicates}</p>
                      )}
                      {importResult.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Lỗi:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {importResult.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                            {importResult.errors.length > 5 && (
                              <li>... và {importResult.errors.length - 5} lỗi khác</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {activeTab === 'export' ? (
            <Button 
              onClick={handleExport}
              disabled={selectedFields.length === 0 || data.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất dữ liệu
            </Button>
          ) : (
            <Button 
              onClick={handleImport}
              disabled={!importFile || importing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? 'Đang nhập...' : 'Nhập dữ liệu'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

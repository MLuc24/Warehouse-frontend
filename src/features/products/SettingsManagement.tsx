import React, { useState } from 'react'
import { Card, Button, Input, Select } from '@/components/ui'
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  AlertTriangle
} from 'lucide-react'

// Simple Label component
const Label: React.FC<{ htmlFor?: string; children: React.ReactNode; className?: string }> = ({ 
  htmlFor, 
  children, 
  className = '' 
}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
)

interface SettingsSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface SettingsData {
  general: {
    companyName: string
    currency: string
    timezone: string
    language: string
    dateFormat: string
  }
  inventory: {
    lowStockThreshold: number
    criticalStockThreshold: number
    autoReorderEnabled: boolean
    defaultReorderQuantity: number
    enableBarcodeScanning: boolean
  }
  notifications: {
    emailNotifications: boolean
    stockAlerts: boolean
    expiryAlerts: boolean
    priceChangeAlerts: boolean
    systemUpdates: boolean
  }
  security: {
    requirePasswordChange: boolean
    sessionTimeout: number
    enableTwoFactor: boolean
    auditLogging: boolean
  }
  display: {
    theme: string
    itemsPerPage: number
    showProductImages: boolean
    compactView: boolean
    enableAnimations: boolean
  }
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'general',
    title: 'Cài đặt chung',
    description: 'Thông tin công ty và cấu hình cơ bản',
    icon: <Settings className="w-5 h-5" />
  },
  {
    id: 'inventory',
    title: 'Quản lý kho',
    description: 'Cài đặt tồn kho và cảnh báo',
    icon: <Database className="w-5 h-5" />
  },
  {
    id: 'notifications',
    title: 'Thông báo',
    description: 'Cấu hình thông báo và cảnh báo',
    icon: <Bell className="w-5 h-5" />
  },
  {
    id: 'security',
    title: 'Bảo mật',
    description: 'Cài đặt bảo mật và quyền truy cập',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'display',
    title: 'Giao diện',
    description: 'Tùy chỉnh giao diện người dùng',
    icon: <Palette className="w-5 h-5" />
  }
]

export const SettingsManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [settings, setSettings] = useState<SettingsData>({
    general: {
      companyName: 'TocoToco Warehouse',
      currency: 'VND',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      dateFormat: 'DD/MM/YYYY'
    },
    inventory: {
      lowStockThreshold: 10,
      criticalStockThreshold: 5,
      autoReorderEnabled: false,
      defaultReorderQuantity: 50,
      enableBarcodeScanning: true
    },
    notifications: {
      emailNotifications: true,
      stockAlerts: true,
      expiryAlerts: true,
      priceChangeAlerts: false,
      systemUpdates: true
    },
    security: {
      requirePasswordChange: false,
      sessionTimeout: 30,
      enableTwoFactor: false,
      auditLogging: true
    },
    display: {
      theme: 'light',
      itemsPerPage: 20,
      showProductImages: true,
      compactView: false,
      enableAnimations: true
    }
  })

  const handleInputChange = (section: keyof SettingsData, field: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setHasChanges(false)
      console.log('Settings saved:', settings)
      
      // Show success notification
      // Would typically use a toast notification here
      alert('Cài đặt đã được lưu thành công!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Có lỗi xảy ra khi lưu cài đặt!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục cài đặt mặc định?')) {
      // Reset to default values
      setSettings({
        general: {
          companyName: 'TocoToco Warehouse',
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
          language: 'vi',
          dateFormat: 'DD/MM/YYYY'
        },
        inventory: {
          lowStockThreshold: 10,
          criticalStockThreshold: 5,
          autoReorderEnabled: false,
          defaultReorderQuantity: 50,
          enableBarcodeScanning: true
        },
        notifications: {
          emailNotifications: true,
          stockAlerts: true,
          expiryAlerts: true,
          priceChangeAlerts: false,
          systemUpdates: true
        },
        security: {
          requirePasswordChange: false,
          sessionTimeout: 30,
          enableTwoFactor: false,
          auditLogging: true
        },
        display: {
          theme: 'light',
          itemsPerPage: 20,
          showProductImages: true,
          compactView: false,
          enableAnimations: true
        }
      })
      setHasChanges(true)
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="companyName">Tên công ty</Label>
          <Input
            id="companyName"
            value={settings.general.companyName}
            onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
            placeholder="Nhập tên công ty"
          />
        </div>

        <div>
          <Label htmlFor="currency">Đơn vị tiền tệ</Label>
          <Select
            value={settings.general.currency}
            onChange={(value: string) => handleInputChange('general', 'currency', value)}
            options={[
              { value: 'VND', label: 'VND - Việt Nam Đồng' },
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' }
            ]}
          />
        </div>

        <div>
          <Label htmlFor="timezone">Múi giờ</Label>
          <Select
            value={settings.general.timezone}
            onChange={(value: string) => handleInputChange('general', 'timezone', value)}
            options={[
              { value: 'Asia/Ho_Chi_Minh', label: 'GMT+7 - Hồ Chí Minh' },
              { value: 'Asia/Bangkok', label: 'GMT+7 - Bangkok' },
              { value: 'UTC', label: 'GMT+0 - UTC' }
            ]}
          />
        </div>

        <div>
          <Label htmlFor="language">Ngôn ngữ</Label>
          <Select
            value={settings.general.language}
            onChange={(value: string) => handleInputChange('general', 'language', value)}
            options={[
              { value: 'vi', label: 'Tiếng Việt' },
              { value: 'en', label: 'English' }
            ]}
          />
        </div>
      </div>
    </div>
  )

  const renderInventorySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="lowStockThreshold">Ngưỡng tồn kho thấp</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            value={settings.inventory.lowStockThreshold}
            onChange={(e) => handleInputChange('inventory', 'lowStockThreshold', parseInt(e.target.value))}
            min="1"
          />
          <p className="text-sm text-gray-500 mt-1">Cảnh báo khi số lượng dưới ngưỡng này</p>
        </div>

        <div>
          <Label htmlFor="criticalStockThreshold">Ngưỡng tồn kho nguy hiểm</Label>
          <Input
            id="criticalStockThreshold"
            type="number"
            value={settings.inventory.criticalStockThreshold}
            onChange={(e) => handleInputChange('inventory', 'criticalStockThreshold', parseInt(e.target.value))}
            min="1"
          />
          <p className="text-sm text-gray-500 mt-1">Cảnh báo khẩn cấp khi dưới ngưỡng này</p>
        </div>

        <div>
          <Label htmlFor="defaultReorderQuantity">Số lượng nhập mặc định</Label>
          <Input
            id="defaultReorderQuantity"
            type="number"
            value={settings.inventory.defaultReorderQuantity}
            onChange={(e) => handleInputChange('inventory', 'defaultReorderQuantity', parseInt(e.target.value))}
            min="1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Tự động đặt hàng</Label>
            <p className="text-sm text-gray-500">Tự động tạo đơn đặt hàng khi hết tồn kho</p>
          </div>
          <input
            type="checkbox"
            checked={settings.inventory.autoReorderEnabled}
            onChange={(e) => handleInputChange('inventory', 'autoReorderEnabled', e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Quét mã barcode</Label>
            <p className="text-sm text-gray-500">Kích hoạt chức năng quét mã barcode</p>
          </div>
          <input
            type="checkbox"
            checked={settings.inventory.enableBarcodeScanning}
            onChange={(e) => handleInputChange('inventory', 'enableBarcodeScanning', e.target.checked)}
            className="w-4 h-4"
          />
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {[
        { key: 'emailNotifications', label: 'Thông báo email', desc: 'Nhận thông báo qua email' },
        { key: 'stockAlerts', label: 'Cảnh báo tồn kho', desc: 'Thông báo khi sản phẩm sắp hết' },
        { key: 'expiryAlerts', label: 'Cảnh báo hạn sử dụng', desc: 'Thông báo sản phẩm sắp hết hạn' },
        { key: 'priceChangeAlerts', label: 'Cảnh báo thay đổi giá', desc: 'Thông báo khi giá sản phẩm thay đổi' },
        { key: 'systemUpdates', label: 'Cập nhật hệ thống', desc: 'Thông báo về các bản cập nhật mới' }
      ].map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label>{label}</Label>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications[key as keyof typeof settings.notifications]}
            onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
            className="w-4 h-4"
          />
        </div>
      ))}
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="120"
          />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'requirePasswordChange', label: 'Yêu cầu đổi mật khẩu', desc: 'Bắt buộc đổi mật khẩu định kỳ' },
          { key: 'enableTwoFactor', label: 'Xác thực 2 yếu tố', desc: 'Bảo mật tài khoản với 2FA' },
          { key: 'auditLogging', label: 'Ghi log hoạt động', desc: 'Lưu trữ log các hoạt động của người dùng' }
        ].map(({ key, label, desc }) => {
          const securityKey = key as keyof typeof settings.security
          const isBoolean = typeof settings.security[securityKey] === 'boolean'
          
          return (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>{label}</Label>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={isBoolean ? (settings.security[securityKey] as boolean) : false}
                onChange={(e) => handleInputChange('security', key, e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="theme">Giao diện</Label>
          <Select
            value={settings.display.theme}
            onChange={(value: string) => handleInputChange('display', 'theme', value)}
            options={[
              { value: 'light', label: 'Sáng' },
              { value: 'dark', label: 'Tối' },
              { value: 'auto', label: 'Tự động' }
            ]}
          />
        </div>

        <div>
          <Label htmlFor="itemsPerPage">Số mục mỗi trang</Label>
          <Select
            value={settings.display.itemsPerPage.toString()}
            onChange={(value: string) => handleInputChange('display', 'itemsPerPage', parseInt(value))}
            options={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '50', label: '50' },
              { value: '100', label: '100' }
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'showProductImages', label: 'Hiển thị hình ảnh sản phẩm', desc: 'Hiển thị thumbnail sản phẩm trong danh sách' },
          { key: 'compactView', label: 'Chế độ gọn', desc: 'Hiển thị nhiều thông tin hơn trong ít không gian' },
          { key: 'enableAnimations', label: 'Hiệu ứng động', desc: 'Kích hoạt hiệu ứng chuyển tiếp' }
        ].map(({ key, label, desc }) => {
          const displayKey = key as keyof typeof settings.display
          const isBoolean = typeof settings.display[displayKey] === 'boolean'
          
          return (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>{label}</Label>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={isBoolean ? (settings.display[displayKey] as boolean) : false}
                onChange={(e) => handleInputChange('display', key, e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings()
      case 'inventory':
        return renderInventorySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'display':
        return renderDisplaySettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Cài đặt hệ thống
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý cấu hình và tùy chỉnh hệ thống warehouse
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Khôi phục mặc định
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {/* Change Status Alert */}
      {hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span className="text-orange-800">Bạn có thay đổi chưa lưu</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Sections Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Danh mục cài đặt</h3>
            <nav className="space-y-2">
              {SETTINGS_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Right Content - Settings Form */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="mb-6">
              {SETTINGS_SECTIONS.find(s => s.id === activeSection) && (
                <div className="flex items-center gap-3 mb-4">
                  {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.icon}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.title}
                    </h3>
                    <p className="text-gray-600">
                      {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section Content */}
            {renderSectionContent()}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SettingsManagement

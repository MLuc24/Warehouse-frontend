import React from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  variant = 'default'
}) => {
  if (!open) return null

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={variant === 'destructive' ? 'danger' : 'primary'}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  )
}

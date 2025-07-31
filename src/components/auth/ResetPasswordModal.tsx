import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)'
    ),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmNewPassword']
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  email: string
  verificationCode: string
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  email,
  verificationCode
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { authService } = await import('../../services/auth')
      
      console.log('Sending reset password request:', {
        email,
        verificationCode,
        newPassword: '****',
        confirmNewPassword: '****'
      })
      
      const response = await authService.resetPassword(
        email,
        data.newPassword,
        data.confirmNewPassword
      )
      
      console.log('Reset password response:', response)
      
      if (response.success) {
        setSuccess('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...')
        reset()
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setError(response.message || 'Đặt lại mật khẩu thất bại')
      }
    } catch (err: unknown) {
      console.error('Reset password error:', err)
      const error = err as { 
        response?: { 
          data?: { 
            message?: string;
            errors?: Record<string, string[]>;
          };
          status?: number;
        };
        message?: string;
      }
      
      let errorMessage = 'Có lỗi xảy ra khi đặt lại mật khẩu'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = Object.values(error.response.data.errors).flat()
        errorMessage = validationErrors.join('. ')
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError(null)
    setSuccess(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Đặt lại mật khẩu"
      headerColor="purple"
      icon="🔒"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* Help text */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 text-purple-700 px-4 py-3 rounded-r-md text-sm">
          <div className="flex items-center">
            <span className="text-purple-500 mr-2">📧</span>
            <div>
              <p className="font-semibold">Email: {email}</p>
              <p>Nhập mật khẩu mới để hoàn tất khôi phục</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-md text-sm">
              <div className="flex items-center">
                <span className="text-red-500">❌</span>
                <span className="ml-2">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r-md text-sm">
              <div className="flex items-center">
                <span className="text-green-500">✅</span>
                <span className="ml-2">{success}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Mật khẩu mới"
              type="password"
              {...register('newPassword')}
              error={errors.newPassword?.message}
              placeholder="Nhập mật khẩu mới"
              disabled={isLoading || !!success}
              className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              {...register('confirmNewPassword')}
              error={errors.confirmNewPassword?.message}
              placeholder="Nhập lại mật khẩu mới"
              disabled={isLoading || !!success}
              className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <div className="flex items-start mb-2">
              <span className="text-gray-500 mr-2">🔐</span>
              <span className="font-semibold text-gray-700">Yêu cầu mật khẩu:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 ml-6">
              <li>Ít nhất 6 ký tự</li>
              <li>Có ít nhất 1 chữ hoa (A-Z)</li>
              <li>Có ít nhất 1 chữ thường (a-z)</li>
              <li>Có ít nhất 1 chữ số (0-9)</li>
              <li>Có ít nhất 1 ký tự đặc biệt (@$!%*?&)</li>
            </ul>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
            disabled={isLoading || !!success}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đặt lại...
              </div>
            ) : success ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">✅</span>
                Thành công!
              </div>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </Button>

          {/* Security notice */}
          <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">🛡️</span>
              <span>Mật khẩu mới sẽ được mã hóa và bảo mật theo tiêu chuẩn cao nhất.</span>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ResetPasswordModal

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { authService } from '../../services/auth'

const sendVerificationSchema = z.object({
  email: z.string().email('Email không hợp lệ')
})

type SendVerificationFormData = z.infer<typeof sendVerificationSchema>

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
  onSwitchToVerification: (email: string) => void
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSwitchToVerification
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SendVerificationFormData>({
    resolver: zodResolver(sendVerificationSchema)
  })

  const onSubmit = async (data: SendVerificationFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const response = await authService.sendRegistrationVerification(data.email)
      
      if (response.success) {
        setSuccess('Mã xác thực đã được gửi đến email của bạn!')
        reset()
        setTimeout(() => {
          onSwitchToVerification(data.email)
        }, 1500)
      } else {
        // Enhanced error messages based on backend validation
        let errorMessage = response.message || 'Không thể gửi mã xác thực'
        if (!response.success && !response.message) {
          errorMessage = 'Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.'
        }
        setError(errorMessage)
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }; status?: number } }
      let errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi mã xác thực'
      
      // Handle specific error cases
      if (error?.response?.status === 400) {
        errorMessage = 'Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.'
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
      title="Tạo tài khoản mới"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* Welcome text */}
        <p className="text-gray-600 text-center">
          Tham gia hệ thống quản lý kho hàng
        </p>

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

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-start">
              <span className="text-blue-500 mr-2">💡</span>
              <span>Nhập email để bắt đầu. Chúng tôi sẽ gửi mã xác thực để hoàn tất đăng ký.</span>
            </div>
          </div>

          <Input
            label="Địa chỉ Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="Nhập email của bạn"
            disabled={isLoading || !!success}
            className="focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
            disabled={isLoading || !!success}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang gửi mã...
              </div>
            ) : success ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">✅</span>
                Đã gửi thành công!
              </div>
            ) : (
              'Gửi mã xác thực'
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
                disabled={isLoading}
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default RegisterModal

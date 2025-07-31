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
        setError(response.message || 'Không thể gửi mã xác thực')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi mã xác thực')
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
      title="Đăng ký tài khoản"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
            {success}
          </div>
        )}

        <div className="text-sm text-gray-600 mb-4">
          Nhập email để bắt đầu quá trình đăng ký. Chúng tôi sẽ gửi mã xác thực đến email của bạn.
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="Nhập địa chỉ email"
            disabled={isLoading || !!success}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !!success}
        >
          {isLoading ? 'Đang gửi mã xác thực...' : success ? 'Đã gửi!' : 'Gửi mã xác thực'}
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
              disabled={isLoading}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default RegisterModal

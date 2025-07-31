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
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
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
      
      const response = await authService.resetPassword(
        email,
        verificationCode,
        data.newPassword,
        data.confirmNewPassword
      )
      
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
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu')
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
      className="max-w-md"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
          <p className="font-medium">Email: {email}</p>
          <p>Nhập mật khẩu mới để hoàn tất khôi phục</p>
        </div>

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

          <div>
            <Input
              label="Mật khẩu mới"
              type="password"
              {...register('newPassword')}
              error={errors.newPassword?.message}
              placeholder="Nhập mật khẩu mới"
              disabled={isLoading || !!success}
            />
          </div>

          <div>
            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              {...register('confirmNewPassword')}
              error={errors.confirmNewPassword?.message}
              placeholder="Nhập lại mật khẩu mới"
              disabled={isLoading || !!success}
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-md text-sm">
            <p className="font-medium mb-2">Yêu cầu mật khẩu:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
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
            className="w-full"
            disabled={isLoading || !!success}
          >
            {isLoading ? 'Đang đặt lại mật khẩu...' : success ? 'Thành công!' : 'Đặt lại mật khẩu'}
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default ResetPasswordModal

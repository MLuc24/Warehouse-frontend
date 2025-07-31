import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const completeRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  username: z.string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(50, 'Username không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username chỉ được chứa chữ cái, số và dấu gạch dưới'),
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
})

type CompleteRegistrationFormData = z.infer<typeof completeRegistrationSchema>

interface CompleteRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  contact: string
  type: 'Email' | 'Phone'
}

export const CompleteRegistrationModal: React.FC<CompleteRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  contact,
  type
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CompleteRegistrationFormData>({
    resolver: zodResolver(completeRegistrationSchema)
  })

  const onSubmit = async (data: CompleteRegistrationFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { authService } = await import('../../services/auth')
      
      const registrationData = {
        contact,
        type,
        fullName: data.fullName,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword
      }
      
      const response = await authService.completeRegistration(registrationData)
      
      if (response.success) {
        setSuccess('Đăng ký thành công! Đang chuyển hướng...')
        reset()
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setError(response.message || 'Đăng ký thất bại')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error?.response?.data?.message || 'Đăng ký thất bại')
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
      title="Hoàn tất đăng ký"
      headerColor="green"
      icon="🎉"
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Success indicator */}
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-gray-600 text-sm">
            Email đã được xác thực thành công!
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r-md text-sm">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            <div>
              <p className="font-semibold">Email: {contact}</p>
              <p>Vui lòng điền thông tin để hoàn tất đăng ký</p>
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
                <span className="text-green-500">🎉</span>
                <span className="ml-2">{success}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Họ và tên"
              type="text"
              {...register('fullName')}
              error={errors.fullName?.message}
              placeholder="Nhập họ và tên đầy đủ"
              disabled={isLoading || !!success}
              className="focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <Input
              label="Tên đăng nhập"
              type="text"
              {...register('username')}
              error={errors.username?.message}
              placeholder="Chỉ chữ cái, số và dấu gạch dưới"
              disabled={isLoading || !!success}
              className="focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Mật khẩu"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Tối thiểu 6 ký tự"
                disabled={isLoading || !!success}
                className="focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="Nhập lại mật khẩu"
                disabled={isLoading || !!success}
                className="focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

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
                Đang hoàn tất...
              </div>
            ) : success ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">🎉</span>
                Đăng ký thành công!
              </div>
            ) : (
              'Hoàn tất đăng ký'
            )}
          </Button>

          {/* Security notice */}
          <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">🔒</span>
              <span>Thông tin của bạn được bảo mật và chỉ dùng cho việc quản lý tài khoản.</span>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default CompleteRegistrationModal

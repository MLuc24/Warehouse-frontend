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
      className="max-w-lg"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
          <p className="font-medium">Email đã được xác thực: {contact}</p>
          <p>Vui lòng điền thông tin để hoàn tất đăng ký</p>
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
              label="Họ và tên"
              type="text"
              {...register('fullName')}
              error={errors.fullName?.message}
              placeholder="Nhập họ và tên đầy đủ"
              disabled={isLoading || !!success}
            />
          </div>

          <div>
            <Input
              label="Tên đăng nhập"
              type="text"
              {...register('username')}
              error={errors.username?.message}
              placeholder="Nhập tên đăng nhập (chỉ chữ cái, số và _)"
              disabled={isLoading || !!success}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Mật khẩu"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                disabled={isLoading || !!success}
              />
            </div>

            <div>
              <Input
                label="Xác nhận mật khẩu"
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="Nhập lại mật khẩu"
                disabled={isLoading || !!success}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading || !!success}
          >
            {isLoading ? 'Đang hoàn tất đăng ký...' : success ? 'Đăng ký thành công!' : 'Hoàn tất đăng ký'}
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default CompleteRegistrationModal

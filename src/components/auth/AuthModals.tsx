import React, { useState } from 'react'
import { LoginModal } from './LoginModal'
import { RegisterModal } from './RegisterModal' 
import { ForgotPasswordModal } from './ForgotPasswordModal'
import { VerificationModal } from './VerificationModal'
import { CompleteRegistrationModal } from './CompleteRegistrationModal'
import { ResetPasswordModal } from './ResetPasswordModal'
import { authService } from '../../services/auth'

type AuthModalType = 'login' | 'register' | 'forgot-password' | 'verification' | 'complete-registration' | 'reset-password' | null

interface AuthModalProps {
  contact?: string
  type?: 'Email' | 'Phone'
  purpose?: 'Registration' | 'ForgotPassword'
  verificationCode?: string
}

interface AuthModalsProps {
  isOpen: boolean
  initialModal?: AuthModalType
  onClose: () => void
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  initialModal = 'login',
  onClose
}) => {
  const [currentModal, setCurrentModal] = useState<AuthModalType>(initialModal)
  const [modalProps, setModalProps] = useState<AuthModalProps>({})

  const handleClose = () => {
    setCurrentModal(null)
    setModalProps({})
    onClose()
  }

  const handleSwitchToLogin = () => {
    setCurrentModal('login')
    setModalProps({})
  }

  const handleSwitchToRegister = () => {
    setCurrentModal('register')
    setModalProps({})
  }

  const handleSwitchToForgotPassword = () => {
    setCurrentModal('forgot-password')
    setModalProps({})
  }

  // From Register/ForgotPassword to Verification
  const handleSwitchToVerification = (contact: string, purpose: 'Registration' | 'ForgotPassword' = 'Registration') => {
    setCurrentModal('verification')
    setModalProps({
      contact,
      type: 'Email',
      purpose
    })
  }

  // From Registration Verification to Complete Registration
  const handleRegistrationVerificationSuccess = () => {
    setCurrentModal('complete-registration')
    // Keep contact and type from modalProps
  }

  // From Forgot Password Verification to Reset Password  
  const handleForgotPasswordVerificationSuccess = (verificationCode: string) => {
    setCurrentModal('reset-password')
    setModalProps({
      ...modalProps,
      verificationCode
    })
  }

  // From Complete Registration - success and close
  const handleCompleteRegistrationSuccess = () => {
    handleClose()
  }

  // From Reset Password - success and go to login
  const handleResetPasswordSuccess = () => {
    handleSwitchToLogin()
  }

  // Handle verification success based on purpose
  const handleVerificationSuccess = (verificationCode: string) => {
    if (modalProps.purpose === 'Registration') {
      handleRegistrationVerificationSuccess()
    } else if (modalProps.purpose === 'ForgotPassword') {
      handleForgotPasswordVerificationSuccess(verificationCode)
    }
  }

  // Resend code function for verification modal
  const handleResendCode = async (): Promise<{ success: boolean; message: string }> => {
    if (!modalProps.contact || !modalProps.type || !modalProps.purpose) {
      return { success: false, message: 'Thông tin không hợp lệ' }
    }

    try {
      if (modalProps.purpose === 'Registration') {
        return await authService.sendRegistrationVerification(modalProps.contact)
      } else {
        return await authService.sendForgotPasswordVerification(modalProps.contact)
      }
    } catch {
      return { success: false, message: 'Có lỗi xảy ra khi gửi lại mã' }
    }
  }

  return (
    <>
      <LoginModal
        isOpen={isOpen && currentModal === 'login'}
        onClose={handleClose}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToForgotPassword={handleSwitchToForgotPassword}
      />
      
      <RegisterModal
        isOpen={isOpen && currentModal === 'register'}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
        onSwitchToVerification={(email) => handleSwitchToVerification(email, 'Registration')}
      />
      
      <ForgotPasswordModal
        isOpen={isOpen && currentModal === 'forgot-password'}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
        onSwitchToVerification={(email) => handleSwitchToVerification(email, 'ForgotPassword')}
      />

      <VerificationModal
        isOpen={isOpen && currentModal === 'verification'}
        onClose={handleClose}
        contact={modalProps.contact || ''}
        type={modalProps.type || 'Email'}
        purpose={modalProps.purpose || 'Registration'}
        onVerificationSuccess={handleVerificationSuccess}
        onResendCode={handleResendCode}
      />

      <CompleteRegistrationModal
        isOpen={isOpen && currentModal === 'complete-registration'}
        onClose={handleClose}
        onSuccess={handleCompleteRegistrationSuccess}
        contact={modalProps.contact || ''}
        type={modalProps.type || 'Email'}
      />

      <ResetPasswordModal
        isOpen={isOpen && currentModal === 'reset-password'}
        onClose={handleClose}
        onSuccess={handleResetPasswordSuccess}
        email={modalProps.contact || ''}
        verificationCode={modalProps.verificationCode || ''}
      />
    </>
  )
}

export default AuthModals

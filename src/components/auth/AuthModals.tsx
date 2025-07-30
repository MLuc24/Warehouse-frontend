import React, { useState } from 'react'
import { LoginModal } from './LoginModal'
import { RegisterModal } from './RegisterModal' 
import { ForgotPasswordModal } from './ForgotPasswordModal'

type AuthModalType = 'login' | 'register' | 'forgot-password' | null

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

  const handleClose = () => {
    setCurrentModal(null)
    onClose()
  }

  const handleSwitchToLogin = () => {
    setCurrentModal('login')
  }

  const handleSwitchToRegister = () => {
    setCurrentModal('register')
  }

  const handleSwitchToForgotPassword = () => {
    setCurrentModal('forgot-password')
  }

  const handleRegisterSuccess = () => {
    // Keep modal open and switch to login after success message
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
        onSuccess={handleRegisterSuccess}
      />
      
      <ForgotPasswordModal
        isOpen={isOpen && currentModal === 'forgot-password'}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}

export default AuthModals

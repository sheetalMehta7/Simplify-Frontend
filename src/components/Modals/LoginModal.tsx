import { FC } from 'react'
import * as Yup from 'yup'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router-dom'

interface LoginModalProps {
  onClose: () => void
  onSwitch: () => void
}

const LoginModal: FC<LoginModalProps> = ({ onClose, onSwitch }) => {
  const navigate = useNavigate()
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const handleSubmit = (values: { email: string; password: string }) => {
    console.log(values)
    navigate('/dashboard')
  }

  return (
    <AuthModal
      title="Simplify"
      description="Log in to manage your tasks efficiently"
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSwitch={onSwitch}
      switchText="Don't have an account?"
      switchLinkText="Sign up"
      buttonText="Log In"
    />
  )
}

export default LoginModal

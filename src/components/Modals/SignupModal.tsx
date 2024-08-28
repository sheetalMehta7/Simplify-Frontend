import { FC } from 'react'
import * as Yup from 'yup'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router-dom'

interface SignUpModalProps {
  onClose: () => void
  onSwitch: () => void
}

const SignUpModal: FC<SignUpModalProps> = ({ onClose, onSwitch }) => {
  const navigate = useNavigate()
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

  const handleSubmit = (values: { email: string; password: string }) => {
    console.log(values)
    navigate('/dashboard')
  }

  return (
    <AuthModal
      title="Simplify"
      description="Sign up to manage your tasks efficiently"
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSwitch={onSwitch}
      switchText="Already have an account?"
      switchLinkText="Log in"
      buttonText="Sign Up"
    />
  )
}

export default SignUpModal

import { FC } from 'react'
import * as Yup from 'yup'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../api/authApi'
import { useError } from '../../context/ErrorContext'

interface SignUpModalProps {
  onClose: () => void
  onSwitch: () => void
}

const SignUpModal: FC<SignUpModalProps> = ({ onClose, onSwitch }) => {
  const navigate = useNavigate()
  const { setError } = useError()

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

  const handleSubmit = async (values: {
    email: string
    password: string
    name?: string
  }) => {
    try {
      // Ensure that the name is defined before proceeding
      if (values.name) {
        const { token } = await signup(
          values.email,
          values.password,
          values.name,
        )

        // Store the JWT token
        localStorage.setItem('authToken', token)

        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        setError('Name is required')
      }
    } catch (error) {
      setError('Sign-up failed. Please try again.')
    }
  }

  return (
    <AuthModal
      title="Simplify"
      description="Sign up to manage your tasks efficiently"
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSwitch={onSwitch}
      switchText="Already have an account?"
      switchLinkText="Log in"
      buttonText="Sign Up"
      showNameField={true}
    />
  )
}

export default SignUpModal

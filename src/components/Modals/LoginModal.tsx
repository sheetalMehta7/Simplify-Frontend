import { FC } from 'react'
import * as Yup from 'yup'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router-dom'
import { useError } from '../../context/ErrorContext'
import { Button } from 'flowbite-react'
import { login } from '../../api/authApi'

interface LoginModalProps {
  onClose: () => void
  onSwitch: () => void
}

const LoginModal: FC<LoginModalProps> = ({ onClose, onSwitch }) => {
  const navigate = useNavigate()
  const { setError } = useError()

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  // The handleSubmit function to pass to AuthModal
  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const { token } = await login(values.email, values.password)

      // Store the JWT token
      localStorage.setItem('authToken', token)

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (error: any) {
      // Check for specific error codes or messages from your API
      if (error.response) {
        const status = error.response.status
        if (status === 401) {
          setError('Invalid credentials. Please try again.')
        } else if (status === 404) {
          setError('User not found. Please check your email or sign up.')
        } else {
          setError('Login failed. Please try again later.')
        }
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }

  const handleGoogleLogin = async () => {
    try {
      navigate('/dashboard')
    } catch (error: any) {
      setError('Google login failed. Please try again.')
    }
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
      showNameField={false}
    >
      <Button
        type="button"
        onClick={handleGoogleLogin}
        className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 text-sm"
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48"></svg>
        Log In with Google
      </Button>
    </AuthModal>
  )
}

export default LoginModal

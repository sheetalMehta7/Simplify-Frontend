import { FC } from 'react'
import * as Yup from 'yup'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { login } from '../../api/authApi'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/features/auth/authSlice'
import { setError, clearError } from '../../redux/features/error/errorSlice'

interface LoginModalProps {
  onClose: () => void
  onSwitch: () => void
}

const LoginModal: FC<LoginModalProps> = ({ onClose, onSwitch }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const { token, user } = await login(values.email, values.password)

      // Dispatch loginSuccess action to store user and token in Redux and LocalStorage
      dispatch(loginSuccess({ user, token }))

      // Redirect to dashboard
      navigate('/dashboard/my-tasks')

      // Clear any previous errors
      dispatch(clearError())
    } catch (error: any) {
      console.log('Login error:', error)

      if (error.response) {
        const status = error.response.status
        if (status === 400) {
          dispatch(setError('Invalid credentials. Please try again.'))
        } else if (status === 404) {
          dispatch(
            setError('User not found. Please check your email or sign up.'),
          )
        } else {
          dispatch(setError('Login failed. Please try again later.'))
        }
      } else {
        dispatch(setError('Login failed. Please try again.'))
      }
    }
  }

  // const handleGoogleLogin = async () => {
  //   try {
  //     // Simulate Google login and navigate to dashboard
  //     navigate('/dashboard')
  //     dispatch(clearError())
  //   } catch (error: any) {
  //     dispatch(setError('Google login failed. Please try again.'))
  //   }
  // }

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
        // onClick={handleGoogleLogin}
        className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 text-sm"
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48"></svg>
        Log In with Google
      </Button>
    </AuthModal>
  )
}

export default LoginModal

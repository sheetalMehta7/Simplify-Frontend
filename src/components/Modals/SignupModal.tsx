import { FC } from 'react'
import * as Yup from 'yup'
import AuthModal from './AuthModal'
import { useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { signup } from '../../api/authApi'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../redux/features/auth/authSlice'
import { setError, clearError } from '../../redux/features/error/errorSlice'

interface SignUpModalProps {
  onClose: () => void
  onSwitch: () => void
}

const SignUpModal: FC<SignUpModalProps> = ({ onClose, onSwitch }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
      if (values.name) {
        const { token, user } = await signup(
          values.email,
          values.password,
          values.name,
        )

        // Dispatch loginSuccess action to store user and token in Redux and LocalStorage
        dispatch(loginSuccess({ user, token }))

        // Clear any previous errors
        dispatch(clearError())

        // Redirect to dashboard
        navigate('/dashboard/my-tasks')
      } else {
        dispatch(setError('Name is required'))
      }
    } catch (error: any) {
      dispatch(setError('Sign-up failed. Please try again.'))
    }
  }

  // const handleGoogleSignup = () => {
  //   try {
  //     // Simulate Google signup and redirect to dashboard
  //     navigate('/dashboard')
  //     dispatch(clearError())
  //   } catch (error: any) {
  //     dispatch(setError('Login failed. Please try again.'))
  //   }
  // }

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
    >
      <Button
        type="button"
        // onClick={handleGoogleSignup}
        className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 text-sm"
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48"></svg>
        Sign Up with Google
      </Button>
    </AuthModal>
  )
}

export default SignUpModal

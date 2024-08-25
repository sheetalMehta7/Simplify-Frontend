import { FC, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Label, TextInput, Button } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

interface LoginModalProps {
  onClose: () => void
}

const LoginModal: FC<LoginModalProps> = ({ onClose }) => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values)
      navigate('/dashboard')
    },
  })

  const handleSubmit = () => {
    formik.handleSubmit()
    setTouched({
      email: true,
      password: true,
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-modal">
      <div className="relative w-full max-w-md p-8 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-300 ring-2 ring-blue-500">
        {/* Logo and Description */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Simplify
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
            Log in to manage your tasks efficiently
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <div className="mb-2 block">
              <Label
                htmlFor="email"
                className="text-slate-900 dark:text-white"
                color={
                  formik.errors.email && touched.email ? 'failure' : undefined
                }
                value="Email"
              />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              {...formik.getFieldProps('email')}
              color={formik.errors.email && touched.email ? 'failure' : 'gray'}
            />
            {formik.errors.email && touched.email ? (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <Label
                htmlFor="password"
                className="text-slate-900 dark:text-white"
                color={
                  formik.errors.password && touched.password
                    ? 'failure'
                    : undefined
                }
                value="Password"
              />
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              {...formik.getFieldProps('password')}
              color={
                formik.errors.password && touched.password ? 'failure' : 'gray'
              }
            />
            {formik.errors.password && touched.password ? (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            ) : null}
          </div>
          <Button
            type="button"
            color="green"
            className="w-full py-2 dark:text-white bg-green-400 hover:bg-green-700"
            onClick={handleSubmit}
          >
            Log In
          </Button>
        </form>

        {/* OR Divider */}
        <div className="my-4 flex items-center">
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
          <span className="px-2 text-gray-500 dark:text-gray-400 text-sm">
            OR
          </span>
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Google Login */}
        <Button className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 text-sm">
          <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48">
            {/* SVG paths */}
          </svg>
          Log in with Google
        </Button>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Don't have an account?{' '}
            <a
              className="text-blue-600 hover:underline dark:text-blue-500"
              onClick={onClose}
            >
              Sign up
            </a>
          </p>
          <p className="mt-2">
            <a
              className="text-gray-500 hover:underline dark:text-gray-400"
              href="/"
            >
              Privacy Policy
            </a>{' '}
            &middot;{' '}
            <a
              className="text-gray-500 hover:underline dark:text-gray-400"
              href="/"
            >
              Terms of Service
            </a>
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-3xl top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full"
        >
          &times;
        </button>
      </div>
    </div>
  )
}

export default LoginModal

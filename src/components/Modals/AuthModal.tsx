import { FC, ReactNode, useState } from 'react'
import { Label, TextInput, Button } from 'flowbite-react'
import { FaTimes } from 'react-icons/fa'
import { useFormik } from 'formik'

interface AuthModalProps {
  title: string
  description: string
  initialValues: { email: string; password: string; name?: string }
  validationSchema: any
  onSubmit: (values: {
    email: string
    password: string
    name?: string
  }) => Promise<void>
  onClose: () => void
  onSwitch: () => void
  switchText: string
  switchLinkText: string
  buttonText: string
  showNameField?: boolean
  children?: ReactNode
}

const AuthModal: FC<AuthModalProps> = ({
  title,
  description,
  initialValues,
  validationSchema,
  onSubmit,
  onClose,
  onSwitch,
  switchText,
  switchLinkText,
  buttonText,
  showNameField = false,
  children,
}) => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
        onClose()
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleSubmit = () => {
    formik.handleSubmit()
    setTouched({
      email: true,
      password: true,
      ...(showNameField && { name: true }),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-modal">
      <div className="relative w-full max-w-sm p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-300 ring-2 ring-blue-500 max-h-screen overflow-hidden">
        <div className="mb-4 text-center">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-xs">
            {description}
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} onKeyDown={handleKeyDown}>
          {showNameField && (
            <div className="mb-3">
              <div className="mb-1 block">
                <Label
                  htmlFor="name"
                  className="text-slate-900 dark:text-white"
                  color={
                    formik.errors.name && touched.name ? 'failure' : undefined
                  }
                  value="Name"
                />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="Enter your name"
                required
                {...formik.getFieldProps('name')}
                color={formik.errors.name && touched.name ? 'failure' : 'gray'}
                className="text-xs"
              />
              {formik.errors.name && touched.name ? (
                <p className="text-xs text-red-500">{formik.errors.name}</p>
              ) : null}
            </div>
          )}
          <div className="mb-3">
            <div className="mb-1 block">
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
              className="text-xs"
            />
            {formik.errors.email && touched.email ? (
              <p className="text-xs text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <div className="mb-1 block">
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
              className="text-xs"
            />
            {formik.errors.password && touched.password ? (
              <p className="text-xs text-red-500">{formik.errors.password}</p>
            ) : null}
          </div>
          <Button
            type="button"
            color="green"
            className="w-full py-1.5 dark:text-white bg-green-400 hover:bg-green-700 text-xs"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : buttonText}
          </Button>
        </form>
        <div className="my-3 flex items-center">
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
          <span className="px-2 text-gray-500 dark:text-gray-400 text-xs">
            OR
          </span>
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
        </div>
        {children}
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            {switchText}{' '}
            <a
              className="text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
              onClick={onSwitch}
            >
              {switchLinkText}
            </a>
          </p>
          <p className="mt-1">
            <a
              className="text-gray-500 hover:underline dark:text-gray-400 cursor-pointer"
              href="/"
            >
              Privacy Policy
            </a>{' '}
            &middot;{' '}
            <a
              className="text-gray-500 hover:underline dark:text-gray-400 cursor-pointer"
              href="/"
            >
              Terms of Service
            </a>
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute text-xl top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 w-6 h-6 flex items-center justify-center rounded-full"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  )
}

export default AuthModal

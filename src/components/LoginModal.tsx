import { FC, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Label, TextInput, Button } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

interface LoginModalProps {
  onClose: () => void
}

const SignUpModal: FC<SignUpModalProps> = ({ onClose }) => {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="animate-modal fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="relative mx-auto w-full max-w-md rounded-lg border border-blue-300 bg-white p-8 shadow-lg ring-2 ring-blue-500 dark:bg-gray-800">
        {/* Logo and Description */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Simplify
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Sign up to manage your tasks efficiently
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              type="email"
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
            <label
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              type="password"
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
          <button
            className="w-full rounded-lg bg-green-600 py-2 text-sm text-white transition hover:bg-green-700"
            type="submit"
          >
            Log In
          </Button>
        </form>

        {/* OR Divider */}
        <div className="my-4 flex items-center">
          <div className="h-px grow bg-gray-300 dark:bg-gray-700"></div>
          <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="h-px grow bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Google Sign Up */}
        <button className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-sm text-white transition hover:bg-blue-700">
          <svg className="mr-2 size-5" viewBox="0 0 48 48">
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
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          &times;
        </button>
      </div>
    </div>
  )
}

export default LoginModal

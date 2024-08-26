import { FC } from 'react'

interface SignUpModalProps {
  onClose: () => void
}

const SignUpModal: FC<SignUpModalProps> = ({ onClose }) => {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // Close the modal only if the click is on the overlay (not inside the modal content)
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 animate-modal"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md p-8 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-300 ring-2 ring-blue-500">
        {/* Logo and Description */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Simplify
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
            Sign up to manage your tasks efficiently
          </p>
        </div>

        {/* Traditional Sign Up Form */}
        <form>
          <div className="mb-4">
            <label
              className="mb-2 block font-medium text-gray-700 dark:text-gray-300 text-sm"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block font-medium text-gray-700 dark:text-gray-300 text-sm"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              type="password"
              id="password"
              placeholder="Create a password"
              required
            />
          </div>
          <button
            className="w-full rounded-lg bg-green-600 py-2 text-white transition hover:bg-green-700 text-sm"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        {/* OR Divider */}
        <div className="my-4 flex items-center">
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
          <span className="px-2 text-gray-500 dark:text-gray-400 text-sm">
            OR
          </span>
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Google Sign Up */}
        <button className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 text-sm">
          <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48">
            {/* SVG paths */}
          </svg>
          Sign up with Google
        </button>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Already have an account?{' '}
            <a
              className="text-blue-600 hover:underline dark:text-blue-500"
              onClick={onClose}
            >
              Log in
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
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full"
        >
          &times;
        </button>
      </div>
    </div>
  )
}

export default SignUpModal

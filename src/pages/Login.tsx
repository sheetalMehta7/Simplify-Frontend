import { Link } from 'react-router-dom'

export function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
        {/* Logo and Description */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Simplify
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Log in to manage your tasks efficiently
          </p>
        </div>

        {/* Google Login */}
        <button className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700">
          <svg className="mr-2 h-6 w-6" viewBox="0 0 48 48">
            {/* SVG paths */}
          </svg>
          Log in with Google
        </button>

        {/* OR Divider */}
        <div className="my-4 flex items-center">
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
          <span className="px-2 text-gray-500 dark:text-gray-400">OR</span>
          <div className="h-px flex-grow bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Traditional Login Form */}
        <form>
          <div className="mb-4">
            <label
              className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            className="w-full rounded-lg bg-green-600 py-3 text-white transition hover:bg-green-700"
            type="submit"
          >
            Log In
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Don't have an account?{' '}
            <Link
              className="text-blue-600 hover:underline dark:text-blue-500"
              to="/register"
            >
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link
              className="text-gray-500 hover:underline dark:text-gray-400"
              to="/forgot-password"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

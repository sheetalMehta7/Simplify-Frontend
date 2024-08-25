import { Link } from "react-router-dom";

export function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {/* Logo and Description */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Simplify</h1>
          <p className="mt-2 text-slate-600">
            Log in to manage your tasks efficiently
          </p>
        </div>

        {/* Google Login */}
        <button className="mb-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700">
          <svg className="mr-2 h-6 w-6" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.2 0 5.9 1.1 8.1 3.2l6-6C34.3 3.5 29.6 1.5 24 1.5 14.8 1.5 7.3 7.6 4.2 15.8l7.1 5.5C13.2 14.4 18.1 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M47.5 24.5c0-1.5-.1-2.9-.4-4.3H24v8.1h13.2c-.6 3-2.2 5.5-4.5 7.2l7.1 5.5c4.1-3.8 6.7-9.3 6.7-15.6z"
            />
            <path
              fill="#FBBC05"
              d="M11.3 28.8c-1.1-.7-2-1.7-2.6-2.9l-7.1 5.5c2.6 5.2 7.4 9.1 13.2 10.6l5.7-6.1c-3.5-.8-6.6-3-8.4-6.1z"
            />
            <path
              fill="#34A853"
              d="M24 47.5c5.9 0 11-2 14.7-5.5l-7.1-5.5c-2 1.3-4.5 2.1-7.6 2.1-5.8 0-10.7-3.9-12.4-9.1l-7.1 5.5c3.2 6.2 9.7 10.5 17.4 10.5z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Log in with Google
        </button>

        {/* OR Divider */}
        <div className="my-4 flex items-center">
          <div className="h-px flex-grow bg-gray-300"></div>
          <span className="px-2 text-gray-500">OR</span>
          <div className="h-px flex-grow bg-gray-300"></div>
        </div>

        {/* Traditional Login Form */}
        <form>
          <div className="mb-4">
            <label
              className="mb-2 block font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
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
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Don't have an account?{" "}
            <Link className="text-blue-600 hover:underline" to="/register">
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link
              className="text-gray-500 hover:underline"
              to="/forgot-password"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

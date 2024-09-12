import { useEffect, useState } from 'react'
import { Alert } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { clearError } from '../redux/features/error/errorSlice'
import { FaTimes } from 'react-icons/fa'

const FloatingAlert: React.FC = () => {
  const dispatch = useDispatch()
  const error = useSelector((state: RootState) => state.error.message)
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (error) {
      setShow(true)
      setProgress(100)

      const interval = setInterval(() => {
        setProgress((prev) => prev - 2)
      }, 100)

      const timer = setTimeout(() => {
        setShow(false)
        dispatch(clearError()) // Clear the error from Redux after timeout
        clearInterval(interval)
      }, 5000)

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [error, dispatch])

  // Manually close the alert
  const handleClose = () => {
    setShow(false)
    dispatch(clearError())
  }

  if (!show) return null

  return (
    <div className="fixed top-5 right-5 w-96 z-50">
      <div className="relative">
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 h-1 bg-white dark:bg-gray-300 rounded-md"
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        ></div>

        {/* Floating alert */}
        <Alert color="failure" withBorderAccent>
          <div className="flex justify-between items-center">
            <span>
              <span className="font-medium">Error:</span> {error}
            </span>
          </div>
        </Alert>

        {/* Close button positioned at the top right */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-0 mt-2 mr-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default FloatingAlert

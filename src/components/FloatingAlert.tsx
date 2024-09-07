// src/components/FloatingAlert.tsx
import { useEffect, useState } from 'react'
import { Alert } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { clearError } from '../redux/features/error/errorSlice'

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

  if (!show) return null

  return (
    <div className="fixed top-5 right-5 w-96 z-50">
      <div className="relative">
        <div
          className="absolute top-0 left-0 h-1 bg-white dark:bg-gray-300 rounded-md"
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        ></div>
        <Alert color="failure" withBorderAccent>
          <span>
            <span className="font-medium">Error:</span> {error}
          </span>
        </Alert>
      </div>
    </div>
  )
}

export default FloatingAlert

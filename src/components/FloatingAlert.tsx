// src/components/FloatingAlert.tsx
import { useEffect, useState } from 'react'
import { Alert } from 'flowbite-react'
import { useError } from '../context/ErrorContext'

const FloatingAlert: React.FC = () => {
  const { error, setError } = useError()
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
        setError(null)
        clearInterval(interval)
      }, 5000)

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [error, setError])

  if (!show) return null

  return (
    <div className="fixed top-5 right-5 w-96 z-50">
      <div className="relative">
        <div
          className="absolute top-0 left-0 h-1 bg-white dark:bg-slate-800"
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

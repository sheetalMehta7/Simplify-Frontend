import React from 'react'
import { Spinner } from 'flowbite-react'

interface LoaderProps {
  message?: string
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Spinner
        size="xl"
        aria-label="Loading..."
        className="mb-4 text-blue-600 dark:text-blue-300"
      />
      {message && (
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
          {message}
        </p>
      )}
    </div>
  )
}

export default Loader

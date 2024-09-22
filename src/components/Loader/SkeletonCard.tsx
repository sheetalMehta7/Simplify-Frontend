import React from 'react'

const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse relative p-4 rounded-lg shadow-md bg-gray-200 dark:bg-gray-600 h-36">
      <div className="absolute top-2 left-2 bg-gray-300 dark:bg-gray-500 h-4 w-4 rounded-full"></div>

      <div className="ml-8">
        <div className="h-4 bg-gray-300 dark:bg-gray-500 w-3/4 mb-2 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-500 w-1/2 mb-4 rounded"></div>
        <div className="flex">
          <div className="h-6 bg-gray-300 dark:bg-gray-500 w-16 rounded-full mr-2"></div>

          <div className="h-6 bg-gray-300 dark:bg-gray-500 w-12 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard

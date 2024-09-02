// src/context/ErrorContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react'
import FloatingAlert from '../components/FloatingAlert'

interface ErrorContextProps {
  error: string | null
  setError: (message: string | null) => void
}

interface ErrorProviderProps {
  children: ReactNode
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined)

export const useError = () => {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null)

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <FloatingAlert />
      {children}
    </ErrorContext.Provider>
  )
}

import React, { ReactNode } from 'react'

interface CardProps {
    children: ReactNode;
  }

const Card: React.FC<CardProps> = ({children}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg p-6">
        {children}
    </div>
  )
}

export default Card
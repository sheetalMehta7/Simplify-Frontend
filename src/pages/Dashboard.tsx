import React from 'react'
import { SidebarNav } from '../layout/SidebarNav'

const Dashboard = () => {
  return (
    <div className='grid grid-cols-12 p-8 h-screen'>
        <div className='col-span-4'>
         <SidebarNav/>
        </div>
        <div className='col-span-8'>
            <div className='grid grid-cols-12'>

            </div>
        </div>
    </div>
  )
}

export default Dashboard

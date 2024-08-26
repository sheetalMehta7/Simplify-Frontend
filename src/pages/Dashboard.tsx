import React from 'react'
import { SidebarNav } from '../layout/SidebarNav'
import { TextInput } from 'flowbite-react'
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiSettingsLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

const Dashboard = () => {
  return (
    <div className='grid grid-cols-12 p-8 h-screen gap-4'>
      <div className='col-span-2'>
        <SidebarNav />
      </div>
      <div className='col-span-10'>
        <div className='grid grid-cols-12 mb-12'>
          <div className='col-span-8'>
            <div className='relative '>
              <TextInput id="small" type="text" sizing="sm" defaultValue={"Search people, projects or tasks"}
                className='w-full ' />
            </div>
          </div>
          <div className='col-span-4 flex justify-end gap-5'>
            <IoMdNotificationsOutline />
            <RiSettingsLine />
            <CgProfile />
          </div>
        </div>
        <div className='grid grid-cols-12'>
          <div className='col-span-8'>
            <Tabs aria-label="Tabs with icons" variant="underline">
              <Tabs.Item active title="Profile" icon={HiUserCircle}>
                This is <span className="font-medium text-gray-800 dark:text-white">Profile tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
              </Tabs.Item>
              <Tabs.Item title="Dashboard" icon={MdDashboard}>
                This is <span className="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
              </Tabs.Item>
              <Tabs.Item title="Settings" icon={HiAdjustments}>
                This is <span className="font-medium text-gray-800 dark:text-white">Settings tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
              </Tabs.Item>
              <Tabs.Item title="Contacts" icon={HiClipboardList}>
                This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
                Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                control the content visibility and styling.
              </Tabs.Item>
              <Tabs.Item disabled title="Disabled">
                Disabled content
              </Tabs.Item>
            </Tabs>
          </div>
          <div className='col-span-4'>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

import { SidebarNav } from '../layout/SidebarNav'
import { TopNav } from '../layout/TopNav'
import { DashboardTabs } from '../components/DashboardTabs'
import { TaskBoard } from '../components/TaskBoard'

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-2">
        <SidebarNav />
      </div>
      <div className="col-span-10 bg-gray-900 text-white">
        <TopNav />
        <div className="p-4">
          <DashboardTabs />
          <TaskBoard />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

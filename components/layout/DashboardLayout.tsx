import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'seeker' | 'poster' | 'admin'
  userName?: string
  userImage?: string
  userRole?: string
}

export function DashboardLayout({ children, role, userName, userImage, userRole }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-soft-stone">
      <Sidebar role={role} userName={userName} userImage={userImage} userRole={userRole} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

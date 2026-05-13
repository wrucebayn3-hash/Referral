'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Briefcase, BookmarkCheck, Bell, User,
  PlusCircle, FileText, Inbox, MessageSquare,
  Users, Settings, BarChart3, Shield, ClipboardList,
  ChevronRight
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const seekerNav: NavItem[] = [
  { label: 'Dashboard', href: '/seeker/dashboard', icon: LayoutDashboard },
  { label: 'Browse Jobs', href: '/jobs', icon: Briefcase },
  { label: 'My Referrals', href: '/seeker/referrals', icon: FileText },
  { label: 'Saved Jobs', href: '/seeker/saved', icon: BookmarkCheck },
  { label: 'Notifications', href: '/seeker/notifications', icon: Bell },
  { label: 'Profile', href: '/seeker/profile', icon: User },
]

const posterNav: NavItem[] = [
  { label: 'Dashboard', href: '/poster/dashboard', icon: LayoutDashboard },
  { label: 'Post a Job', href: '/poster/post-job', icon: PlusCircle },
  { label: 'My Jobs', href: '/poster/jobs', icon: Briefcase },
  { label: 'Referral Requests', href: '/poster/requests', icon: Inbox },
  { label: 'Messages', href: '/poster/messages', icon: MessageSquare },
  { label: 'Browse Jobs', href: '/jobs', icon: FileText },
  { label: 'Notifications', href: '/poster/notifications', icon: Bell },
  { label: 'Profile', href: '/poster/profile', icon: User },
]

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { label: 'Referrals', href: '/admin/referrals', icon: ClipboardList },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Activity Logs', href: '/admin/activity', icon: Shield },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface SidebarProps {
  role: 'seeker' | 'poster' | 'admin'
  userName?: string
  userImage?: string
  userRole?: string
}

export function Sidebar({ role, userName, userImage, userRole }: SidebarProps) {
  const pathname = usePathname()
  const navItems = role === 'admin' ? adminNav : role === 'poster' ? posterNav : seekerNav

  return (
    <aside className="w-64 min-h-screen bg-canvas-white border-r border-hairline flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-hairline">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-near-black rounded-xs flex items-center justify-center">
            <span className="text-white font-display font-medium text-xs">W</span>
          </div>
          <span className="font-display font-medium text-near-black">Wasta</span>
        </Link>
        {role === 'admin' && (
          <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-900 text-white">Admin</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-sm text-caption transition-colors',
                active
                  ? 'bg-near-black text-white'
                  : 'text-ink hover:bg-soft-stone hover:text-near-black'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Role switcher for BOTH users */}
      {(userRole === 'BOTH') && (
        <div className="p-4 border-t border-hairline">
          <p className="text-micro text-muted-slate uppercase tracking-wider mb-2">Switch Mode</p>
          {role === 'seeker' ? (
            <Link href="/poster/dashboard" className="flex items-center gap-2 text-caption text-ink hover:text-near-black">
              <ChevronRight className="w-4 h-4" />
              Go to Referrer Mode
            </Link>
          ) : role === 'poster' ? (
            <Link href="/seeker/dashboard" className="flex items-center gap-2 text-caption text-ink hover:text-near-black">
              <ChevronRight className="w-4 h-4" />
              Go to Job Seeker Mode
            </Link>
          ) : null}
        </div>
      )}
    </aside>
  )
}

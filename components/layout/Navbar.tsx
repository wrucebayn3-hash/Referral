'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Bell, ChevronDown, Menu, X, Briefcase, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const getDashboardLink = () => {
    if (!session?.user?.role) return '/login'
    if (session.user.role === 'ADMIN') return '/admin/dashboard'
    if (session.user.role === 'POSTER') return '/poster/dashboard'
    if (session.user.role === 'BOTH') return '/poster/dashboard'
    return '/seeker/dashboard'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas-white border-b border-hairline">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-near-black rounded-sm flex items-center justify-center">
              <span className="text-white font-display font-medium text-sm">W</span>
            </div>
            <span className="font-display font-medium text-near-black text-lg tracking-tight">Wasta</span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-body text-ink hover:text-near-black transition-colors">Browse Jobs</Link>
            <Link href="/how-it-works" className="text-body text-ink hover:text-near-black transition-colors">How it Works</Link>
            <Link href="/about" className="text-body text-ink hover:text-near-black transition-colors">About</Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {session?.user ? (
              <>
                <Link href="/notifications" className="relative p-2 hover:bg-soft-stone rounded-sm transition-colors">
                  <Bell className="w-5 h-5 text-ink" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-soft-stone transition-colors"
                  >
                    <Avatar name={session.user.name} image={session.user.image} size="sm" />
                    <span className="text-caption text-ink">{session.user.name}</span>
                    <ChevronDown className="w-4 h-4 text-muted-slate" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-hairline rounded-sm shadow-lg py-1 z-50">
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-2 px-4 py-2 text-caption text-ink hover:bg-soft-stone transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/jobs"
                        className="flex items-center gap-2 px-4 py-2 text-caption text-ink hover:bg-soft-stone transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Briefcase className="w-4 h-4" />
                        Browse Jobs
                      </Link>
                      <Link
                        href={session.user.role === 'ADMIN' ? '/admin/settings' : '/seeker/profile'}
                        className="flex items-center gap-2 px-4 py-2 text-caption text-ink hover:bg-soft-stone transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <hr className="border-hairline my-1" />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 px-4 py-2 text-caption text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-body text-ink hover:text-near-black transition-colors">Sign in</Link>
                <Link href="/signup" className="btn-primary text-sm px-5 py-2">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-hairline py-4 space-y-2">
            <Link href="/jobs" className="block px-4 py-2 text-body text-ink">Browse Jobs</Link>
            <Link href="/how-it-works" className="block px-4 py-2 text-body text-ink">How it Works</Link>
            <Link href="/about" className="block px-4 py-2 text-body text-ink">About</Link>
            {session?.user ? (
              <>
                <Link href={getDashboardLink()} className="block px-4 py-2 text-body text-ink">Dashboard</Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block px-4 py-2 text-body text-red-600 w-full text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-body text-ink">Sign in</Link>
                <Link href="/signup" className="block px-4 py-2 text-body font-medium text-near-black">Get started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

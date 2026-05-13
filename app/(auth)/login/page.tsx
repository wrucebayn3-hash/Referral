'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/session')
    const session = await res.json()
    const role = session?.user?.role

    if (role === 'ADMIN') router.push('/admin/dashboard')
    else if (role === 'POSTER') router.push('/poster/dashboard')
    else if (role === 'BOTH') router.push('/poster/dashboard')
    else router.push('/seeker/dashboard')
  }

  return (
    <div className="min-h-screen bg-canvas-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 dark-band flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-xs flex items-center justify-center">
            <span className="text-near-black font-display font-medium text-sm">W</span>
          </div>
          <span className="font-display text-white text-lg">Wasta</span>
        </Link>
        <div>
          <blockquote className="text-section-heading font-display text-white leading-tight mb-6">
            "I got referred to Stripe through Wasta. Best career decision I ever made."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-display text-sm">AJ</span>
            </div>
            <div>
              <p className="text-caption text-white font-medium">Alex Johnson</p>
              <p className="text-micro text-white/60">Senior Engineer at Stripe</p>
            </div>
          </div>
        </div>
        <p className="text-micro text-white/40">© 2025 Wasta</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-7 h-7 bg-near-black rounded-xs flex items-center justify-center">
                <span className="text-white font-display font-medium text-xs">W</span>
              </div>
              <span className="font-display font-medium text-near-black">Wasta</span>
            </Link>
            <h1 className="font-display text-card-heading font-normal text-near-black mb-2">Welcome back</h1>
            <p className="text-caption text-muted-slate">Sign in to your Wasta account</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm mb-6 text-caption text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link href="/forgot-password" className="text-micro text-action-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-caption text-muted-slate mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-near-black font-medium hover:underline">
              Create one free
            </Link>
          </p>

          <div className="mt-8 p-4 bg-soft-stone rounded-sm">
            <p className="text-micro text-muted-slate font-medium mb-2">Demo accounts:</p>
            <div className="space-y-1 text-micro text-muted-slate font-mono">
              <p>Admin: admin@wasta.io / password123</p>
              <p>Seeker: seeker@wasta.io / password123</p>
              <p>Poster: poster@wasta.io / password123</p>
              <p>Both: both@wasta.io / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas-white flex items-center justify-center"><div className="animate-spin rounded-full border-2 border-hairline border-t-near-black w-6 h-6" /></div>}>
      <LoginForm />
    </Suspense>
  )
}

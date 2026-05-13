'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, AlertCircle, Briefcase, Search, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'SEEKER' | 'POSTER' | 'BOTH'

const roleOptions = [
  {
    value: 'SEEKER' as Role,
    icon: Search,
    title: 'Job Seeker',
    description: 'I\'m looking for jobs and want referrals',
  },
  {
    value: 'POSTER' as Role,
    icon: Briefcase,
    title: 'Referrer / Job Poster',
    description: 'I can refer candidates and post jobs',
  },
  {
    value: 'BOTH' as Role,
    icon: Users,
    title: 'Both',
    description: 'I want to seek referrals and refer others',
  },
]

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('SEEKER')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        if (role === 'POSTER' || role === 'BOTH') router.push('/poster/dashboard')
        else router.push('/seeker/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-soft-stone flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-near-black rounded-xs flex items-center justify-center">
            <span className="text-white font-display font-medium text-sm">W</span>
          </div>
          <span className="font-display font-medium text-near-black text-lg">Wasta</span>
        </Link>
        <div className="space-y-6">
          <h2 className="font-display text-section-heading font-normal text-near-black leading-tight">
            Your next job is one referral away
          </h2>
          <div className="space-y-4">
            {[
              '4× higher interview rate with a referral',
              'Direct access to employees at top companies',
              'Full visibility into your referral status',
              'Free for job seekers, always',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-enterprise-green flex-shrink-0" />
                <p className="text-body text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-micro text-muted-slate">Trusted by 12,000+ job seekers</p>
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
            <h1 className="font-display text-card-heading font-normal text-near-black mb-2">Create your account</h1>
            <p className="text-caption text-muted-slate">Free to join. No credit card required.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm mb-6 text-caption text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="label">I want to…</label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-sm border text-center transition-all',
                        role === option.value
                          ? 'border-near-black bg-near-black text-white'
                          : 'border-hairline bg-canvas-white text-ink hover:border-near-black/40'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-micro font-medium leading-tight">{option.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Alex Johnson"
                required
              />
            </div>
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
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-11"
                  placeholder="Min. 8 characters"
                  minLength={8}
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-caption text-muted-slate mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-near-black font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-micro text-muted-slate mt-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

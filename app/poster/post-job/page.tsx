'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useSession } from 'next-auth/react'
import { Plus, X, Save } from 'lucide-react'

const WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE']
const JOB_TYPES = ['FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP']
const EXPERIENCE_LEVELS = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']
const INDUSTRIES = [
  'Fintech', 'SaaS', 'Developer Tools', 'Design Tools', 'Cloud Infrastructure',
  'Travel & Hospitality', 'Healthcare', 'E-commerce', 'Media & Entertainment',
  'Education', 'Real Estate', 'Cybersecurity', 'AI & ML', 'Other',
]

const modeLabels: Record<string, string> = { REMOTE: 'Remote', HYBRID: 'Hybrid', ONSITE: 'On-site' }
const typeLabels: Record<string, string> = { FULLTIME: 'Full-time', PARTTIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship' }
const levelLabels: Record<string, string> = { ENTRY: 'Entry Level', MID: 'Mid Level', SENIOR: 'Senior', LEAD: 'Lead', EXECUTIVE: 'Executive' }

export default function PostJobPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    workMode: 'HYBRID',
    jobType: 'FULLTIME',
    experienceLevel: 'MID',
    industry: '',
    description: '',
    requirements: '',
    skills: [] as string[],
    deadline: '',
    referralAvailable: true,
    status: 'ACTIVE',
  })

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, deadline: form.deadline || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to post job')
      } else {
        router.push('/poster/jobs')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <DashboardLayout role="poster" userName={session?.user?.name ?? undefined} userRole={session?.user?.role}>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Post a Job</h1>
          <p className="text-caption text-muted-slate">Fill in the details below to create a new job listing.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-caption text-red-700 mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="card space-y-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Basic Information</h2>
            <div>
              <label className="label">Job Title *</label>
              <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Senior Frontend Engineer" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Company *</label>
                <input className="input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Stripe" required />
              </div>
              <div>
                <label className="label">Location *</label>
                <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="San Francisco, CA" required />
              </div>
            </div>
            <div>
              <label className="label">Industry</label>
              <select className="input" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </div>

          {/* Job type */}
          <div className="card space-y-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Job Type</h2>
            <div>
              <label className="label">Work Mode</label>
              <div className="flex gap-2">
                {WORK_MODES.map((mode) => (
                  <button
                    key={mode} type="button"
                    onClick={() => set('workMode', mode)}
                    className={`flex-1 py-2 px-3 rounded-sm border text-caption transition-colors ${form.workMode === mode ? 'bg-near-black text-white border-near-black' : 'border-hairline text-ink hover:border-near-black/40'}`}
                  >
                    {modeLabels[mode]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Job Type</label>
              <div className="flex gap-2">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type} type="button"
                    onClick={() => set('jobType', type)}
                    className={`flex-1 py-2 px-3 rounded-sm border text-caption transition-colors ${form.jobType === type ? 'bg-near-black text-white border-near-black' : 'border-hairline text-ink hover:border-near-black/40'}`}
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Experience Level</label>
              <div className="flex gap-2">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level} type="button"
                    onClick={() => set('experienceLevel', level)}
                    className={`flex-1 py-2 px-3 rounded-sm border text-caption transition-colors ${form.experienceLevel === level ? 'bg-near-black text-white border-near-black' : 'border-hairline text-ink hover:border-near-black/40'}`}
                  >
                    {levelLabels[level]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card space-y-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Description</h2>
            <div>
              <label className="label">Job Description *</label>
              <textarea className="input min-h-[160px] resize-none" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the role, team, and what success looks like..." required />
            </div>
            <div>
              <label className="label">Requirements</label>
              <textarea className="input min-h-[100px] resize-none" value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="List the key requirements and qualifications..." />
            </div>
          </div>

          {/* Skills */}
          <div className="card space-y-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Skills</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-xs bg-soft-stone text-ink text-caption border border-hairline">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-muted-slate hover:text-red-500 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add required skill (press Enter)"
              />
              <button type="button" onClick={addSkill} className="btn-secondary px-3">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="card space-y-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Settings</h2>
            <div>
              <label className="label">Application Deadline (optional)</label>
              <input type="date" className="input" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
            </div>
            <div className="flex items-center justify-between p-4 bg-soft-stone rounded-sm">
              <div>
                <p className="text-caption font-medium text-near-black">Referral Available</p>
                <p className="text-micro text-muted-slate">Allow job seekers to request a referral from you</p>
              </div>
              <button
                type="button"
                onClick={() => set('referralAvailable', !form.referralAvailable)}
                className={`w-12 h-6 rounded-full transition-colors relative ${form.referralAvailable ? 'bg-near-black' : 'bg-hairline'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.referralAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            <div>
              <label className="label">Initial Status</label>
              <div className="flex gap-2">
                {['ACTIVE', 'DRAFT'].map((s) => (
                  <button
                    key={s} type="button"
                    onClick={() => set('status', s)}
                    className={`px-4 py-2 rounded-sm border text-caption transition-colors ${form.status === s ? 'bg-near-black text-white border-near-black' : 'border-hairline text-ink hover:border-near-black/40'}`}
                  >
                    {s === 'ACTIVE' ? 'Publish Now' : 'Save as Draft'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base justify-center">
            <Save className="w-4 h-4" />
            {loading ? 'Publishing...' : 'Publish Job'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

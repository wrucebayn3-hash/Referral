'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useSession } from 'next-auth/react'
import { Avatar } from '@/components/ui/Avatar'
import { parseJsonField } from '@/lib/utils'
import { Save, Plus, X, User, Briefcase, Code } from 'lucide-react'

export default function PosterProfilePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    currentRole: '',
    currentCompany: '',
    skills: [] as string[],
  })
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    fetch('/api/users/profile')
      .then((r) => r.json())
      .then((d) => {
        const p = d.user?.profile || {}
        setProfile(p)
        setForm({
          name: d.user?.name || '',
          bio: p.bio || '',
          phone: p.phone || '',
          location: p.location || '',
          linkedinUrl: p.linkedinUrl || '',
          currentRole: p.currentRole || '',
          currentCompany: p.currentCompany || '',
          skills: parseJsonField(p.skills),
        })
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  if (loading || !session?.user) return (
    <DashboardLayout role="poster">
      <div className="animate-pulse space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-soft-stone rounded-sm" />)}
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout role="poster" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-card-heading font-normal text-near-black">My Profile</h1>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="card flex items-center gap-4">
          <Avatar name={session.user.name} image={session.user.image} size="xl" />
          <div>
            <p className="text-caption font-medium text-near-black">{session.user.name}</p>
            <p className="text-micro text-muted-slate">{session.user.email}</p>
            <p className="text-micro text-muted-slate mt-1">{session.user.role}</p>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-muted-slate" />
            <h2 className="font-display text-feature-heading font-medium text-near-black">Personal Info</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input min-h-[80px] resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell candidates about yourself..." />
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-muted-slate" />
            <h2 className="font-display text-feature-heading font-medium text-near-black">Professional</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Current Role</label>
              <input className="input" value={form.currentRole} onChange={(e) => setForm({ ...form, currentRole: e.target.value })} />
            </div>
            <div>
              <label className="label">Current Company</label>
              <input className="input" value={form.currentCompany} onChange={(e) => setForm({ ...form, currentCompany: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">LinkedIn URL</label>
            <input className="input" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-muted-slate" />
            <h2 className="font-display text-feature-heading font-medium text-near-black">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-xs bg-soft-stone text-ink text-caption border border-hairline">
                {skill}
                <button type="button" onClick={() => setForm({ ...form, skills: form.skills.filter((s) => s !== skill) })} className="text-muted-slate hover:text-red-500 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill" />
            <button type="button" onClick={addSkill} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

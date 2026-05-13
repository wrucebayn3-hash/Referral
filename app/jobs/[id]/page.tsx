'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { parseJsonField, formatDate } from '@/lib/utils'
import {
  MapPin, Calendar, Briefcase, Users, ExternalLink,
  ArrowLeft, Send, BookmarkPlus, Clock
} from 'lucide-react'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [message, setMessage] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setJob(d.job)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }
    setRequesting(true)
    setError('')

    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          referrerId: job.postedById,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send request')
      } else {
        setRequestSent(true)
        setShowRequestForm(false)
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setRequesting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-canvas-white">
      <Navbar />
      <div className="pt-16"><PageLoading /></div>
    </div>
  )

  if (!job) return (
    <div className="min-h-screen bg-canvas-white">
      <Navbar />
      <div className="pt-24 section-container text-center">
        <p className="text-body text-muted-slate">Job not found.</p>
        <Link href="/jobs" className="btn-primary mt-4">Browse Jobs</Link>
      </div>
    </div>
  )

  const skills = parseJsonField(job.skills)

  return (
    <div className="min-h-screen bg-canvas-white">
      <Navbar />
      <div className="pt-16">
        <div className="section-container py-8">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-caption text-muted-slate hover:text-ink mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-sm bg-soft-stone flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-xl font-medium text-near-black">{job.company.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h1 className="font-display text-card-heading font-normal text-near-black mb-1">{job.title}</h1>
                    <p className="text-body text-muted-slate">{job.company}</p>
                  </div>
                  {job.referralAvailable && (
                    <span className="text-caption px-3 py-1 rounded-full bg-pale-green text-green-700 border border-green-200 flex-shrink-0">
                      Referral Available
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-hairline">
                  <div className="flex items-center gap-2 text-caption text-muted-slate">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-caption text-muted-slate">
                    <Briefcase className="w-4 h-4" />
                    <StatusBadge status={job.jobType} />
                  </div>
                  <div className="flex items-center gap-2 text-caption text-muted-slate">
                    <Clock className="w-4 h-4" />
                    <StatusBadge status={job.workMode} />
                  </div>
                  <div className="flex items-center gap-2 text-caption text-muted-slate">
                    <Users className="w-4 h-4" />
                    {job._count.referralRequests} requests
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card">
                <h2 className="font-display text-feature-heading font-medium text-near-black mb-4">About the role</h2>
                <div className="prose prose-sm max-w-none text-body text-ink leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="card">
                  <h2 className="font-display text-feature-heading font-medium text-near-black mb-4">Requirements</h2>
                  <div className="text-body text-ink leading-relaxed whitespace-pre-wrap">
                    {job.requirements}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="card">
                  <h2 className="font-display text-feature-heading font-medium text-near-black mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 rounded-xs bg-soft-stone text-ink text-caption border border-hairline">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Referral request form */}
              {showRequestForm && (
                <div className="card border-near-black">
                  <h2 className="font-display text-feature-heading font-medium text-near-black mb-4">Request a Referral</h2>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-caption text-red-700 mb-4">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleRequest} className="space-y-4">
                    <div>
                      <label className="label">Your message to {job.postedBy.name}</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="input min-h-[120px] resize-none"
                        placeholder="Hi, I'm very interested in this role. I have 3 years of React experience and would love your referral..."
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={requesting} className="btn-primary">
                        {requesting ? 'Sending...' : 'Send Request'}
                        <Send className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setShowRequestForm(false)} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Action card */}
              <div className="card border-near-black">
                <h3 className="font-display text-feature-heading font-medium text-near-black mb-4">
                  {requestSent ? '✓ Request sent!' : 'Get Referred'}
                </h3>
                {requestSent ? (
                  <div className="space-y-3">
                    <p className="text-caption text-muted-slate">Your referral request has been sent. Track it from your dashboard.</p>
                    <Link href="/seeker/referrals" className="btn-primary w-full justify-center">
                      View My Requests
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {job.referralAvailable ? (
                      <>
                        <p className="text-caption text-muted-slate">
                          {job.postedBy.name} is willing to refer qualified candidates for this role.
                        </p>
                        {session?.user ? (
                          !showRequestForm && (
                            <button
                              onClick={() => setShowRequestForm(true)}
                              className="btn-primary w-full justify-center"
                            >
                              Request Referral <Send className="w-4 h-4" />
                            </button>
                          )
                        ) : (
                          <Link href="/login" className="btn-primary w-full justify-center">
                            Sign in to Request
                          </Link>
                        )}
                      </>
                    ) : (
                      <p className="text-caption text-muted-slate">Referrals are not available for this job at the moment.</p>
                    )}
                    <button className="btn-secondary w-full justify-center flex items-center gap-2">
                      <BookmarkPlus className="w-4 h-4" />
                      Save Job
                    </button>
                  </div>
                )}
              </div>

              {/* Posted by */}
              <div className="card">
                <h3 className="font-display text-feature-heading font-medium text-near-black mb-4">Posted by</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={job.postedBy.name} image={job.postedBy.image} size="lg" />
                  <div>
                    <p className="text-caption font-medium text-near-black">{job.postedBy.name}</p>
                    {job.postedBy.profile?.currentRole && (
                      <p className="text-micro text-muted-slate">{job.postedBy.profile.currentRole}</p>
                    )}
                    {job.postedBy.profile?.currentCompany && (
                      <p className="text-micro text-muted-slate">@ {job.postedBy.profile.currentCompany}</p>
                    )}
                  </div>
                </div>
                {job.postedBy.profile?.bio && (
                  <p className="text-micro text-muted-slate leading-relaxed">{job.postedBy.profile.bio}</p>
                )}
                {job.postedBy.profile?.linkedinUrl && (
                  <a
                    href={job.postedBy.profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-micro text-action-blue hover:underline"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Job info */}
              <div className="card">
                <h3 className="font-display text-feature-heading font-medium text-near-black mb-4">Job details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Experience', value: <StatusBadge status={job.experienceLevel} /> },
                    { label: 'Industry', value: job.industry || '—' },
                    { label: 'Posted', value: formatDate(job.createdAt) },
                    { label: 'Deadline', value: job.deadline ? formatDate(job.deadline) : 'Open' },
                    { label: 'Status', value: <StatusBadge status={job.status} /> },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-micro text-muted-slate">{label}</span>
                      <span className="text-micro text-ink">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

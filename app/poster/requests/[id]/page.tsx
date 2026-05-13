import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { parseJsonField, formatDate } from '@/lib/utils'
import { ReferralActions } from './ReferralActions'
import { MapPin, Briefcase, ExternalLink, FileText, ArrowLeft, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function ReferralDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params
  const referral = await prisma.referralRequest.findUnique({
    where: { id },
    include: {
      job: true,
      seeker: { include: { profile: true } },
      referrer: { select: { id: true, name: true } },
      messages: {
        include: { sender: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!referral) notFound()
  if (referral.referrerId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/poster/requests')
  }

  const seekerProfile = referral.seeker.profile
  const skills = parseJsonField(seekerProfile?.skills)

  return (
    <DashboardLayout role="poster" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="space-y-6">
        <Link href="/poster/requests" className="inline-flex items-center gap-2 text-caption text-muted-slate hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          Back to requests
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Candidate profile */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Avatar name={referral.seeker.name} image={referral.seeker.image} size="xl" />
                  <div>
                    <h1 className="font-display text-card-heading font-normal text-near-black">{referral.seeker.name}</h1>
                    <p className="text-caption text-muted-slate">{referral.seeker.email}</p>
                    {seekerProfile?.currentRole && (
                      <p className="text-caption text-muted-slate mt-0.5">{seekerProfile.currentRole} {seekerProfile?.currentCompany ? `@ ${seekerProfile.currentCompany}` : ''}</p>
                    )}
                    {seekerProfile?.location && (
                      <div className="flex items-center gap-1 text-micro text-muted-slate mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {seekerProfile.location}
                      </div>
                    )}
                  </div>
                </div>
                <StatusBadge status={referral.status} />
              </div>

              {seekerProfile?.bio && (
                <div className="p-4 bg-soft-stone rounded-sm">
                  <p className="text-caption text-ink leading-relaxed italic">"{seekerProfile.bio}"</p>
                </div>
              )}

              {skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-micro text-muted-slate uppercase tracking-wider mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-xs bg-soft-stone text-ink text-caption border border-hairline">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                {seekerProfile?.linkedinUrl && (
                  <a href={seekerProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-micro text-action-blue hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}
                {seekerProfile?.resumeUrl && (
                  <a href={seekerProfile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-micro text-action-blue hover:underline">
                    <FileText className="w-3.5 h-3.5" />
                    Resume
                  </a>
                )}
              </div>
            </div>

            {/* Referral message */}
            {referral.message && (
              <div className="card">
                <h2 className="font-display text-feature-heading font-medium text-near-black mb-3">Their Message</h2>
                <div className="p-4 bg-soft-stone rounded-sm">
                  <p className="text-body text-ink leading-relaxed">"{referral.message}"</p>
                </div>
              </div>
            )}

            {/* Message thread */}
            {(referral.status === 'ACCEPTED' || referral.messages.length > 0) && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-muted-slate" />
                  <h2 className="font-display text-feature-heading font-medium text-near-black">Messages</h2>
                </div>
                {referral.messages.length === 0 ? (
                  <p className="text-caption text-muted-slate">No messages yet. Start the conversation below.</p>
                ) : (
                  <div className="space-y-3">
                    {referral.messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-2 ${msg.senderId === session.user.id ? 'flex-row-reverse' : ''}`}>
                        <Avatar name={msg.sender.name} image={msg.sender.image} size="sm" />
                        <div className={`max-w-xs p-3 rounded-sm text-caption ${msg.senderId === session.user.id ? 'bg-near-black text-white' : 'bg-soft-stone text-ink'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions sidebar */}
          <div className="space-y-4">
            {/* Job info */}
            <div className="card">
              <h3 className="font-display text-feature-heading font-medium text-near-black mb-3">Job</h3>
              <div className="space-y-2">
                <p className="text-caption font-medium text-near-black">{referral.job.title}</p>
                <div className="flex items-center gap-1 text-micro text-muted-slate">
                  <Briefcase className="w-3.5 h-3.5" />
                  {referral.job.company}
                </div>
                <div className="flex items-center gap-1 text-micro text-muted-slate">
                  <MapPin className="w-3.5 h-3.5" />
                  {referral.job.location}
                </div>
                <Link href={`/jobs/${referral.job.id}`} className="text-micro text-action-blue hover:underline flex items-center gap-1 mt-2">
                  <ExternalLink className="w-3 h-3" />
                  View job listing
                </Link>
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h3 className="font-display text-feature-heading font-medium text-near-black mb-3">Timeline</h3>
              <div className="space-y-2 text-micro text-muted-slate">
                <div className="flex justify-between">
                  <span>Requested</span>
                  <span>{formatDate(referral.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated</span>
                  <span>{formatDate(referral.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <StatusBadge status={referral.status} />
                </div>
              </div>
            </div>

            <ReferralActions referralId={referral.id} currentStatus={referral.status} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

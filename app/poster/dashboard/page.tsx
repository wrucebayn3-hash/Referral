import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { ReferralCard } from '@/components/referrals/ReferralCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import {
  Briefcase, Inbox, CheckCircle, Users,
  PlusCircle, ArrowRight, Clock, MapPin
} from 'lucide-react'

export default async function PosterDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role === 'SEEKER') redirect('/seeker/dashboard')

  const userId = session.user.id

  const [jobs, referrals] = await Promise.all([
    prisma.job.findMany({
      where: { postedById: userId },
      include: { _count: { select: { referralRequests: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.referralRequest.findMany({
      where: { referrerId: userId },
      include: {
        job: { select: { id: true, title: true, company: true, location: true, workMode: true } },
        seeker: {
          select: {
            id: true, name: true, email: true, image: true,
            profile: { select: { currentRole: true, skills: true } },
          },
        },
        referrer: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const activeJobs = jobs.filter((j) => j.status === 'ACTIVE').length
  const totalRequests = referrals.length
  const pendingRequests = referrals.filter((r) => r.status === 'PENDING').length
  const acceptedRequests = referrals.filter((r) => r.status === 'ACCEPTED').length
  const referredCandidates = referrals.filter((r) => r.status === 'REFERRED').length

  return (
    <DashboardLayout role="poster" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-card-heading font-normal text-near-black mb-1">
              Welcome back, {session.user.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-caption text-muted-slate">Manage your jobs and referral requests.</p>
          </div>
          <Link href="/poster/post-job" className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Jobs Posted" value={jobs.length} icon={Briefcase} />
          <StatCard label="Active Jobs" value={activeJobs} icon={CheckCircle} />
          <StatCard label="Total Requests" value={totalRequests} icon={Inbox} />
          <StatCard label="Pending" value={pendingRequests} icon={Clock} />
          <StatCard label="Referred" value={referredCandidates} icon={Users} accent />
        </div>

        {/* Recent requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Recent Requests</h2>
            <Link href="/poster/requests" className="text-caption text-muted-slate hover:text-ink flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {referrals.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No referral requests yet"
              description="Post a job to start receiving referral requests."
              action={<Link href="/poster/post-job" className="btn-primary">Post a Job</Link>}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {referrals.slice(0, 4).map((referral) => (
                <ReferralCard key={referral.id} referral={referral as any} viewAs="referrer" />
              ))}
            </div>
          )}
        </div>

        {/* My jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">My Jobs</h2>
            <Link href="/poster/jobs" className="text-caption text-muted-slate hover:text-ink flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet"
              description="Post your first job to start receiving referral requests."
              action={<Link href="/poster/post-job" className="btn-primary">Post a Job</Link>}
            />
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-sm bg-soft-stone flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-medium text-sm text-near-black">{job.company.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-caption font-medium text-near-black truncate">{job.title}</p>
                      <div className="flex items-center gap-2 text-micro text-muted-slate">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                        <span>·</span>
                        {job._count.referralRequests} requests
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={job.status} />
                    <span className="text-micro text-muted-slate">{formatRelativeTime(job.createdAt)}</span>
                    <Link href={`/poster/jobs/${job.id}/edit`} className="text-micro text-action-blue hover:underline">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

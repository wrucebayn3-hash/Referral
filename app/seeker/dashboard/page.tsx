import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { JobCard } from '@/components/jobs/JobCard'
import { ReferralCard } from '@/components/referrals/ReferralCard'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { Briefcase, FileText, BookmarkCheck, Clock, CheckCircle, ArrowRight } from 'lucide-react'

export default async function SeekerDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userId = session.user.id

  const [profile, referrals, savedJobs, recentJobs] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.referralRequest.findMany({
      where: { seekerId: userId },
      include: {
        job: { select: { id: true, title: true, company: true, location: true, workMode: true } },
        seeker: { select: { id: true, name: true, email: true, image: true, profile: { select: { currentRole: true, skills: true } } } },
        referrer: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.savedJob.count({ where: { userId } }),
    prisma.job.findMany({
      where: { status: 'ACTIVE', referralAvailable: true },
      include: {
        postedBy: {
          select: {
            id: true, name: true, image: true,
            profile: { select: { currentRole: true, currentCompany: true } },
          },
        },
        _count: { select: { referralRequests: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const pending = referrals.filter((r) => r.status === 'PENDING').length
  const accepted = referrals.filter((r) => r.status === 'ACCEPTED').length
  const referred = referrals.filter((r) => r.status === 'REFERRED').length

  return (
    <DashboardLayout role="seeker" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">
            Welcome back, {session.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-caption text-muted-slate">Here's what's happening with your referrals.</p>
        </div>

        {/* Profile completion */}
        {profile && profile.completionPct < 100 && (
          <div className="card border-l-4 border-l-coral">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-caption font-medium text-near-black">Complete your profile</p>
                <p className="text-micro text-muted-slate">A complete profile gets 3× more referral acceptances</p>
              </div>
              <Link href="/seeker/profile" className="btn-primary text-sm px-4 py-2">
                Complete Now
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-hairline rounded-full h-1.5">
                <div
                  className="bg-coral h-1.5 rounded-full transition-all"
                  style={{ width: `${profile.completionPct}%` }}
                />
              </div>
              <span className="text-micro text-muted-slate flex-shrink-0">{profile.completionPct}%</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Requests" value={referrals.length} icon={FileText} />
          <StatCard label="Pending" value={pending} icon={Clock} />
          <StatCard label="Accepted" value={accepted} icon={CheckCircle} />
          <StatCard label="Saved Jobs" value={savedJobs} icon={BookmarkCheck} />
        </div>

        {/* Recent referral requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Recent Requests</h2>
            <Link href="/seeker/referrals" className="text-caption text-muted-slate hover:text-ink flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {referrals.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No referral requests yet"
              description="Browse jobs and request your first referral to get started."
              action={<Link href="/jobs" className="btn-primary">Browse Jobs</Link>}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {referrals.slice(0, 4).map((referral) => (
                <ReferralCard key={referral.id} referral={referral as any} viewAs="seeker" />
              ))}
            </div>
          )}
        </div>

        {/* Recommended jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-feature-heading font-medium text-near-black">Recommended Jobs</h2>
            <Link href="/jobs" className="text-caption text-muted-slate hover:text-ink flex items-center gap-1">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentJobs.length === 0 ? (
            <EmptyState icon={Briefcase} title="No jobs available" description="Check back soon for new openings." />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

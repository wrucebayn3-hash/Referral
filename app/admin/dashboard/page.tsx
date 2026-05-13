import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Users, Briefcase, FileText, CheckCircle, Clock, TrendingUp, ArrowRight, Activity } from 'lucide-react'

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const [
    totalUsers, seekers, posters, both,
    totalJobs, activeJobs, closedJobs,
    totalReferrals, pendingReferrals, referredCandidates,
    recentUsers, recentJobs, recentReferrals,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'SEEKER' } }),
    prisma.user.count({ where: { role: 'POSTER' } }),
    prisma.user.count({ where: { role: 'BOTH' } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: 'ACTIVE' } }),
    prisma.job.count({ where: { status: 'CLOSED' } }),
    prisma.referralRequest.count(),
    prisma.referralRequest.count({ where: { status: 'PENDING' } }),
    prisma.referralRequest.count({ where: { status: 'REFERRED' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
    }),
    prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, company: true, status: true, createdAt: true, workMode: true },
    }),
    prisma.referralRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        seeker: { select: { name: true, image: true } },
        job: { select: { title: true, company: true } },
      },
    }),
  ])

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? undefined}>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Admin Dashboard</h1>
          <p className="text-caption text-muted-slate">Platform overview and recent activity.</p>
        </div>

        {/* User stats */}
        <div>
          <p className="text-micro text-muted-slate uppercase tracking-widest mb-3">Users</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={totalUsers} icon={Users} accent />
            <StatCard label="Job Seekers" value={seekers} icon={TrendingUp} />
            <StatCard label="Referrers" value={posters} icon={CheckCircle} />
            <StatCard label="Both Roles" value={both} icon={Users} />
          </div>
        </div>

        {/* Job stats */}
        <div>
          <p className="text-micro text-muted-slate uppercase tracking-widest mb-3">Jobs</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Total Jobs" value={totalJobs} icon={Briefcase} accent />
            <StatCard label="Active Jobs" value={activeJobs} icon={CheckCircle} />
            <StatCard label="Closed Jobs" value={closedJobs} icon={Clock} />
          </div>
        </div>

        {/* Referral stats */}
        <div>
          <p className="text-micro text-muted-slate uppercase tracking-widest mb-3">Referrals</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="Total Requests" value={totalReferrals} icon={FileText} accent />
            <StatCard label="Pending" value={pendingReferrals} icon={Clock} />
            <StatCard label="Successful Referrals" value={referredCandidates} icon={CheckCircle} />
          </div>
        </div>

        {/* Recent activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent users */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-feature-heading font-medium text-near-black">Recent Users</h2>
              <Link href="/admin/users" className="text-micro text-muted-slate hover:text-ink flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar name={user.name} image={user.image} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-caption font-medium text-near-black truncate">{user.name}</p>
                    <p className="text-micro text-muted-slate truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={user.role} />
                    <span className="text-micro text-muted-slate">{formatRelativeTime(user.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-feature-heading font-medium text-near-black">Recent Jobs</h2>
              <Link href="/admin/jobs" className="text-micro text-muted-slate hover:text-ink flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-caption font-medium text-near-black truncate">{job.title}</p>
                    <p className="text-micro text-muted-slate">{job.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={job.status} />
                    <span className="text-micro text-muted-slate">{formatRelativeTime(job.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent referrals */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-feature-heading font-medium text-near-black">Recent Referrals</h2>
              <Link href="/admin/referrals" className="text-micro text-muted-slate hover:text-ink flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentReferrals.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={r.seeker.name} image={r.seeker.image} size="sm" />
                    <div className="min-w-0">
                      <p className="text-caption font-medium text-near-black truncate">{r.seeker.name}</p>
                      <p className="text-micro text-muted-slate truncate">{r.job.title} @ {r.job.company}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

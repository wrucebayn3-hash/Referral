import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/StatCard'
import { TrendingUp, Users, Briefcase, FileText, CheckCircle, Clock } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const [
    totalUsers, seekers, posters, both,
    totalJobs, activeJobs, closedJobs, draftJobs,
    totalReferrals, pendingReferrals, acceptedReferrals,
    rejectedReferrals, referredCandidates,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'SEEKER' } }),
    prisma.user.count({ where: { role: 'POSTER' } }),
    prisma.user.count({ where: { role: 'BOTH' } }),
    prisma.job.count(),
    prisma.job.count({ where: { status: 'ACTIVE' } }),
    prisma.job.count({ where: { status: 'CLOSED' } }),
    prisma.job.count({ where: { status: 'DRAFT' } }),
    prisma.referralRequest.count(),
    prisma.referralRequest.count({ where: { status: 'PENDING' } }),
    prisma.referralRequest.count({ where: { status: 'ACCEPTED' } }),
    prisma.referralRequest.count({ where: { status: 'REJECTED' } }),
    prisma.referralRequest.count({ where: { status: 'REFERRED' } }),
  ])

  const referralSuccessRate = totalReferrals > 0
    ? Math.round((referredCandidates / totalReferrals) * 100)
    : 0

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? undefined}>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Analytics</h1>
          <p className="text-caption text-muted-slate">Platform performance and insights.</p>
        </div>

        {/* User analytics */}
        <div>
          <p className="text-micro text-muted-slate uppercase tracking-widest mb-3">User Breakdown</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={totalUsers} icon={Users} accent />
            <StatCard label="Job Seekers" value={`${seekers} (${Math.round(seekers/totalUsers*100)}%)`} icon={TrendingUp} />
            <StatCard label="Referrers" value={`${posters} (${Math.round(posters/totalUsers*100)}%)`} icon={CheckCircle} />
            <StatCard label="Both Roles" value={`${both} (${Math.round(both/totalUsers*100)}%)`} icon={Users} />
          </div>
        </div>

        {/* Job analytics */}
        <div>
          <p className="text-micro text-muted-slate uppercase tracking-widest mb-3">Job Breakdown</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Jobs" value={totalJobs} icon={Briefcase} accent />
            <StatCard label="Active" value={activeJobs} icon={CheckCircle} />
            <StatCard label="Closed" value={closedJobs} icon={Clock} />
            <StatCard label="Draft" value={draftJobs} icon={FileText} />
          </div>
        </div>

        {/* Referral analytics */}
        <div>
          <p className="text-micro text-muted-slate uppercase tracking-widest mb-3">Referral Funnel</p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Total Requests" value={totalReferrals} icon={FileText} accent />
            <StatCard label="Pending" value={pendingReferrals} icon={Clock} />
            <StatCard label="Accepted" value={acceptedReferrals} icon={CheckCircle} />
            <StatCard label="Referred" value={referredCandidates} icon={TrendingUp} />
            <StatCard label="Rejected" value={rejectedReferrals} icon={Clock} />
          </div>
        </div>

        {/* Conversion */}
        <div className="card">
          <h2 className="font-display text-feature-heading font-medium text-near-black mb-6">Conversion Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-soft-stone rounded-sm">
              <p className="font-display text-section-heading font-normal text-near-black mb-1">{referralSuccessRate}%</p>
              <p className="text-caption text-muted-slate">Referral success rate</p>
            </div>
            <div className="text-center p-6 bg-soft-stone rounded-sm">
              <p className="font-display text-section-heading font-normal text-near-black mb-1">
                {totalJobs > 0 ? (totalReferrals / totalJobs).toFixed(1) : 0}
              </p>
              <p className="text-caption text-muted-slate">Avg. requests per job</p>
            </div>
            <div className="text-center p-6 bg-soft-stone rounded-sm">
              <p className="font-display text-section-heading font-normal text-near-black mb-1">
                {posters + both > 0 ? (totalJobs / (posters + both)).toFixed(1) : 0}
              </p>
              <p className="text-caption text-muted-slate">Avg. jobs per referrer</p>
            </div>
          </div>
        </div>

        {/* Referral funnel visualization */}
        <div className="card">
          <h2 className="font-display text-feature-heading font-medium text-near-black mb-6">Referral Funnel</h2>
          <div className="space-y-3">
            {[
              { label: 'Total Requests', value: totalReferrals, color: 'bg-near-black' },
              { label: 'Accepted', value: acceptedReferrals + referredCandidates, color: 'bg-action-blue' },
              { label: 'Successfully Referred', value: referredCandidates, color: 'bg-enterprise-green' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-caption text-ink">{label}</span>
                  <span className="text-caption font-medium text-near-black">{value}</span>
                </div>
                <div className="bg-hairline rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all`}
                    style={{ width: totalReferrals > 0 ? `${(value / totalReferrals) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

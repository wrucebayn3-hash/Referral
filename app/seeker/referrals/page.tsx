import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ReferralCard } from '@/components/referrals/ReferralCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FileText } from 'lucide-react'
import Link from 'next/link'

const STATUSES = ['ALL', 'PENDING', 'ACCEPTED', 'REFERRED', 'REJECTED', 'CLOSED']

export default async function SeekerReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { status } = await searchParams
  const filterStatus = status && status !== 'ALL' ? status : undefined

  const referrals = await prisma.referralRequest.findMany({
    where: {
      seekerId: session.user.id,
      ...(filterStatus ? { status: filterStatus } : {}),
    },
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
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <DashboardLayout role="seeker" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">My Referral Requests</h1>
          <p className="text-caption text-muted-slate">{referrals.length} request{referrals.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/seeker/referrals?status=${s}`}
              className={`px-3 py-1.5 rounded-xl text-caption border transition-colors ${
                (status || 'ALL') === s
                  ? 'bg-near-black text-white border-near-black'
                  : 'border-hairline text-ink hover:border-near-black/40'
              }`}
            >
              {s === 'ALL' ? 'All' : <StatusBadge status={s} />}
            </Link>
          ))}
        </div>

        {referrals.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No referral requests"
            description="Browse jobs and send your first referral request."
            action={<Link href="/jobs" className="btn-primary">Browse Jobs</Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {referrals.map((referral) => (
              <ReferralCard key={referral.id} referral={referral as any} viewAs="seeker" />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

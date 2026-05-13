import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ReferralCard } from '@/components/referrals/ReferralCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Inbox } from 'lucide-react'
import Link from 'next/link'

const STATUSES = ['ALL', 'PENDING', 'ACCEPTED', 'REFERRED', 'REJECTED', 'CLOSED']

export default async function PosterRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; jobId?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role === 'SEEKER') redirect('/seeker/dashboard')

  const { status, jobId } = await searchParams
  const filterStatus = status && status !== 'ALL' ? status : undefined

  const referrals = await prisma.referralRequest.findMany({
    where: {
      referrerId: session.user.id,
      ...(filterStatus ? { status: filterStatus } : {}),
      ...(jobId ? { jobId } : {}),
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
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout role="poster" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Referral Requests</h1>
          <p className="text-caption text-muted-slate">{referrals.length} request{referrals.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/poster/requests?status=${s}${jobId ? `&jobId=${jobId}` : ''}`}
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
            icon={Inbox}
            title="No referral requests"
            description="Post a job to start receiving referral requests from qualified candidates."
            action={<Link href="/poster/post-job" className="btn-primary">Post a Job</Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {referrals.map((referral) => (
              <ReferralCard key={referral.id} referral={referral as any} viewAs="referrer" />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { status, page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')
  const limit = 20

  const where: any = {}
  if (status) where.status = status

  const [referrals, total] = await Promise.all([
    prisma.referralRequest.findMany({
      where,
      include: {
        job: { select: { title: true, company: true } },
        seeker: { select: { id: true, name: true, email: true, image: true } },
        referrer: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.referralRequest.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)
  const STATUSES = ['', 'PENDING', 'ACCEPTED', 'REFERRED', 'REJECTED', 'CLOSED']

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? undefined}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Referral Requests</h1>
          <p className="text-caption text-muted-slate">{total} total requests</p>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/referrals?${s ? `status=${s}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-caption border transition-colors ${
                (status || '') === s ? 'bg-near-black text-white border-near-black' : 'border-hairline text-ink hover:border-near-black/40'
              }`}
            >
              {s || 'All'}
            </Link>
          ))}
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hairline bg-soft-stone">
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Seeker</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Referrer</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Job</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-soft-stone/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={r.seeker.name} image={r.seeker.image} size="sm" />
                        <div>
                          <p className="text-caption font-medium text-near-black">{r.seeker.name}</p>
                          <p className="text-micro text-muted-slate">{r.seeker.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={r.referrer.name} image={r.referrer.image} size="sm" />
                        <p className="text-caption text-muted-slate">{r.referrer.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-caption font-medium text-near-black">{r.job.title}</p>
                      <p className="text-micro text-muted-slate">{r.job.company}</p>
                    </td>
                    <td className="p-4"><StatusBadge status={r.status} /></td>
                    <td className="p-4 text-caption text-muted-slate">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {referrals.length === 0 && (
            <div className="py-12 text-center text-caption text-muted-slate">No referral requests found.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            {page > 1 && <Link href={`/admin/referrals?page=${page - 1}${status ? `&status=${status}` : ''}`} className="btn-secondary px-4 py-2 text-sm">Previous</Link>}
            <span className="text-caption text-muted-slate">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/admin/referrals?page=${page + 1}${status ? `&status=${status}` : ''}`} className="btn-secondary px-4 py-2 text-sm">Next</Link>}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

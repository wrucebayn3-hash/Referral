import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Search, MapPin, Users } from 'lucide-react'

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { q, status, page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')
  const limit = 20

  const where: any = {}
  if (status) where.status = status
  if (q) where.OR = [{ title: { contains: q } }, { company: { contains: q } }]

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        postedBy: { select: { id: true, name: true, image: true } },
        _count: { select: { referralRequests: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? undefined}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Job Management</h1>
          <p className="text-caption text-muted-slate">{total} jobs</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-slate" />
            <input className="input pl-10" placeholder="Search jobs..." defaultValue={q} />
          </div>
          <div className="flex gap-2">
            {['', 'ACTIVE', 'PAUSED', 'CLOSED', 'DRAFT'].map((s) => (
              <Link
                key={s}
                href={`/admin/jobs?${s ? `status=${s}` : ''}${q ? `&q=${q}` : ''}`}
                className={`px-3 py-2 rounded-sm border text-caption transition-colors ${
                  (status || '') === s ? 'bg-near-black text-white border-near-black' : 'border-hairline text-ink hover:border-near-black/40'
                }`}
              >
                {s || 'All'}
              </Link>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hairline bg-soft-stone">
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Job</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Posted By</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Type</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Requests</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Posted</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-soft-stone/50 transition-colors">
                    <td className="p-4">
                      <p className="text-caption font-medium text-near-black">{job.title}</p>
                      <div className="flex items-center gap-1 text-micro text-muted-slate mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {job.company} · {job.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={job.postedBy.name} image={job.postedBy.image} size="sm" />
                        <span className="text-caption text-muted-slate">{job.postedBy.name}</span>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge status={job.workMode} /></td>
                    <td className="p-4"><StatusBadge status={job.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-caption text-muted-slate">
                        <Users className="w-3.5 h-3.5" />
                        {job._count.referralRequests}
                      </div>
                    </td>
                    <td className="p-4 text-caption text-muted-slate">{formatDate(job.createdAt)}</td>
                    <td className="p-4">
                      <Link href={`/jobs/${job.id}`} className="text-micro text-action-blue hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {jobs.length === 0 && (
            <div className="py-12 text-center text-caption text-muted-slate">No jobs found.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            {page > 1 && <Link href={`/admin/jobs?page=${page - 1}${status ? `&status=${status}` : ''}`} className="btn-secondary px-4 py-2 text-sm">Previous</Link>}
            <span className="text-caption text-muted-slate">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/admin/jobs?page=${page + 1}${status ? `&status=${status}` : ''}`} className="btn-secondary px-4 py-2 text-sm">Next</Link>}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

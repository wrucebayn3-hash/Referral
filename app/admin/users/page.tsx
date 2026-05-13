import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Search, Users } from 'lucide-react'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { q, role, page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')
  const limit = 20

  const where: any = {}
  if (role) where.role = role
  if (q) where.OR = [{ name: { contains: q } }, { email: { contains: q } }]

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: { select: { currentRole: true, currentCompany: true, location: true, completionPct: true } },
        _count: { select: { postedJobs: true, referralsSent: true, referralsReceived: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? undefined}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-card-heading font-normal text-near-black mb-1">User Management</h1>
            <p className="text-caption text-muted-slate">{total} users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <form className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-slate" />
            <input
              name="q"
              defaultValue={q}
              className="input pl-10"
              placeholder="Search users..."
            />
          </form>
          <div className="flex gap-2">
            {['', 'SEEKER', 'POSTER', 'BOTH', 'ADMIN'].map((r) => (
              <Link
                key={r}
                href={`/admin/users?${r ? `role=${r}` : ''}${q ? `&q=${q}` : ''}`}
                className={`px-3 py-2 rounded-sm border text-caption transition-colors ${
                  (role || '') === r ? 'bg-near-black text-white border-near-black' : 'border-hairline text-ink hover:border-near-black/40'
                }`}
              >
                {r || 'All'}
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
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Role</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Location</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Activity</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Joined</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-soft-stone/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} image={user.image} size="sm" />
                        <div>
                          <p className="text-caption font-medium text-near-black">{user.name}</p>
                          <p className="text-micro text-muted-slate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge status={user.role} /></td>
                    <td className="p-4 text-caption text-muted-slate">{user.profile?.location || '—'}</td>
                    <td className="p-4">
                      <div className="text-micro text-muted-slate space-y-0.5">
                        <p>{user._count.postedJobs} jobs</p>
                        <p>{user._count.referralsSent} requests sent</p>
                        <p>{user._count.referralsReceived} requests received</p>
                      </div>
                    </td>
                    <td className="p-4 text-caption text-muted-slate">{formatDate(user.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${user.id}`} className="text-micro text-action-blue hover:underline">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="py-12 text-center text-caption text-muted-slate">No users found.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            {page > 1 && (
              <Link href={`/admin/users?page=${page - 1}${role ? `&role=${role}` : ''}${q ? `&q=${q}` : ''}`} className="btn-secondary px-4 py-2 text-sm">
                Previous
              </Link>
            )}
            <span className="text-caption text-muted-slate">Page {page} of {totalPages}</span>
            {page < totalPages && (
              <Link href={`/admin/users?page=${page + 1}${role ? `&role=${role}` : ''}${q ? `&q=${q}` : ''}`} className="btn-secondary px-4 py-2 text-sm">
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { Activity } from 'lucide-react'

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')
  const limit = 30

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activityLog.count(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? undefined}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Activity Logs</h1>
          <p className="text-caption text-muted-slate">{total} log entries</p>
        </div>

        {logs.length === 0 ? (
          <div className="card text-center py-16">
            <Activity className="w-8 h-8 text-muted-slate mx-auto mb-3" />
            <p className="text-caption text-muted-slate">No activity logs yet.</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hairline bg-soft-stone">
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Action</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Details</th>
                  <th className="text-left p-4 text-micro text-muted-slate uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-soft-stone/50 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono bg-soft-stone text-ink border border-hairline">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-caption text-muted-slate">
                      {log.user?.name || log.user?.email || 'System'}
                    </td>
                    <td className="p-4 text-caption text-muted-slate max-w-xs truncate">{log.details || '—'}</td>
                    <td className="p-4 text-caption text-muted-slate">{formatRelativeTime(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            {page > 1 && <a href={`/admin/activity?page=${page - 1}`} className="btn-secondary px-4 py-2 text-sm">Previous</a>}
            <span className="text-caption text-muted-slate">Page {page} of {totalPages}</span>
            {page < totalPages && <a href={`/admin/activity?page=${page + 1}`} className="btn-secondary px-4 py-2 text-sm">Next</a>}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

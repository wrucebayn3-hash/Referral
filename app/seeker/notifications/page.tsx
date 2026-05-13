import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatRelativeTime } from '@/lib/utils'
import { Bell, MessageSquare, Info, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  INFO: Info,
  REQUEST: Bell,
  STATUS: CheckCircle2,
  MESSAGE: MessageSquare,
  ADMIN: AlertCircle,
}

export default async function SeekerNotificationsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <DashboardLayout role="seeker" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Notifications</h1>
            <p className="text-caption text-muted-slate">{notifications.filter((n) => !n.read).length} unread</p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="You'll see updates about your referral requests here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = typeIcons[n.type] || Info
              return (
                <div
                  key={n.id}
                  className={cn(
                    'card flex items-start gap-3 p-4',
                    !n.read && 'border-l-4 border-l-coral bg-pale-blue/30'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0',
                    n.type === 'STATUS' ? 'bg-green-100' :
                    n.type === 'REQUEST' ? 'bg-blue-100' :
                    n.type === 'MESSAGE' ? 'bg-purple-100' :
                    'bg-soft-stone'
                  )}>
                    <Icon className="w-4 h-4 text-ink" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-caption font-medium text-near-black">{n.title}</p>
                    <p className="text-micro text-muted-slate mt-0.5">{n.body}</p>
                    {n.link && (
                      <Link href={n.link} className="text-micro text-action-blue hover:underline mt-1 block">
                        View details →
                      </Link>
                    )}
                  </div>
                  <span className="text-micro text-muted-slate flex-shrink-0">{formatRelativeTime(n.createdAt)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

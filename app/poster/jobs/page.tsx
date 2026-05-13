import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Briefcase, PlusCircle, MapPin, Users, Calendar } from 'lucide-react'

export default async function PosterJobsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role === 'SEEKER') redirect('/seeker/dashboard')

  const jobs = await prisma.job.findMany({
    where: { postedById: session.user.id },
    include: { _count: { select: { referralRequests: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout role="poster" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-card-heading font-normal text-near-black mb-1">My Jobs</h1>
            <p className="text-caption text-muted-slate">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
          </div>
          <Link href="/poster/post-job" className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs posted yet"
            description="Create your first job posting to start receiving referral requests from qualified candidates."
            action={<Link href="/poster/post-job" className="btn-primary">Post a Job</Link>}
          />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card hover:border-near-black/20 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-sm bg-soft-stone flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-medium text-sm text-near-black">{job.company.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-feature-heading font-display font-medium text-near-black">{job.title}</h3>
                      <p className="text-caption text-muted-slate">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={job.status} />
                    <StatusBadge status={job.workMode} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-micro text-muted-slate">
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</div>
                  <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job._count.referralRequests} requests</div>
                  <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Posted {formatRelativeTime(job.createdAt)}</div>
                  {job.deadline && (
                    <div className="flex items-center gap-1 text-coral">Deadline: {formatDate(job.deadline)}</div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-hairline flex items-center gap-3">
                  <Link href={`/jobs/${job.id}`} className="text-caption text-muted-slate hover:text-ink transition-colors">View public page</Link>
                  <span className="text-hairline">·</span>
                  <Link href={`/poster/jobs/${job.id}/edit`} className="text-caption text-action-blue hover:underline">Edit</Link>
                  <span className="text-hairline">·</span>
                  <Link href={`/poster/requests?jobId=${job.id}`} className="text-caption text-action-blue hover:underline">
                    View {job._count.referralRequests} requests
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

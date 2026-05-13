import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookmarkCheck } from 'lucide-react'
import Link from 'next/link'

export default async function SavedJobsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const saved = await prisma.savedJob.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        include: {
          postedBy: {
            select: {
              id: true, name: true, image: true,
              profile: { select: { currentRole: true, currentCompany: true } },
            },
          },
          _count: { select: { referralRequests: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout role="seeker" userName={session.user.name ?? undefined} userRole={session.user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Saved Jobs</h1>
          <p className="text-caption text-muted-slate">{saved.length} saved job{saved.length !== 1 ? 's' : ''}</p>
        </div>

        {saved.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title="No saved jobs yet"
            description="Browse jobs and save the ones you're interested in to review later."
            action={<Link href="/jobs" className="btn-primary">Browse Jobs</Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map(({ job }) => (
              <JobCard key={job.id} job={job as any} saved />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

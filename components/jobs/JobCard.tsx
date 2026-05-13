'use client'

import Link from 'next/link'
import { MapPin, Clock, Briefcase, Users, Bookmark } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime, parseJsonField } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    workMode: string
    jobType: string
    experienceLevel: string
    skills: string | null
    industry: string | null
    referralAvailable: boolean
    createdAt: Date | string
    postedBy: {
      name: string | null
      image: string | null
      profile?: { currentRole: string | null; currentCompany: string | null } | null
    }
    _count: { referralRequests: number }
  }
  saved?: boolean
  onSave?: (id: string) => void
  compact?: boolean
}

export function JobCard({ job, saved, onSave, compact }: JobCardProps) {
  const skills = parseJsonField(job.skills).slice(0, 3)

  return (
    <div className={cn('card hover:shadow-sm hover:border-near-black/20 transition-all group', compact && 'p-4')}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-sm bg-soft-stone flex items-center justify-center flex-shrink-0">
            <span className="font-display font-medium text-sm text-near-black">
              {job.company.charAt(0)}
            </span>
          </div>
          <div>
            <Link href={`/jobs/${job.id}`} className="group-hover:underline">
              <h3 className="text-feature-heading font-display font-medium text-near-black leading-tight">
                {job.title}
              </h3>
            </Link>
            <p className="text-caption text-muted-slate">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {job.referralAvailable && (
            <span className="text-micro px-2 py-0.5 rounded-full bg-pale-green text-green-700 border border-green-200">
              Referral Available
            </span>
          )}
          {onSave && (
            <button
              onClick={() => onSave(job.id)}
              className={cn(
                'p-1.5 rounded-sm transition-colors',
                saved ? 'text-coral' : 'text-muted-slate hover:text-ink'
              )}
            >
              <Bookmark className={cn('w-4 h-4', saved && 'fill-coral')} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 text-micro text-muted-slate">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </div>
        <div className="flex items-center gap-1 text-micro text-muted-slate">
          <Briefcase className="w-3.5 h-3.5" />
          <StatusBadge status={job.jobType} />
        </div>
        <div className="flex items-center gap-1 text-micro text-muted-slate">
          <Clock className="w-3.5 h-3.5" />
          <StatusBadge status={job.workMode} />
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.map((skill) => (
            <span key={skill} className="text-micro px-2 py-0.5 rounded-xs bg-soft-stone text-ink border border-hairline">
              {skill}
            </span>
          ))}
          {parseJsonField(job.skills).length > 3 && (
            <span className="text-micro px-2 py-0.5 rounded-xs bg-soft-stone text-muted-slate border border-hairline">
              +{parseJsonField(job.skills).length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-hairline">
        <div className="flex items-center gap-2">
          <Avatar name={job.postedBy.name} image={job.postedBy.image} size="sm" />
          <div>
            <p className="text-micro text-muted-slate">{job.postedBy.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-micro text-muted-slate">
            <Users className="w-3.5 h-3.5" />
            {job._count.referralRequests}
          </div>
          <span className="text-micro text-muted-slate">{formatRelativeTime(job.createdAt)}</span>
          <Link href={`/jobs/${job.id}`} className="btn-primary text-xs py-1.5 px-4">
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

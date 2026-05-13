import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatRelativeTime } from '@/lib/utils'
import { MapPin, Building2, ArrowRight } from 'lucide-react'

interface ReferralCardProps {
  referral: {
    id: string
    status: string
    message: string | null
    createdAt: Date | string
    updatedAt: Date | string
    job: {
      id: string
      title: string
      company: string
      location: string
      workMode: string
    }
    seeker: {
      id: string
      name: string | null
      email: string
      image: string | null
      profile?: { currentRole: string | null } | null
    }
    referrer: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
  }
  viewAs: 'seeker' | 'referrer' | 'admin'
  href?: string
}

export function ReferralCard({ referral, viewAs, href }: ReferralCardProps) {
  const targetUser = viewAs === 'seeker' ? referral.referrer : referral.seeker
  const link = href || (viewAs === 'seeker' ? `/seeker/referrals/${referral.id}` : `/poster/requests/${referral.id}`)

  return (
    <div className="card hover:border-near-black/20 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar name={targetUser.name} image={targetUser.image} size="md" />
          <div>
            <p className="text-caption font-medium text-near-black">{targetUser.name}</p>
            <p className="text-micro text-muted-slate">{targetUser.email}</p>
            {viewAs !== 'seeker' && referral.seeker.profile?.currentRole && (
              <p className="text-micro text-muted-slate">{referral.seeker.profile.currentRole}</p>
            )}
          </div>
        </div>
        <StatusBadge status={referral.status} />
      </div>

      <div className="mt-4 p-3 bg-soft-stone rounded-sm">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-muted-slate flex-shrink-0" />
          <p className="text-caption font-medium text-near-black">{referral.job.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-muted-slate flex-shrink-0" />
          <p className="text-micro text-muted-slate">{referral.job.company} · {referral.job.location}</p>
        </div>
      </div>

      {referral.message && (
        <p className="mt-3 text-caption text-ink line-clamp-2 italic">"{referral.message}"</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-micro text-muted-slate">
          {viewAs === 'seeker' ? 'Requested' : 'Received'} {formatRelativeTime(referral.createdAt)}
        </p>
        <Link href={link} className="flex items-center gap-1 text-caption text-near-black hover:underline">
          View details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

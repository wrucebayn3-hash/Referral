import { Badge } from './Badge'

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  REFERRED: 'Referred',
  CLOSED: 'Closed',
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  DRAFT: 'Draft',
  SEEKER: 'Job Seeker',
  POSTER: 'Referrer',
  BOTH: 'Both',
  ADMIN: 'Admin',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
  FULLTIME: 'Full-time',
  PARTTIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  ENTRY: 'Entry Level',
  MID: 'Mid Level',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  EXECUTIVE: 'Executive',
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge status={status} className={className}>
      {statusLabels[status] || status}
    </Badge>
  )
}

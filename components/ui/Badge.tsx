import { cn } from '@/lib/utils'

const statusClasses: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  REFERRED: 'bg-green-50 text-green-700 border-green-200',
  CLOSED: 'bg-gray-50 text-gray-600 border-gray-200',
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  PAUSED: 'bg-amber-50 text-amber-700 border-amber-200',
  DRAFT: 'bg-gray-50 text-gray-600 border-gray-200',
  SEEKER: 'bg-blue-50 text-blue-700 border-blue-200',
  POSTER: 'bg-purple-50 text-purple-700 border-purple-200',
  BOTH: 'bg-teal-50 text-teal-700 border-teal-200',
  ADMIN: 'bg-gray-900 text-white border-gray-800',
  REMOTE: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  HYBRID: 'bg-sky-50 text-sky-700 border-sky-200',
  ONSITE: 'bg-orange-50 text-orange-700 border-orange-200',
  FULLTIME: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PARTTIME: 'bg-violet-50 text-violet-700 border-violet-200',
  CONTRACT: 'bg-pink-50 text-pink-700 border-pink-200',
  INTERNSHIP: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

interface BadgeProps {
  status?: string
  className?: string
  children: React.ReactNode
}

export function Badge({ status, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        status ? statusClasses[status] || 'bg-gray-50 text-gray-600 border-gray-200' : '',
        className
      )}
    >
      {children}
    </span>
  )
}

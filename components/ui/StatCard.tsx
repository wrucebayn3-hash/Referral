import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { value: number; label: string }
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'card flex flex-col gap-3',
        accent && 'border-near-black',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-caption text-muted-slate uppercase tracking-wide">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-sm bg-soft-stone flex items-center justify-center">
            <Icon className="w-4 h-4 text-ink" />
          </div>
        )}
      </div>
      <p className="text-card-heading font-display font-medium text-near-black">{value}</p>
      {trend && (
        <p className={cn('text-micro', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </p>
      )}
    </div>
  )
}

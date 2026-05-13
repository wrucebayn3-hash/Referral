import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-lg bg-soft-stone flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-muted-slate" />
        </div>
      )}
      <h3 className="text-feature-heading font-display text-near-black mb-2">{title}</h3>
      {description && <p className="text-body text-muted-slate max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}

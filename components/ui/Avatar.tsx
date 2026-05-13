import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AvatarProps {
  name?: string | null
  image?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function Avatar({ name, image, size = 'md', className }: AvatarProps) {
  const initials = name ? getInitials(name) : '?'
  const sizeClass = sizeClasses[size]

  if (image) {
    return (
      <img
        src={image}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover', sizeClass, className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-near-black text-white flex items-center justify-center font-medium font-display',
        sizeClass,
        className
      )}
    >
      {initials}
    </div>
  )
}

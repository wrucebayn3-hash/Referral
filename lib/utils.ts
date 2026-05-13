import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return formatDate(date)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    ACCEPTED: 'bg-blue-100 text-blue-800 border-blue-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    REFERRED: 'bg-green-100 text-green-800 border-green-200',
    CLOSED: 'bg-gray-100 text-gray-600 border-gray-200',
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    PAUSED: 'bg-amber-100 text-amber-800 border-amber-200',
    DRAFT: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  return map[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

export function parseJsonField(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

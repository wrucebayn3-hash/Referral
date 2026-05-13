import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Shield, Database, Bell } from 'lucide-react'

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  return (
    <DashboardLayout role="admin" userName={session.user.name ?? undefined}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-card-heading font-normal text-near-black mb-1">Settings</h1>
          <p className="text-caption text-muted-slate">Platform configuration and administration.</p>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-muted-slate" />
            <h2 className="font-display text-feature-heading font-medium text-near-black">Security</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Role-based access control', status: 'Enabled', color: 'text-green-600' },
              { label: 'JWT session tokens', status: 'Active', color: 'text-green-600' },
              { label: 'Password hashing (bcrypt)', status: 'Enabled', color: 'text-green-600' },
              { label: 'Admin route protection', status: 'Active', color: 'text-green-600' },
            ].map(({ label, status, color }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-soft-stone rounded-sm">
                <span className="text-caption text-ink">{label}</span>
                <span className={`text-micro font-medium ${color}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-muted-slate" />
            <h2 className="font-display text-feature-heading font-medium text-near-black">Database</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Database provider', value: 'SQLite (libsql)' },
              { label: 'ORM', value: 'Prisma 7' },
              { label: 'Adapter', value: '@prisma/adapter-libsql' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-soft-stone rounded-sm">
                <span className="text-caption text-ink">{label}</span>
                <span className="text-micro text-muted-slate font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-muted-slate" />
            <h2 className="font-display text-feature-heading font-medium text-near-black">Platform Info</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Framework', value: 'Next.js 16 (App Router)' },
              { label: 'Auth', value: 'NextAuth v5 beta' },
              { label: 'Styling', value: 'Tailwind CSS' },
              { label: 'Language', value: 'TypeScript' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-soft-stone rounded-sm">
                <span className="text-caption text-ink">{label}</span>
                <span className="text-micro text-muted-slate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

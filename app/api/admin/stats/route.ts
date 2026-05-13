import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [
      totalUsers,
      seekers,
      posters,
      both,
      totalJobs,
      activeJobs,
      closedJobs,
      totalReferrals,
      pendingReferrals,
      referredCandidates,
      recentUsers,
      recentJobs,
      recentReferrals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SEEKER' } }),
      prisma.user.count({ where: { role: 'POSTER' } }),
      prisma.user.count({ where: { role: 'BOTH' } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.job.count({ where: { status: 'CLOSED' } }),
      prisma.referralRequest.count(),
      prisma.referralRequest.count({ where: { status: 'PENDING' } }),
      prisma.referralRequest.count({ where: { status: 'REFERRED' } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, company: true, status: true, createdAt: true },
      }),
      prisma.referralRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          seeker: { select: { name: true } },
          job: { select: { title: true, company: true } },
        },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      seekers,
      posters,
      both,
      totalJobs,
      activeJobs,
      closedJobs,
      totalReferrals,
      pendingReferrals,
      referredCandidates,
      recentUsers,
      recentJobs,
      recentReferrals,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

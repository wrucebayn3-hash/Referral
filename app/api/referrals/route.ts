import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role') // 'seeker' | 'referrer'
    const status = searchParams.get('status')

    const where: any = {}
    if (role === 'seeker') where.seekerId = session.user.id
    else if (role === 'referrer') where.referrerId = session.user.id
    else if (session.user.role !== 'ADMIN') {
      where.OR = [{ seekerId: session.user.id }, { referrerId: session.user.id }]
    }
    if (status) where.status = status

    const referrals = await prisma.referralRequest.findMany({
      where,
      include: {
        job: { select: { id: true, title: true, company: true, location: true, workMode: true } },
        seeker: {
          select: {
            id: true, name: true, email: true, image: true,
            profile: { select: { currentRole: true, skills: true, resumeUrl: true } },
          },
        },
        referrer: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ referrals })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { jobId, referrerId, message, resumeUrl } = body

    if (!jobId || !referrerId) {
      return NextResponse.json({ error: 'jobId and referrerId are required' }, { status: 400 })
    }

    const existing = await prisma.referralRequest.findFirst({
      where: { jobId, seekerId: session.user.id },
    })
    if (existing) {
      return NextResponse.json({ error: 'You already requested a referral for this job' }, { status: 400 })
    }

    const referral = await prisma.referralRequest.create({
      data: {
        jobId,
        seekerId: session.user.id,
        referrerId,
        message,
        resumeUrl,
        status: 'PENDING',
      },
    })

    // Create notification for referrer
    await prisma.notification.create({
      data: {
        userId: referrerId,
        title: 'New Referral Request',
        body: `${session.user.name} has requested a referral`,
        type: 'REQUEST',
        link: `/poster/requests/${referral.id}`,
      },
    })

    return NextResponse.json({ referral }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

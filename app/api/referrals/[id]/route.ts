import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const referral = await prisma.referralRequest.findUnique({
      where: { id },
      include: {
        job: true,
        seeker: {
          select: {
            id: true, name: true, email: true, image: true,
            profile: true,
          },
        },
        referrer: {
          select: { id: true, name: true, email: true, image: true, profile: true },
        },
        messages: {
          include: { sender: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!referral) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const canAccess =
      session.user.role === 'ADMIN' ||
      referral.seekerId === session.user.id ||
      referral.referrerId === session.user.id

    if (!canAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    return NextResponse.json({ referral })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const referral = await prisma.referralRequest.findUnique({ where: { id } })
    if (!referral) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isAdmin = session.user.role === 'ADMIN'
    const isReferrer = referral.referrerId === session.user.id
    const isSeeker = referral.seekerId === session.user.id

    if (!isAdmin && !isReferrer && !isSeeker) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.referralRequest.update({
      where: { id },
      data: body,
    })

    // Send notification when status changes
    if (body.status && body.status !== referral.status) {
      const statusMessages: Record<string, string> = {
        ACCEPTED: 'Your referral request has been accepted!',
        REJECTED: 'Your referral request was not accepted.',
        REFERRED: 'You have been referred! Great news!',
        CLOSED: 'This referral request has been closed.',
      }
      if (statusMessages[body.status]) {
        await prisma.notification.create({
          data: {
            userId: referral.seekerId,
            title: `Request ${body.status}`,
            body: statusMessages[body.status],
            type: 'STATUS',
            link: `/seeker/referrals/${id}`,
          },
        })
      }
    }

    return NextResponse.json({ referral: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

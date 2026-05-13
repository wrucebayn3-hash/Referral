import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { content } = await req.json()

    const referral = await prisma.referralRequest.findUnique({ where: { id } })
    if (!referral) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const canMessage =
      referral.seekerId === session.user.id || referral.referrerId === session.user.id
    if (!canMessage) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const message = await prisma.message.create({
      data: { content, senderId: session.user.id, requestId: id },
      include: { sender: { select: { id: true, name: true, image: true } } },
    })

    const recipientId =
      session.user.id === referral.seekerId ? referral.referrerId : referral.seekerId

    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: 'New Message',
        body: `${session.user.name}: ${content.slice(0, 60)}`,
        type: 'MESSAGE',
        link: `/seeker/referrals/${id}`,
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

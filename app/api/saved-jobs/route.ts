import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const saved = await prisma.savedJob.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          include: {
            postedBy: {
              select: {
                id: true, name: true, image: true,
                profile: { select: { currentRole: true, currentCompany: true } },
              },
            },
            _count: { select: { referralRequests: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ saved })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { jobId } = await req.json()

    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId: session.user.id, jobId } },
    })

    if (existing) {
      await prisma.savedJob.delete({
        where: { userId_jobId: { userId: session.user.id, jobId } },
      })
      return NextResponse.json({ saved: false })
    }

    await prisma.savedJob.create({
      data: { userId: session.user.id, jobId },
    })

    return NextResponse.json({ saved: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

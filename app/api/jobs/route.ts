import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const industry = searchParams.get('industry') || ''
    const workMode = searchParams.get('workMode') || ''
    const jobType = searchParams.get('jobType') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const location = searchParams.get('location') || ''
    const referralAvailable = searchParams.get('referralAvailable')
    const status = searchParams.get('status') || 'ACTIVE'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = { status }
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { company: { contains: query } },
        { description: { contains: query } },
      ]
    }
    if (industry) where.industry = industry
    if (workMode) where.workMode = workMode
    if (jobType) where.jobType = jobType
    if (experienceLevel) where.experienceLevel = experienceLevel
    if (location) where.location = { contains: location }
    if (referralAvailable !== null) where.referralAvailable = referralAvailable === 'true'

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          postedBy: {
            select: {
              id: true,
              name: true,
              image: true,
              profile: { select: { currentRole: true, currentCompany: true } },
            },
          },
          _count: { select: { referralRequests: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({ jobs, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const job = await prisma.job.create({
      data: {
        ...body,
        postedById: session.user.id,
        skills: body.skills ? JSON.stringify(body.skills) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
      },
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

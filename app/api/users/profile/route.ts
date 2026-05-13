import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { name, ...profileData } = body

    const updateData: any = {}
    if (profileData.skills) profileData.skills = JSON.stringify(profileData.skills)
    if (profileData.experience) profileData.experience = JSON.stringify(profileData.experience)
    if (profileData.education) profileData.education = JSON.stringify(profileData.education)
    if (profileData.preferredRoles) profileData.preferredRoles = JSON.stringify(profileData.preferredRoles)

    const fields = ['bio', 'phone', 'location', 'linkedinUrl', 'portfolioUrl', 'resumeUrl',
      'profileImage', 'currentCompany', 'currentRole', 'skills', 'experience',
      'education', 'preferredRoles']
    for (const f of fields) {
      if (profileData[f] !== undefined) updateData[f] = profileData[f]
    }

    const filledFields = Object.values(updateData).filter(Boolean).length
    const completionPct = Math.min(100, 20 + filledFields * 7)
    updateData.completionPct = completionPct

    const [user] = await Promise.all([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(name ? { name } : {}),
          profile: {
            upsert: {
              create: updateData,
              update: updateData,
            },
          },
        },
        include: { profile: true },
      }),
    ])

    return NextResponse.json({ user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

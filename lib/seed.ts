import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import path from 'path'

// Use DATABASE_URL if set, otherwise fall back to local dev.db
const url = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'prisma/dev.db')}`
const authToken = process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql({ url, authToken })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wasta.io' },
    update: {},
    create: {
      email: 'admin@wasta.io',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        create: {
          bio: 'Platform administrator',
          location: 'San Francisco, CA',
          completionPct: 100,
        },
      },
    },
  })

  // Job Seeker
  const seeker = await prisma.user.upsert({
    where: { email: 'seeker@wasta.io' },
    update: {},
    create: {
      email: 'seeker@wasta.io',
      name: 'Alex Johnson',
      password: hashedPassword,
      role: 'SEEKER',
      profile: {
        create: {
          bio: 'Frontend developer with 3 years of experience looking for new opportunities.',
          location: 'New York, NY',
          currentRole: 'Frontend Developer',
          currentCompany: 'TechCorp',
          skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'CSS', 'GraphQL']),
          linkedinUrl: 'https://linkedin.com/in/alexjohnson',
          completionPct: 80,
        },
      },
    },
  })

  // Job Poster
  const poster = await prisma.user.upsert({
    where: { email: 'poster@wasta.io' },
    update: {},
    create: {
      email: 'poster@wasta.io',
      name: 'Sarah Chen',
      password: hashedPassword,
      role: 'POSTER',
      profile: {
        create: {
          bio: 'Senior Engineer at Stripe, happy to refer strong candidates.',
          location: 'San Francisco, CA',
          currentRole: 'Senior Software Engineer',
          currentCompany: 'Stripe',
          skills: JSON.stringify(['Python', 'Go', 'Kubernetes', 'AWS', 'PostgreSQL']),
          linkedinUrl: 'https://linkedin.com/in/sarahchen',
          completionPct: 90,
        },
      },
    },
  })

  // Both
  const both = await prisma.user.upsert({
    where: { email: 'both@wasta.io' },
    update: {},
    create: {
      email: 'both@wasta.io',
      name: 'Marcus Williams',
      password: hashedPassword,
      role: 'BOTH',
      profile: {
        create: {
          bio: 'Engineering manager at Notion, also exploring senior IC roles.',
          location: 'Austin, TX',
          currentRole: 'Engineering Manager',
          currentCompany: 'Notion',
          skills: JSON.stringify(['React', 'System Design', 'Leadership', 'TypeScript', 'AWS']),
          linkedinUrl: 'https://linkedin.com/in/marcuswilliams',
          completionPct: 95,
        },
      },
    },
  })

  // Jobs
  const jobs = [
    {
      title: 'Senior Frontend Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      workMode: 'HYBRID',
      jobType: 'FULLTIME',
      experienceLevel: 'SENIOR',
      description: 'We are looking for a Senior Frontend Engineer to join our Payments team. You will build and maintain world-class payment interfaces used by millions of businesses.',
      requirements: 'React expertise, 5+ years experience, strong TypeScript skills',
      skills: JSON.stringify(['React', 'TypeScript', 'Next.js', 'CSS', 'GraphQL']),
      industry: 'Fintech',
      referralAvailable: true,
      postedById: poster.id,
    },
    {
      title: 'Product Manager',
      company: 'Notion',
      location: 'New York, NY',
      workMode: 'REMOTE',
      jobType: 'FULLTIME',
      experienceLevel: 'MID',
      description: 'Join our product team to shape the future of collaborative productivity. You will work closely with design and engineering to define and ship features.',
      requirements: '3+ years PM experience, strong analytical skills, excellent communication',
      skills: JSON.stringify(['Product Strategy', 'Data Analysis', 'User Research', 'Roadmapping']),
      industry: 'SaaS',
      referralAvailable: true,
      postedById: both.id,
    },
    {
      title: 'Backend Engineer - Go',
      company: 'Vercel',
      location: 'Remote',
      workMode: 'REMOTE',
      jobType: 'FULLTIME',
      experienceLevel: 'SENIOR',
      description: 'Build the infrastructure that powers millions of deployments. Join our platform team working on our core deployment pipeline.',
      requirements: 'Go expertise, distributed systems experience, cloud infrastructure',
      skills: JSON.stringify(['Go', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis']),
      industry: 'Developer Tools',
      referralAvailable: true,
      postedById: poster.id,
    },
    {
      title: 'Data Scientist',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      workMode: 'HYBRID',
      jobType: 'FULLTIME',
      experienceLevel: 'MID',
      description: 'Use data to improve the host and guest experience. You will partner with product teams to design experiments and build ML models.',
      requirements: 'Python, SQL, statistics background, ML experience',
      skills: JSON.stringify(['Python', 'SQL', 'Machine Learning', 'Statistics', 'Spark']),
      industry: 'Travel & Hospitality',
      referralAvailable: true,
      postedById: both.id,
    },
    {
      title: 'UX Designer',
      company: 'Linear',
      location: 'Remote',
      workMode: 'REMOTE',
      jobType: 'FULLTIME',
      experienceLevel: 'MID',
      description: 'Design the future of project management tools. We care deeply about craft and want someone who obsesses over interaction details.',
      requirements: 'Strong portfolio, Figma expertise, systems thinking',
      skills: JSON.stringify(['Figma', 'Prototyping', 'User Research', 'Design Systems']),
      industry: 'Developer Tools',
      referralAvailable: true,
      postedById: poster.id,
    },
    {
      title: 'DevOps Engineer',
      company: 'HashiCorp',
      location: 'Austin, TX',
      workMode: 'HYBRID',
      jobType: 'FULLTIME',
      experienceLevel: 'SENIOR',
      description: 'Build and maintain CI/CD pipelines and cloud infrastructure. Help us scale our platform to serve enterprise customers.',
      requirements: 'Terraform, Kubernetes, CI/CD experience, cloud certifications a plus',
      skills: JSON.stringify(['Terraform', 'Kubernetes', 'AWS', 'CI/CD', 'Linux']),
      industry: 'Developer Tools',
      referralAvailable: true,
      postedById: both.id,
    },
    {
      title: 'iOS Engineer',
      company: 'Figma',
      location: 'San Francisco, CA',
      workMode: 'ONSITE',
      jobType: 'FULLTIME',
      experienceLevel: 'MID',
      description: 'Build Figma\'s mobile experience. You\'ll work on our iOS app used by designers worldwide.',
      requirements: 'Swift expertise, UIKit and SwiftUI experience',
      skills: JSON.stringify(['Swift', 'SwiftUI', 'UIKit', 'Xcode', 'CoreData']),
      industry: 'Design Tools',
      referralAvailable: false,
      postedById: poster.id,
    },
    {
      title: 'Sales Engineer',
      company: 'Datadog',
      location: 'New York, NY',
      workMode: 'HYBRID',
      jobType: 'FULLTIME',
      experienceLevel: 'MID',
      description: 'Partner with our sales team to win enterprise accounts. Provide technical expertise during the sales cycle.',
      requirements: 'Technical background, excellent communication, cloud monitoring knowledge',
      skills: JSON.stringify(['Cloud Monitoring', 'Sales', 'Technical Presentations', 'Python']),
      industry: 'Cloud Infrastructure',
      referralAvailable: true,
      postedById: both.id,
    },
  ]

  for (const job of jobs) {
    await prisma.job.create({ data: job as any })
  }

  // Referral request
  const job1 = await prisma.job.findFirst({ where: { title: 'Senior Frontend Engineer' } })
  if (job1) {
    await prisma.referralRequest.create({
      data: {
        jobId: job1.id,
        seekerId: seeker.id,
        referrerId: poster.id,
        status: 'PENDING',
        message: 'Hi Sarah, I have been following your work at Stripe and I am very interested in this role. I have 3+ years of React experience and have shipped several production TypeScript projects. Would love your referral!',
      },
    })
  }

  console.log('Seed complete!')
  console.log('Demo accounts:')
  console.log('  Admin:  admin@wasta.io / password123')
  console.log('  Seeker: seeker@wasta.io / password123')
  console.log('  Poster: poster@wasta.io / password123')
  console.log('  Both:   both@wasta.io   / password123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

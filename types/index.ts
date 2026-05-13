export type UserRole = 'SEEKER' | 'POSTER' | 'BOTH' | 'ADMIN'
export type JobStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'DRAFT'
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE'
export type JobType = 'FULLTIME' | 'PARTTIME' | 'CONTRACT' | 'INTERNSHIP'
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE'
export type ReferralStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REFERRED' | 'CLOSED'
export type NotificationType = 'INFO' | 'REQUEST' | 'STATUS' | 'MESSAGE' | 'ADMIN'

export interface JobWithRelations {
  id: string
  title: string
  company: string
  location: string
  workMode: WorkMode
  jobType: JobType
  experienceLevel: ExperienceLevel
  description: string
  requirements: string | null
  skills: string | null
  industry: string | null
  deadline: Date | null
  status: JobStatus
  referralAvailable: boolean
  postedById: string
  postedBy: {
    id: string
    name: string | null
    image: string | null
    profile: { currentRole: string | null; currentCompany: string | null } | null
  }
  _count: { referralRequests: number }
  createdAt: Date
  updatedAt: Date
}

export interface ReferralWithRelations {
  id: string
  status: ReferralStatus
  message: string | null
  resumeUrl: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  job: {
    id: string
    title: string
    company: string
    location: string
    workMode: WorkMode
  }
  seeker: {
    id: string
    name: string | null
    email: string
    image: string | null
    profile: { currentRole: string | null; skills: string | null } | null
  }
  referrer: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export interface NavItem {
  label: string
  href: string
  icon?: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }
}

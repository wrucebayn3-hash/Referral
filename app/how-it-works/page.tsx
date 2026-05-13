import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { ArrowRight, Search, Send, Bell, CheckCircle2, PlusCircle, Eye, UserCheck } from 'lucide-react'

const seekerSteps = [
  { icon: Search, step: '01', title: 'Create your profile', description: 'Add your experience, skills, education, and the type of roles you\'re targeting. Upload your resume and LinkedIn profile.' },
  { icon: Search, step: '02', title: 'Browse jobs', description: 'Search and filter thousands of job openings by company, location, work mode, industry, and more.' },
  { icon: Send, step: '03', title: 'Request a referral', description: 'Click "Request Referral" on any job with referral availability. Write a short personal message and attach your resume.' },
  { icon: Bell, step: '04', title: 'Track your status', description: 'Follow your request from Pending → Accepted → Referred in real-time from your dashboard.' },
]

const referrerSteps = [
  { icon: PlusCircle, step: '01', title: 'Post a job', description: 'Add a job opening at your company with full details: title, description, requirements, skills, and referral availability.' },
  { icon: Eye, step: '02', title: 'Review candidates', description: 'Browse incoming referral requests. View full candidate profiles, resumes, and their personalized message to you.' },
  { icon: UserCheck, step: '03', title: 'Accept or decline', description: 'Accept candidates who are a strong fit. For accepted candidates, you can message them and coordinate next steps.' },
  { icon: CheckCircle2, step: '04', title: 'Mark as referred', description: 'Once you\'ve submitted the referral internally, mark them as "Referred." The candidate gets notified immediately.' },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-canvas-white">
      <Navbar />
      <div className="pt-24">
        <section className="py-24 text-center">
          <div className="section-container max-w-3xl">
            <p className="text-micro text-coral uppercase tracking-widest font-medium mb-4">How Wasta Works</p>
            <h1 className="font-display text-section-display font-normal text-near-black leading-tight mb-6">
              Simple for seekers. Simple for referrers.
            </h1>
            <p className="text-body-large text-muted-slate max-w-xl mx-auto">
              Wasta removes the friction from job referrals for both sides of the equation.
            </p>
          </div>
        </section>

        {/* For Job Seekers */}
        <section className="py-24 bg-soft-stone">
          <div className="section-container">
            <div className="max-w-xl mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-near-black text-white text-micro mb-4">For Job Seekers</span>
              <h2 className="font-display text-section-heading font-normal text-near-black">From profile to referral in 4 steps</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {seekerSteps.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.step}>
                    <p className="font-display text-5xl text-hairline font-medium mb-3">{s.step}</p>
                    <div className="w-8 h-8 rounded-xs bg-near-black flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-feature-heading font-display font-medium text-near-black mb-2">{s.title}</h3>
                    <p className="text-caption text-muted-slate leading-relaxed">{s.description}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-10">
              <Link href="/signup?role=SEEKER" className="btn-primary">
                Start as a Job Seeker <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* For Referrers */}
        <section className="py-24">
          <div className="section-container">
            <div className="max-w-xl mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-near-black text-near-black text-micro mb-4">For Referrers</span>
              <h2 className="font-display text-section-heading font-normal text-near-black">Post, review, and refer great candidates</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {referrerSteps.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.step}>
                    <p className="font-display text-5xl text-hairline font-medium mb-3">{s.step}</p>
                    <div className="w-8 h-8 rounded-xs bg-coral flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-feature-heading font-display font-medium text-near-black mb-2">{s.title}</h3>
                    <p className="text-caption text-muted-slate leading-relaxed">{s.description}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-10">
              <Link href="/signup?role=POSTER" className="btn-primary">
                Start as a Referrer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-soft-stone">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-section-heading font-normal text-near-black mb-12">Common questions</h2>
            <div className="space-y-6">
              {[
                { q: 'Is Wasta free?', a: 'Yes, Wasta is completely free for job seekers. Referrers can post jobs and manage requests at no cost.' },
                { q: 'Who can be a referrer?', a: 'Anyone who works at a company and is willing to refer candidates. This includes employees, hiring managers, and recruiters.' },
                { q: 'How long does a referral take?', a: 'Most referrers respond within 48 hours. Once accepted, the referral is typically submitted within a week.' },
                { q: 'Can I be both a job seeker and a referrer?', a: 'Yes! Select "Both" during signup. You can switch between modes from your dashboard at any time.' },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-hairline pb-6">
                  <h3 className="text-feature-heading font-display font-medium text-near-black mb-2">{q}</h3>
                  <p className="text-body text-muted-slate leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { ArrowRight, CheckCircle, Users, Briefcase, Star, TrendingUp, Shield, Zap } from 'lucide-react'

const stats = [
  { value: '12,000+', label: 'Job Seekers' },
  { value: '3,500+', label: 'Referrers' },
  { value: '8,200+', label: 'Jobs Posted' },
  { value: '94%', label: 'Success Rate' },
]

const features = [
  {
    icon: Users,
    title: 'Direct Referral Access',
    description: 'Connect directly with employees at your target companies who are willing to refer qualified candidates.',
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'Every referrer profile is verified. Know exactly who you\'re getting a referral from before you ask.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Follow your referral requests from submission to outcome with full status transparency.',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    description: 'Request a referral in under 2 minutes. No complicated processes or hidden steps.',
  },
]

const steps = [
  { number: '01', title: 'Create your profile', description: 'Add your experience, skills, and the roles you\'re targeting.' },
  { number: '02', title: 'Browse job openings', description: 'Find opportunities at companies where referrals are available.' },
  { number: '03', title: 'Request a referral', description: 'Send a personalized message to the referrer with your resume.' },
  { number: '04', title: 'Get referred', description: 'The referrer reviews your profile and submits your application internally.' },
]

const companies = ['Stripe', 'Notion', 'Vercel', 'Airbnb', 'Linear', 'Figma', 'Datadog', 'HashiCorp']

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-hairline text-caption text-muted-slate mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Referrals that actually work
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-normal text-near-black leading-[1] tracking-tight mb-8 text-balance">
            Get referred to your <span className="text-coral">dream job</span>
          </h1>
          <p className="text-body-large text-muted-slate max-w-2xl mx-auto mb-10 leading-relaxed">
            Wasta connects job seekers with employees who are willing to refer them.
            Referrals are 4× more likely to get interviews. Stop cold-applying.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-base px-8 py-4">
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/jobs" className="btn-secondary text-base px-8 py-4">
              Browse jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-hairline">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-normal text-near-black mb-1">{stat.value}</p>
                <p className="text-caption text-muted-slate">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="py-16">
        <div className="section-container text-center">
          <p className="text-caption text-muted-slate uppercase tracking-widest mb-8">Jobs at leading companies</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {companies.map((company) => (
              <span key={company} className="font-display text-lg text-muted-slate font-medium hover:text-ink transition-colors cursor-default">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-soft-stone">
        <div className="section-container">
          <div className="max-w-xl mb-16">
            <p className="text-micro text-coral uppercase tracking-widest font-medium mb-3">How it works</p>
            <h2 className="font-display text-5xl font-normal text-near-black leading-tight">
              Four steps to your next role
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number}>
                <p className="font-display text-5xl text-hairline font-medium mb-4">{step.number}</p>
                <h3 className="text-feature-heading font-display font-medium text-near-black mb-2">{step.title}</h3>
                <p className="text-caption text-muted-slate leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-micro text-coral uppercase tracking-widest font-medium mb-3">Why Wasta</p>
            <h2 className="font-display text-5xl font-normal text-near-black leading-tight">
              Built for the way referrals actually work
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="card">
                  <div className="w-10 h-10 rounded-sm bg-soft-stone flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-near-black" />
                  </div>
                  <h3 className="text-feature-heading font-display font-medium text-near-black mb-2">{feature.title}</h3>
                  <p className="text-caption text-muted-slate leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* For referrers */}
      <section className="py-24 dark-band">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-micro text-soft-coral uppercase tracking-widest font-medium mb-4">For Referrers</p>
              <h2 className="font-display text-5xl font-normal text-white leading-tight mb-6">
                Help great people find great jobs
              </h2>
              <p className="text-body-large text-white/70 mb-8 leading-relaxed">
                Post jobs at your company. Review candidate profiles. Refer the best ones.
                Build your reputation as a trusted connector in your industry.
              </p>
              <div className="space-y-3 mb-8">
                {['Post jobs in under 5 minutes', 'Review full candidate profiles', 'Manage all requests in one place', 'Build your professional reputation'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-soft-coral flex-shrink-0" />
                    <span className="text-body text-white/80">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup?role=POSTER" className="inline-flex items-center gap-2 px-8 py-4 rounded-pill bg-white text-near-black text-btn font-medium hover:bg-soft-stone transition-colors">
                Start referring <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Requests Managed', value: '24,000+' },
                { label: 'Successful Referrals', value: '8,200+' },
                { label: 'Active Referrers', value: '3,500+' },
                { label: 'Avg. Response Time', value: '< 48h' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <p className="font-display text-3xl font-normal text-white mb-1">{stat.value}</p>
                  <p className="text-caption text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-container text-center">
          <h2 className="font-display text-6xl font-normal text-near-black leading-tight mb-6 max-w-2xl mx-auto">
            Ready to find your next opportunity?
          </h2>
          <p className="text-body-large text-muted-slate mb-10 max-w-lg mx-auto">
            Join thousands of job seekers who found their roles through Wasta referrals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-base px-8 py-4">
              Create free account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/how-it-works" className="btn-ghost text-base">
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-near-black text-white py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-white rounded-xs flex items-center justify-center">
                  <span className="text-near-black font-display font-medium text-xs">W</span>
                </div>
                <span className="font-display text-white">Wasta</span>
              </div>
              <p className="text-micro text-white/50 leading-relaxed">Referral-based job platform connecting seekers with referrers.</p>
            </div>
            <div>
              <p className="text-caption font-medium text-white mb-3">Platform</p>
              <ul className="space-y-2">
                {['Browse Jobs', 'How it Works', 'Post a Job'].map((item) => (
                  <li key={item}><Link href="#" className="text-micro text-white/50 hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-caption font-medium text-white mb-3">Company</p>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers'].map((item) => (
                  <li key={item}><Link href="#" className="text-micro text-white/50 hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-caption font-medium text-white mb-3">Legal</p>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}><Link href="#" className="text-micro text-white/50 hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-micro text-white/30">© 2025 Wasta. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

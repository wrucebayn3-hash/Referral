import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { ArrowRight, Heart, Globe, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas-white">
      <Navbar />
      <div className="pt-24">
        {/* Hero */}
        <section className="py-24 text-center">
          <div className="section-container max-w-4xl">
            <p className="text-micro text-coral uppercase tracking-widest font-medium mb-4">About Wasta</p>
            <h1 className="font-display text-section-display font-normal text-near-black leading-tight mb-6 text-balance">
              Referrals are the best way to get hired
            </h1>
            <p className="text-body-large text-muted-slate max-w-2xl mx-auto leading-relaxed">
              Wasta was built on a simple insight: referred candidates are 4× more likely to get interviews
              and 2× more likely to get hired. We built the infrastructure to make that happen at scale.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-soft-stone">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-section-heading font-normal text-near-black mb-8">Our mission</h2>
            <p className="text-body-large text-ink mb-6 leading-relaxed">
              We believe that your next career move shouldn't depend on who you happen to know already.
              Wasta democratizes access to referrals by creating a transparent marketplace where job
              seekers can connect directly with employees at their target companies.
            </p>
            <p className="text-body text-muted-slate leading-relaxed">
              For referrers, we make it easy to help qualified candidates — while building your
              reputation as a trusted connector in your industry. Everyone wins.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="section-container">
            <h2 className="font-display text-section-heading font-normal text-near-black mb-12 text-center">What we stand for</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: 'Human-first', description: 'Behind every job application is a person with real ambitions. We build technology that respects that.' },
                { icon: Globe, title: 'Transparency', description: 'Full status visibility for every referral request. No black holes, no ghosting, no guessing.' },
                { icon: Shield, title: 'Trust', description: 'Verified profiles, secure data, and a community that holds each other accountable.' },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="text-center">
                  <div className="w-12 h-12 rounded-sm bg-soft-stone flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-near-black" />
                  </div>
                  <h3 className="font-display text-feature-heading font-medium text-near-black mb-3">{title}</h3>
                  <p className="text-caption text-muted-slate leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 dark-band">
          <div className="section-container text-center">
            <h2 className="font-display text-section-heading font-normal text-white mb-6">Join the Wasta community</h2>
            <p className="text-body-large text-white/70 mb-10 max-w-lg mx-auto">
              Whether you're looking for your next role or want to help others find theirs — there's a place for you here.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-pill bg-white text-near-black text-btn font-medium hover:bg-soft-stone transition-colors">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

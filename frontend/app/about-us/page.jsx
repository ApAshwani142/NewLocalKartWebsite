import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Store, Rocket, ShieldCheck, Heart, Zap, Award, Target, Users, MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Us | Empowering Local Businesses - e-LocalKart',
  description: 'Discover how e-LocalKart is revolutionizing hyperlocal quick commerce in India by connecting customers with neighborhood stores and Kirana shops.',
  openGraph: {
    title: 'About Us - e-LocalKart Hyperlocal Commerce',
    description: 'Empowering local Kirana storekeepers in Bihar and India with cutting-edge hyperlocal technology and same-hour doorstep delivery.',
    url: 'https://elocalkart.com/about-us',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - e-LocalKart',
    description: 'Empowering local businesses with hyperlocal tech stack and express doorstep delivery.',
  },
};

export default function AboutUsPage() {
  const stats = [
    { label: 'Verified Local Kiranas', value: '500+' },
    { label: 'Happy Families Served', value: '50,000+' },
    { label: 'Avg Express SLA', value: '25 Mins' },
    { label: 'Cities & Towns in Bihar', value: '12+' },
  ];

  const pillars = [
    {
      icon: Store,
      title: 'Support Local Kiranas',
      desc: 'We empower small independent Kirana owners with digital storefronts, inventory tools, and order management, keeping local economies thriving.'
    },
    {
      icon: Zap,
      title: 'Hyperlocal Speed',
      desc: 'Our real-time dispatch algorithm connects your basket to the closest store within 2 km, achieving ultra-fast 15-45 minute doorstep delivery.'
    },
    {
      icon: ShieldCheck,
      title: 'Quality & Trust',
      desc: 'Fresh produce sourced directly from regional farms and verified local retailers with strict quality assurance and money-back guarantees.'
    },
    {
      icon: Rocket,
      title: 'Modern Tech Stack',
      desc: 'Built on high-performance cloud infrastructure, instant search, and seamless digital payments tailored for Tier 2, Tier 3, and metro India.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-[#0e3e26] via-[#124d30] to-[#072415] text-white py-16 px-4 md:px-8 relative overflow-hidden text-center">
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-emerald-300">
              <Heart size={14} className="text-red-400 fill-red-400" />
              Made With Pride In India
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-3xl">
              Connecting You to Your Neighborhood Stores in Minutes.
            </h1>
            <p className="text-sm md:text-base text-emerald-100/90 font-medium max-w-2xl leading-relaxed">
              e-LocalKart was born out of a passion to digitize and empower India's vast network of local Kirana stores, delivering farm-fresh produce and daily household essentials with unmatched speed.
            </p>
          </div>
        </section>

        {/* Stats Row */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl md:text-4xl font-black text-[#0e3e26] dark:text-emerald-400">
                  {st.value}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Mission */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#0e3e26] dark:text-emerald-400 flex items-center justify-center">
                <Target size={26} />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Our Mission</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                To build India's most trusted hyperlocal commerce ecosystem that enables local shopkeepers to compete with digital giants while providing customers instant, reliable delivery of authentic products.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#0e3e26] dark:text-emerald-400 flex items-center justify-center">
                <Award size={26} />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Our Vision</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                To transform every neighborhood in Tier 1, Tier 2, and Tier 3 Indian cities into an express digital hub where local shops and customers seamlessly connect within minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Core Pillars Grid */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Why e-LocalKart Exists
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">
              Building a sustainable, local-first commerce model for India
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition duration-200"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {pil.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technology & Future Goals */}
        <section className="w-full bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-16 px-4 md:px-8 text-left">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Technology & Future Roadmap
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              We leverage real-time location mapping, automated inventory syncing for non-tech-savvy storekeepers, and AI-driven dispatch routing. Our goal is to onboard 10,000+ local retailers across India by 2027 while keeping delivery zero-emission through electric delivery vehicles.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

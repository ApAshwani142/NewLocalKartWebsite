import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Briefcase, Rocket, Users, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Careers & Openings | Build the Future of Hyperlocal Commerce - e-LocalKart',
  description: 'Join the e-LocalKart engineering, product, operations, and logistics teams. Help build India’s premier hyperlocal Kirana commerce platform.',
  openGraph: {
    title: 'Careers at e-LocalKart',
    description: 'Join e-LocalKart team and empower local Kirana businesses in India.',
    url: 'https://elocalkart.com/careers',
    type: 'website',
  },
};

export default function CareersPage() {
  const positions = [
    { title: 'Senior Frontend Engineer (Next.js & React)', dept: 'Engineering', location: 'Remote / Bihar', type: 'Full-time' },
    { title: 'Hyperlocal Operations Lead', dept: 'Operations', location: 'Ara / Patna, Bihar', type: 'Full-time' },
    { title: 'Merchant Onboarding Manager', dept: 'Sales & Growth', location: 'Bihar', type: 'Full-time' },
    { title: 'Product Designer (UX/UI)', dept: 'Design', location: 'Remote', type: 'Full-time' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Briefcase size={15} />
            Join Our Mission
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Build the Next Generation of Hyperlocal Commerce
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold max-w-2xl">
            At e-LocalKart, we are on a mission to digitize 500,000+ neighborhood Kirana stores in India. Explore open roles and build impactful technology.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-left">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Current Openings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {positions.map((pos, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                    {pos.dept}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2">
                    {pos.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1">
                    {pos.location} • {pos.type}
                  </p>
                </div>
                <Link
                  href={`/contact-us?category=Careers&role=${encodeURIComponent(pos.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider hover:underline"
                >
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

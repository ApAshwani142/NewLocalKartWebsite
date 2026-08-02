import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Truck, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Become a Delivery Partner | Earn Daily - e-LocalKart',
  description: 'Join e-LocalKart delivery fleet. Flexible hours, daily payouts, express delivery bonuses in Bihar.',
  openGraph: {
    title: 'Become a Delivery Partner - e-LocalKart',
    description: 'Earn flexible income delivering groceries from local Kirana stores.',
    url: 'https://elocalkart.com/partner/delivery',
    type: 'website',
  },
};

export default function PartnerDeliveryPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-gradient-to-r from-[#0e3e26] via-[#124d30] to-[#072415] text-white rounded-3xl p-8 md:p-12 shadow-xl mb-10 text-left relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-300 mb-4">
              <Truck size={14} />
              Delivery Fleet Onboarding
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Earn Daily with Flexible Delivery Shifts
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/90 font-medium leading-relaxed mb-6">
              Deliver express grocery orders from local neighborhood stores to nearby homes. Choose your own hours and get paid daily.
            </p>
            <Link
              href="/contact-us?category=Delivery"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg transition"
            >
              Join Delivery Fleet <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit">
              <Clock size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Flexible Working Hours</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Work part-time or full-time. Log on whenever you want to accept nearby delivery requests.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Accident Insurance Cover</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Free insurance protection for all active delivery partners while on active trips.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

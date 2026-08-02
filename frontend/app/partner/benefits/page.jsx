import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Award, TrendingUp, Zap, ShieldCheck, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Partner Benefits | Why Join e-LocalKart Network',
  description: 'Discover the advantages of partnering with e-LocalKart for local shopkeepers and delivery riders in India.',
  openGraph: {
    title: 'Partner Benefits - e-LocalKart',
    description: 'Grow business and earnings with e-LocalKart hyperlocal partner network.',
    url: 'https://elocalkart.com/partner/benefits',
    type: 'website',
  },
};

export default function PartnerBenefitsPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Award size={15} />
            Partner Growth Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Why Partner With e-LocalKart?
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            We provide local stores with digital inventory software, order dispatch, marketing support, and daily payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Zero Upfront Subscription Fees</h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Start selling your store items online with zero joining fee. Only pay a minimal commission on fulfilled orders.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit">
              <DollarSign size={24} />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Daily Bank Settlement</h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Earnings are automatically transferred directly to your bank account or UPI every 24 hours.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

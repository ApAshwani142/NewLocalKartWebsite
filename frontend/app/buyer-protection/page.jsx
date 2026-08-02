import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { ShieldCheck, RefreshCw, Award, Lock } from 'lucide-react';

export const metadata = {
  title: 'Buyer Protection Policy | 100% Satisfaction Guarantee - e-LocalKart',
  description: 'e-LocalKart Buyer Protection ensures genuine products, 100% money-back guarantee for spoiled goods, and secure digital payments.',
  openGraph: {
    title: 'Buyer Protection Guarantee - e-LocalKart',
    description: 'Freshness guarantee and buyer protection rules on e-LocalKart.',
    url: 'https://elocalkart.com/buyer-protection',
    type: 'website',
  },
};

export default function BuyerProtectionPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <ShieldCheck size={15} />
            Consumer Shield
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Buyer Protection Guarantee
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Shop with total confidence across all verified neighborhood stores on e-LocalKart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <Award size={22} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Freshness Guarantee</h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              If fresh fruits, vegetables, or dairy arrive spoiled or un fresh, receive 100% refund or free express replacement within 1 hour of delivery.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#0e3e26] text-white">
                <Lock size={22} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Secure Escrow Settlement</h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Merchant payouts are settled after order delivery, ensuring your funds are protected against unfulfilled orders.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

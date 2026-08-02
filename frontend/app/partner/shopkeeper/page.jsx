import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Store, Zap, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Become a Partner Shopkeeper | Onboard Kirana Store - e-LocalKart',
  description: 'Grow your local Kirana shop with e-LocalKart digital ordering, inventory syncing, and express delivery dispatch across Bihar.',
  openGraph: {
    title: 'Become a Partner Shopkeeper - e-LocalKart',
    description: 'Grow your Kirana store sales with e-LocalKart partner platform.',
    url: 'https://elocalkart.com/partner/shopkeeper',
    type: 'website',
  },
};

export default function PartnerShopkeeperPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0e3e26] via-[#124d30] to-[#072415] text-white rounded-3xl p-8 md:p-12 shadow-xl mb-10 text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-300 mb-4">
              <Store size={14} />
              Merchant Partner Program
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Grow Your Local Kirana Store Sales by 3x
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/90 font-medium leading-relaxed mb-6">
              Join 500+ verified local Kirana shopkeepers receiving online orders from customers within a 5 km radius with zero tech setup fees.
            </p>
            <Link
              href="/partner/login"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg transition"
            >
              Sign In to Merchant Portal <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Increase Revenue</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Get orders from thousands of local customers who prefer shopping online from nearby neighborhood stores.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit">
              <Zap size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Instant Fulfillment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Delivery partners are automatically assigned as soon as you pack the items. No logistics hassle.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Same-Day Payouts</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Receive direct bank or UPI payouts daily with complete transparent order earnings ledgers.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

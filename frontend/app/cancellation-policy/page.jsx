import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { XCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Cancellation Policy | e-LocalKart Hyperlocal Platform',
  description: 'Understand e-LocalKart order cancellation rules, window timeframes, store packing SLA, and cancellation fee policy.',
  openGraph: {
    title: 'Cancellation Policy - e-LocalKart',
    description: 'Cancellation window, terms, and fee structures for e-LocalKart customers.',
    url: 'https://elocalkart.com/cancellation-policy',
    type: 'website',
  },
};

export default function CancellationPolicyPage() {
  const lastUpdated = 'August 1, 2026';

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <XCircle size={15} />
            Order Cancellation SLA
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Cancellation Policy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Last Updated: {lastUpdated} • Fair & Transparent Order Rules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <Clock size={22} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Free Cancellation Window</h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              You can cancel an order free of charge as long as the status is "Order Placed" or "Pending Store Confirmation". Once the storekeeper accepts and starts preparing your items, cancellation charges may apply.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Late Cancellation Fee</h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              If an order is cancelled after the merchant has packed perishable produce or after the delivery partner is dispatched, a cancellation charge of up to 100% of order value may be levied to compensate local merchants and riders.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. Platform Initiated Cancellations</h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              e-LocalKart reserves the right to cancel orders due to store stock unavailability, unserviceable weather conditions, or unverified contact numbers. 100% of prepaid funds are immediately refunded to the original payment source.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

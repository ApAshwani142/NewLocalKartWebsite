import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Cookie, Lock, Eye, Database } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | e-LocalKart Hyperlocal Platform',
  description: 'Understand how e-LocalKart utilizes essential cookies and local storage to store session data, cart contents, and location coordinates.',
  openGraph: {
    title: 'Cookie Policy - e-LocalKart',
    description: 'Cookie usage and local storage guidelines for e-LocalKart platform.',
    url: 'https://elocalkart.com/cookie-policy',
    type: 'website',
  },
};

export default function CookiePolicyPage() {
  const lastUpdated = 'August 1, 2026';

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Cookie size={15} />
            Browser Telemetry & Storage
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Cookie Policy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Last Updated: {lastUpdated} • How We Manage Session Preferences
          </p>
        </div>

        <div className="flex flex-col gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Lock size={18} className="text-emerald-600" />
              1. Essential Functional Cookies
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              We use strictly necessary cookies and HTML5 LocalStorage to keep you logged in, persist items added to your shopping cart, and remember your pinned delivery coordinates when browsing nearby stores.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Database size={18} className="text-emerald-600" />
              2. Performance & Analytics Telemetry
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Anonymized telemetry tokens help us analyze platform speed, identify bug crashes, and optimize search query speeds. We NEVER sell or share cookie telemetry to third-party ad networks.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

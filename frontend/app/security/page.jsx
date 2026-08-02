import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, Key, Server, Cpu } from 'lucide-react';

export const metadata = {
  title: 'Platform Security & Infrastructure | e-LocalKart',
  description: 'Discover how e-LocalKart safeguards user credentials, payment details, and geolocation data using PCI-DSS, AES-256, and Cloudflare WAF.',
  openGraph: {
    title: 'Platform Security - e-LocalKart',
    description: 'Bank-grade security and data encryption standards on e-LocalKart.',
    url: 'https://elocalkart.com/security',
    type: 'website',
  },
};

export default function SecurityPage() {
  const lastUpdated = 'August 1, 2026';

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <ShieldCheck size={15} />
            Enterprise Infrastructure
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Security & Data Protection
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Last Updated: {lastUpdated} • Bank-Grade Safeguards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <Lock size={22} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Payment Security (PCI-DSS)</h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              All transactions are encrypted end-to-end and processed through PCI-DSS Level 1 certified gateway partners (Razorpay). Full card details or passwords are never stored on our servers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Server size={22} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Cloud Infrastructure & WAF</h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              Protected by Cloudflare DDoS mitigation, strict CORS policies, and rate-limiting to ensure 99.99% uptime and prevent unauthorized bot activity.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

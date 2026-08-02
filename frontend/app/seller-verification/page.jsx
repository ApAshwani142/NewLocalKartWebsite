import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Store, ShieldCheck, CheckCircle2, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'Seller Verification Policy | e-LocalKart',
  description: 'How e-LocalKart verifies local Kirana stores, FSSAI licenses, and physical store premises in Bihar and India.',
  openGraph: {
    title: 'Seller Verification Policy - e-LocalKart',
    description: 'Strict verification standards for all partner shopkeepers on e-LocalKart.',
    url: 'https://elocalkart.com/seller-verification',
    type: 'website',
  },
};

export default function SellerVerificationPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Store size={15} />
            Merchant Trust Standard
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Seller Verification Policy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Ensuring 100% Genuine & Licensed Local Shopkeeper Partners
          </p>
        </div>

        <div className="flex flex-col gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck size={18} className="text-emerald-600" /> Mandatory Verification Requirements
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Every shopkeeper listed on e-LocalKart must undergo physical store inspection, provide valid GST / Shop License documentation, and submit FSSAI Food Safety licenses for grocery and food sales.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

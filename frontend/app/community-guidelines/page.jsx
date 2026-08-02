import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Users, Heart, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Community Guidelines | e-LocalKart Hyperlocal Platform',
  description: 'Community standards for respectful interactions between customers, shopkeepers, and delivery partners on e-LocalKart.',
  openGraph: {
    title: 'Community Guidelines - e-LocalKart',
    description: 'Guidelines for respectful commerce on e-LocalKart.',
    url: 'https://elocalkart.com/community-guidelines',
    type: 'website',
  },
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Users size={15} />
            Respect & Safety Standards
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Community Guidelines
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Fostering mutual respect between shoppers, neighborhood merchants, and delivery partners.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Heart size={18} className="text-red-500" /> Respect Delivery Partners & Store Owners
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Delivery partners work tirelessly through traffic and rain. Always treat riders and store clerks with courtesy. Harassment or verbal abuse will result in immediate permanent account suspension.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" /> Authentic Product Reviews
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Leave genuine, constructive reviews for items purchased from local stores. Fake negative ratings or competitor sabotage are strictly prohibited.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

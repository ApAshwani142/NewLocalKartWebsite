import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Newspaper, Rss, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Press & Newsroom | e-LocalKart Updates',
  description: 'Latest media releases, company announcements, and blog stories from e-LocalKart.',
  openGraph: {
    title: 'Press & News - e-LocalKart',
    description: 'Latest news and media coverage of e-LocalKart in India.',
    url: 'https://elocalkart.com/press-and-news',
    type: 'website',
  },
};

export default function PressAndNewsPage() {
  const articles = [
    {
      title: 'e-LocalKart Reaches 50,000 Deliveries Across Bihar Kirana Network',
      date: 'July 15, 2026',
      tag: 'Company Milestone',
      excerpt: 'Empowering local Kirana shopkeepers in Ara, Patna, and Gaya with same-hour delivery tech.'
    },
    {
      title: 'How Hyperlocal Delivery Technology is Preserving Neighborhood Kirana Stores',
      date: 'June 28, 2026',
      tag: 'Industry Analysis',
      excerpt: 'Exploring how direct shop-to-doorstep dispatching keeps small retail businesses thriving.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Newspaper size={15} />
            Newsroom & Stories
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Press & Latest Updates
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Read news releases, technology blogs, and milestone announcements from e-LocalKart.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-left" id="blog">
          {articles.map((art, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                  {art.tag}
                </span>
                <span className="text-xs font-bold text-slate-400">{art.date}</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{art.title}</h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{art.excerpt}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

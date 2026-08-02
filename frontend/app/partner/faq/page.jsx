import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import HelpCenterAccordion from '@/app/help-center/HelpCenterAccordion';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Partner FAQs | Merchant & Rider Support - e-LocalKart',
  description: 'Frequently asked questions for shopkeeper merchants and delivery riders on e-LocalKart platform.',
  openGraph: {
    title: 'Partner FAQs - e-LocalKart',
    description: 'Frequently asked questions for e-LocalKart partners.',
    url: 'https://elocalkart.com/partner/faq',
    type: 'website',
  },
};

export default function PartnerFaqPage() {
  const partnerFaqs = [
    {
      category: 'Shopkeepers',
      iconName: 'Store',
      questions: [
        {
          q: 'What documents are required to register a Kirana shop?',
          a: 'You need an Aadhaar card, PAN card, bank account details, and GST / Shop License (if applicable). FSSAI license is required for grocery & food sales.'
        },
        {
          q: 'How do I manage prices and stock availability?',
          a: 'Use the e-LocalKart Merchant Mobile App or Partner Portal to update inventory, mark items out of stock, or update prices in real time.'
        }
      ]
    },
    {
      category: 'Delivery Partners',
      iconName: 'Truck',
      questions: [
        {
          q: 'What vehicle types are allowed for delivery partners?',
          a: 'Bicycles, Electric Scooters, Motorbikes, and Light Commercial Vehicles are all welcomed on e-LocalKart delivery fleet.'
        },
        {
          q: 'When do delivery riders get paid?',
          a: 'Rider earnings are disbursed daily via instant UPI payout link directly to your linked bank account.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <HelpCircle size={15} />
            Merchant & Rider Support
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Partner Frequently Asked Questions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Everything you need to know about store onboarding, daily payouts, and dispatching.
          </p>
        </div>

        <HelpCenterAccordion faqCategories={partnerFaqs} />
      </main>

      <Footer />
    </div>
  );
}

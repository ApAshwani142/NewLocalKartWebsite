import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import HelpCenterAccordion from './HelpCenterAccordion';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Help Center & Frequently Asked Questions | e-LocalKart',
  description: 'Find instant answers to FAQs regarding e-LocalKart order tracking, payment modes, hyperlocal delivery times, refund SLA, account management, and service location.',
  openGraph: {
    title: 'Help Center & FAQs - e-LocalKart',
    description: 'Instant answers for e-LocalKart orders, payments, delivery SLA, returns, and location support.',
    url: 'https://elocalkart.com/help-center',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Help Center - e-LocalKart',
    description: 'Customer help desk and FAQ portal for e-LocalKart.',
  },
};

export default function HelpCenterPage() {
  const faqCategories = [
    {
      category: 'Orders',
      iconName: 'ShoppingBag',
      questions: [
        {
          q: 'How do I place an order on e-LocalKart?',
          a: 'Select your location, browse products from nearby Kirana stores, add items to your cart, and proceed to checkout using UPI, Cards, Netbanking, or Cash on Delivery.'
        },
        {
          q: 'Can I modify my order after placing it?',
          a: 'Order items cannot be changed once the storekeeper begins packing. However, you can cancel the order free of charge before packing starts and place a new order.'
        },
        {
          q: 'Where can I track my live order status?',
          a: 'Go to "Track Order" or "My Orders" from the profile dropdown menu to view real-time packing progress and live GPS tracking of your delivery partner.'
        }
      ]
    },
    {
      category: 'Payments',
      iconName: 'CreditCard',
      questions: [
        {
          q: 'What payment modes are accepted on e-LocalKart?',
          a: 'We accept PhonePe, Google Pay, Paytm UPI, Credit/Debit Cards (Visa, MasterCard, RuPay), Netbanking across all major Indian banks, e-LocalKart Wallet, and Cash on Delivery (COD).'
        },
        {
          q: 'What should I do if money was debited but the order failed?',
          a: 'Unsuccessful transaction debits are automatically reversed by bank gateways within 2 to 24 hours. You will also receive an instant confirmation SMS.'
        }
      ]
    },
    {
      category: 'Delivery',
      iconName: 'Truck',
      questions: [
        {
          q: 'How fast is e-LocalKart hyperlocal delivery?',
          a: 'Our average delivery time ranges from 15 to 45 minutes because products are dispatched directly from verified local shops within 2 to 5 km of your location.'
        },
        {
          q: 'What are the delivery charges?',
          a: 'Orders above ₹299 qualify for FREE delivery. Orders below ₹299 have a nominal distance fee starting at ₹15.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      iconName: 'RefreshCw',
      questions: [
        {
          q: 'What is the return window for damaged or wrong products?',
          a: 'For fresh fruits, vegetables, and dairy, report issues within 1 hour of delivery. For packaged dry groceries, report within 24 hours via "My Orders" to get instant replacements or refunds.'
        },
        {
          q: 'How long does an approved refund take?',
          a: 'UPI and e-LocalKart Wallet refunds process instantly (under 2 hours). Bank card refunds take 5-7 business days.'
        }
      ]
    },
    {
      category: 'Account',
      iconName: 'UserCheck',
      questions: [
        {
          q: 'How do I update my registered phone number or address?',
          a: 'Navigate to "My Profile" ➔ "Saved Addresses" or "Settings" to edit delivery coordinates, contact details, and preferences.'
        },
        {
          q: 'How do I request complete account deletion?',
          a: 'You can request account deletion from Account Settings or by emailing privacy@elocalkart.com.'
        }
      ]
    },
    {
      category: 'Location',
      iconName: 'MapPin',
      questions: [
        {
          q: 'Why does e-LocalKart require my location access?',
          a: 'We use real-time GPS location to display available nearby stores, compute accurate stock levels, and assign nearest delivery riders.'
        },
        {
          q: 'Is e-LocalKart available in my area?',
          a: 'We currently serve major cities and towns across Bihar including Ara, Patna, Gaya, Bhagalpur, Muzaffarpur, and expand to new pin codes weekly.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-10">
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <HelpCircle size={15} />
            Self-Service Knowledge Base
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            e-LocalKart Help Center
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Got questions? Browse categorized FAQs below or connect directly with our support desk.
          </p>
        </div>

        {/* FAQ Accordion Component */}
        <HelpCenterAccordion faqCategories={faqCategories} />
      </main>

      <Footer />
    </div>
  );
}

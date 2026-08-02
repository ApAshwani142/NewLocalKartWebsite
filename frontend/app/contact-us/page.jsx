import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';
import { Mail, Phone, Clock, MapPin, HelpCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | Customer Support & Helpline - e-LocalKart',
  description: 'Get in touch with e-LocalKart customer support team via phone, email, or live inquiry form. Operating hours: 8 AM - 10 PM IST.',
  openGraph: {
    title: 'Contact Us - e-LocalKart Customer Support',
    description: 'Reach e-LocalKart support desk for order queries, shopkeeper onboarding, or delivery assistance.',
    url: 'https://elocalkart.com/contact-us',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us - e-LocalKart',
    description: 'Connect with e-LocalKart support team.',
  },
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-10">
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <MessageSquare size={15} />
            We Are Here To Help
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Contact Support & Business Team
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Have a question about your order, partnership, or delivery? Reach out to us directly!
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Left Column: Contact Details Cards */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Phone */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Phone Helpline</h3>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">+91 98765 43210</p>
                <p className="text-[11px] text-slate-500 font-medium">Toll-free customer support</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Email Address</h3>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">support@elocalkart.com</p>
                <p className="text-[11px] text-slate-500 font-medium">Responses within 2 hours</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Operating Hours</h3>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">8:00 AM – 10:00 PM IST</p>
                <p className="text-[11px] text-slate-500 font-medium">7 Days a week</p>
              </div>
            </div>

            {/* Office Address */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Registered Head Office</h3>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1 leading-relaxed">
                  e-LocalKart Technologies Pvt. Ltd.<br />
                  Main GT Road, Near Railway Station<br />
                  Ara, Bihar - 801101, India
                </p>
              </div>
            </div>

            {/* FAQ Link Box */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 flex flex-col gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <HelpCircle size={16} /> Looking for instant answers?
              </h3>
              <p className="text-xs font-medium">Check our FAQ section in the Help Center before submitting a ticket.</p>
              <Link
                href="/help-center"
                className="mt-2 inline-flex items-center justify-center gap-1 text-xs font-black bg-[#0e3e26] text-white px-4 py-2 rounded-2xl hover:bg-emerald-800 transition uppercase tracking-wider"
              >
                Visit Help Center ➔
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Form & Map */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <ContactForm />

            {/* Interactive Google Map Placeholder */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" /> Head Office Location
              </h3>
              <div className="w-full h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                {/* Embedded Map Visual graphic */}
                <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="relative z-10 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black animate-bounce shadow-md">
                    📍
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">e-LocalKart HQ</p>
                    <p className="text-[10px] font-bold text-slate-500">Ara, Bihar - 801101</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Ara+Bihar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-wider mt-1"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

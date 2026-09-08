'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, CheckCircle2, FileText, ArrowRight, Building, Clock, PhoneCall } from 'lucide-react';

export default function SellerVerificationPage() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb] dark:bg-slate-950 font-sans">
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 md:px-6 py-12 flex-1">
        {/* Hero Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-500/20">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Seller Verification & Onboarding
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-3 leading-relaxed">
            e-LocalKart is built on trust and hyperlocal authenticity. Every local shopkeeper undergoes comprehensive verification before selling.
          </p>
        </div>

        {/* Verification Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
              <FileText size={22} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">1. KYC & Business Proof</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload Aadhaar/PAN, GSTIN or local municipal trade license along with valid store address proof.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
              <Building size={22} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">2. Physical Store Audit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our local area team verifies GPS geo-coordinates, store premises, and product storage hygiene.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-4">
              <CheckCircle2 size={22} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">3. Instant Digital Go-Live</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upon approval, access your Shopkeeper Portal, add inventory, and receive immediate hyperlocal orders.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black mb-2">Ready to become an e-LocalKart Partner?</h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              Start selling to thousands of customers within 3-5 km of your retail store today.
            </p>
          </div>

          <a
            href="https://local-kart-shop-agent-4vgq-six.vercel.app/register-shopkeeper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg shrink-0 cursor-pointer"
          >
            Register Your Shop
            <ArrowRight size={16} />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

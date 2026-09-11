'use client';

import React from 'react';
import Link from 'next/link';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, MapPinOff, ArrowRight, Package, HelpCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnserviceableBanner() {
  const { location, setIsLocationPickerOpen } = useLocation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-2xl mx-auto my-8"
    >
      <div className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden text-center">
        {/* Top visual */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-8 pt-10 pb-6 flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-red-50 border border-red-100">
            <MapPinOff size={36} className="text-red-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            We&apos;re not in {location.city || 'your area'} yet
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-sm leading-relaxed">
            e-LocalKart currently serves <strong className="text-emerald-700">Ara, Bihar</strong> and nearby areas.
            We&apos;re expanding fast — your city may be next!
          </p>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 space-y-3">
          <button
            onClick={() => setIsLocationPickerOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0e3e26] to-[#105634] hover:from-[#105634] hover:to-[#0e3e26] text-white font-bold text-sm shadow-md transition cursor-pointer active:scale-[0.98]"
          >
            <MapPin size={18} />
            Change Delivery Location
            <ArrowRight size={16} />
          </button>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <Link
              href="/orders"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition text-slate-600 hover:text-emerald-700"
            >
              <Package size={18} />
              <span className="text-[11px] font-bold">My Orders</span>
            </Link>
            <Link
              href="/help-center"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition text-slate-600 hover:text-emerald-700"
            >
              <HelpCircle size={18} />
              <span className="text-[11px] font-bold">Help Center</span>
            </Link>
            <Link
              href="/about-us"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition text-slate-600 hover:text-emerald-700"
            >
              <Info size={18} />
              <span className="text-[11px] font-bold">About Us</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

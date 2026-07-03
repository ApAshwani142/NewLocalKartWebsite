'use client';

import React from 'react';
import { Shield, Truck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustGuarantee() {
  return (
    <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-6">
      
      {/* Left Box: Trust Guarantee Statement */}
      <motion.div 
        whileHover={{ y: -4, boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.05)' }}
        className="w-full lg:w-1/3 bg-white rounded-3xl border border-gray-100 shadow-premium p-7 flex flex-col items-start text-left gap-4"
      >
        <div className="bg-[#fff5f5] text-red-500 border border-red-100 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert size={14} className="text-red-500" />
          Trust Guarantee
        </div>
        <p className="text-sm font-semibold text-gray-500 leading-relaxed">
          Direct farm-to-door fresh supply chain within 60 mins. Fresh vegetables or money back guaranteed!
        </p>
      </motion.div>

      {/* Right Box: Delivery Info Banner */}
      <motion.div 
        whileHover={{ y: -4 }}
        className="w-full lg:w-2/3 bg-brand-dark rounded-3xl p-7 md:p-8 text-white shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden"
      >
        {/* Decorative Graphic background */}
        <div className="absolute right-0 top-0 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="text-left flex-1">
          <h3 className="text-lg md:text-xl font-black text-white mb-2 flex items-center gap-2">
            <Truck size={20} className="text-emerald-400" />
            Quick & Reliable Delivery
          </h3>
          <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed max-w-xl">
            We deliver to your doorstep within 60 minutes from shopkeeper partner checkout. Guaranteed freshness or cash back.
          </p>
        </div>

        {/* Badges Column */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl text-[10px] font-black tracking-wider uppercase"
          >
            <Truck size={13} className="text-emerald-400" />
            Same-Hour
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl text-[10px] font-black tracking-wider uppercase"
          >
            <Shield size={13} className="text-emerald-400" />
            Protected
          </motion.span>
        </div>
      </motion.div>

    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Truck, Store, MapPin, PackageCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessModal({ orderCreated, totalPrice }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      className="max-w-xl mx-auto bg-white rounded-[36px] border border-gray-100 shadow-premium p-6 md:p-10 text-center flex flex-col items-center gap-6 text-left"
    >
      {/* Success Animated Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#105634] flex items-center justify-center shadow-inner">
          <Check size={36} className="stroke-[3.5]" />
        </div>
        <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</span>
      </div>

      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Order Placed Successfully!
        </h2>
        <p className="text-xs md:text-sm text-gray-500 font-bold mt-1.5">
          Thank you for shopping local with <span className="text-[#105634] font-black">e-LocalKart</span>!
        </p>
      </div>

      {/* Delivery ETA Badge */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-[#105634] text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Truck size={22} className="text-amber-300" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-300">
              Estimated Delivery
            </p>
            <p className="text-base font-black">⚡ Arriving in 25–30 Mins</p>
          </div>
        </div>
        <Sparkles size={20} className="text-amber-300 animate-pulse" />
      </div>

      {/* Order Details Breakdown */}
      {orderCreated && (
        <div className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl p-5 text-xs font-bold text-gray-700 flex flex-col gap-3">
          <div className="flex justify-between border-b border-gray-200/60 pb-2.5">
            <span className="text-gray-400 font-extrabold uppercase">Order Reference:</span>
            <span className="text-[#0e3e26] font-black font-mono">{orderCreated._id}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200/60 pb-2.5">
            <span className="text-gray-400 font-extrabold uppercase">Delivery Status:</span>
            <span className="text-[#105634] font-black uppercase flex items-center gap-1">
              <PackageCheck size={14} />
              <span>{orderCreated.deliveryStatus || 'Processing'}</span>
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200/60 pb-2.5">
            <span className="text-gray-400 font-extrabold uppercase">Payment Method:</span>
            <span className="text-gray-900 font-black">{orderCreated.paymentMethod || 'Razorpay / Online'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400 font-extrabold uppercase">Total Paid:</span>
            <span className="text-lg text-[#105634] font-black">₹{orderCreated.totalPrice || totalPrice}</span>
          </div>
        </div>
      )}

      {/* Notice info */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 w-full">
        <Store size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
          Our verified local partner shop has received your order and is currently packing your items for immediate dispatch.
        </p>
      </div>

      {/* Navigation CTA */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href="/"
          className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-wider text-center transition cursor-pointer"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="flex-1 py-3.5 bg-[#105634] hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider text-center transition cursor-pointer shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2"
        >
          <span>Track Order Status</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}

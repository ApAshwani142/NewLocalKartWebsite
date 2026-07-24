'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutHeader({ onBackToCart }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#105634] px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl shadow-md flex items-center justify-center transition-transform group-hover:scale-[1.02]">
            <span className="text-orange-400 font-extrabold text-lg md:text-xl tracking-tighter flex items-center gap-0.5">
              e-
              <span className="text-white font-black italic">Local</span>
              <span className="text-orange-400">Kart</span>
            </span>
          </div>
        </Link>

        {/* Center/Right: Secure Checkout Badge & Quick Back link */}
        <div className="flex items-center gap-3 sm:gap-6">
          {onBackToCart && (
            <button
              onClick={onBackToCart}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#105634] transition-colors py-1.5 px-3 rounded-lg hover:bg-emerald-50"
            >
              <ArrowLeft size={14} />
              <span>Return to Cart</span>
            </button>
          )}

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-emerald-800 shadow-sm"
          >
            <ShieldCheck size={18} className="text-[#105634] stroke-[2.5]" />
            <span className="text-xs md:text-sm font-black tracking-wide uppercase">
              Secure Checkout 🔒
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

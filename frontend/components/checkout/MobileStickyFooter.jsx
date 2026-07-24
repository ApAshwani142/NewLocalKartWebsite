'use client';

import React from 'react';
import { ArrowRight, Lock, Loader2, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileStickyFooter({
  step,
  totalPrice,
  onContinue,
  onBack,
  loading = false
}) {
  if (step === 4) return null; // Don't show sticky footer on order success screen

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-3.5 shadow-2xl"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Price display */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            Total Payable
          </span>
          <span className="text-xl font-black text-[#105634] leading-tight">
            ₹{totalPrice.toLocaleString()}
          </span>
        </div>

        {/* CTA Button featuring Total Payable */}
        <motion.button
          type="button"
          onClick={onContinue}
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          className="flex-1 py-3.5 px-4 bg-[#105634] hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : step === 2 ? (
            <>
              <span>Continue to Payment • ₹{totalPrice}</span>
              <ArrowRight size={15} />
            </>
          ) : (
            <>
              <Lock size={14} />
              <span>Pay ₹{totalPrice} Securely</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

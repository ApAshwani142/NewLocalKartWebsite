'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, CheckCircle2, Sparkles, ShoppingBag } from 'lucide-react';

export default function FreeDeliveryProgressBar({ subtotal, onClose }) {
  const THRESHOLD = 100;
  const isFreeDelivery = subtotal >= THRESHOLD;
  const neededAmount = Math.max(0, THRESHOLD - subtotal);
  const percentage = Math.min(100, Math.max(0, (subtotal / THRESHOLD) * 100));

  const handleContinueShopping = () => {
    if (onClose) onClose();
    // Scroll to products section if available
    const productEl = document.getElementById('products') || document.querySelector('main');
    if (productEl) {
      productEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isFreeDelivery ? (
          /* Case 1: Subtotal < ₹100 */
          <motion.div
            key="needed-card"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.35, type: 'spring', stiffness: 200 }}
            className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 shadow-sm text-left flex flex-col gap-3 relative overflow-hidden"
          >
            {/* Header message */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <Gift size={18} className="animate-bounce" />
              </div>
              <p className="text-xs font-black text-amber-900 leading-snug">
                🎁 You're only <span className="text-[#105634] font-black text-sm">₹{neededAmount}</span> away from <span className="text-[#105634] uppercase font-black tracking-wide">FREE Delivery</span>!
              </p>
            </div>

            {/* Smooth Animated Progress Bar */}
            <div className="w-full bg-amber-200/60 rounded-full h-3.5 p-0.5 relative overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-[#105634] h-full rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {/* Glowing light effect on bar edge */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full blur-[1px]" />
              </motion.div>
            </div>

            {/* Explanatory text & Continue Shopping Action */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-[10px] font-bold text-amber-800/90">
                Add ₹{neededAmount} more to unlock FREE delivery.
              </span>
              
              <button
                type="button"
                onClick={handleContinueShopping}
                className="text-[10px] font-black text-[#105634] hover:text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition cursor-pointer shrink-0 uppercase tracking-wider flex items-center gap-1 shadow-xs"
              >
                <ShoppingBag size={11} />
                <span>+ Add Items</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Case 2: Subtotal >= ₹100 */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 220 }}
            className="bg-gradient-to-r from-[#105634] to-emerald-600 border border-emerald-500 rounded-2xl p-4 text-white shadow-md text-left flex flex-col gap-3 relative overflow-hidden"
          >
            {/* Sparkle particle decorations */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: [0.4, 1, 0.4], y: [-2, -6, -2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-2 right-3 text-amber-300 pointer-events-none"
            >
              <Sparkles size={16} />
            </motion.div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-amber-300 stroke-[2.5]" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-black tracking-wide text-amber-300">
                  🎉 Congratulations!
                </p>
                <p className="text-sm font-black text-white mt-0.5">
                  You've unlocked FREE Delivery.
                </p>
              </div>
            </div>

            {/* Completely Filled Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3.5 p-0.5 relative overflow-hidden">
              <motion.div
                className="bg-amber-300 h-full rounded-full shadow-sm"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-100 bg-white/10 px-2.5 py-1 rounded-xl w-fit">
              <span className="text-amber-300 font-black">✔</span>
              <span>You saved ₹40 on delivery!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

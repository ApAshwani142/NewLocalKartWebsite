'use client';

import React from 'react';
import { Check, ShoppingBag, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutStepper({ step, setStep }) {
  const steps = [
    { id: 1, label: 'Cart', icon: ShoppingBag },
    { id: 2, label: 'Address', icon: MapPin },
    { id: 3, label: 'Payment', icon: CreditCard },
    { id: 4, label: 'Place Order', icon: CheckCircle2 }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 md:mb-10 bg-white rounded-3xl border border-gray-100 shadow-premium p-4 md:p-6">
      <div className="flex items-center justify-between relative px-2 md:px-6">
        
        {/* Background Connecting Line */}
        <div className="absolute top-5 md:top-6 left-8 right-8 h-1 bg-gray-100 z-0 rounded-full" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-5 md:top-6 left-8 h-1 bg-[#105634] z-0 rounded-full" 
          initial={{ width: '0%' }}
          animate={{ width: `${((step - 1) / 3) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />

        {steps.map((s) => {
          const isCompleted = step > s.id;
          const isCurrent = step === s.id;
          const isFuture = step < s.id;

          return (
            <div key={s.id} className="z-10 flex flex-col items-center gap-2 group">
              <motion.button
                onClick={() => isCompleted && setStep(s.id)}
                disabled={isFuture || isCurrent || step === 4}
                whileHover={isCompleted ? { scale: 1.1 } : {}}
                whileTap={isCompleted ? { scale: 0.95 } : {}}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-xs md:text-sm transition-all duration-300 relative ${
                  isCompleted
                    ? 'bg-[#105634] text-white shadow-md cursor-pointer hover:bg-emerald-700'
                    : isCurrent
                    ? 'bg-white border-4 border-[#105634] text-[#105634] scale-110 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10'
                    : 'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCompleted ? (
                  <Check size={18} className="stroke-[3]" />
                ) : (
                  <span>{s.id}</span>
                )}

                {/* Glowing ring for active step */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20 pointer-events-none" />
                )}
              </motion.button>

              <span
                className={`text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors ${
                  isCompleted || isCurrent ? 'text-[#0e3e26]' : 'text-gray-400'
                }`}
              >
                {isCompleted && '✓ '}{s.label}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}

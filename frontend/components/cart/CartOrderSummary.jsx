'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Truck, ShieldCheck } from 'lucide-react';

export default function CartOrderSummary({ subtotal, discount = 0, tax = 0 }) {
  const THRESHOLD = 100;
  const isFreeDelivery = subtotal >= THRESHOLD;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + tax);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm text-left flex flex-col gap-3">
      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
        Bill Summary
      </h4>

      <div className="flex flex-col gap-2 text-xs font-semibold text-gray-600">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span>Item Subtotal</span>
          <motion.span 
            key={subtotal} 
            initial={{ scale: 1.1 }} 
            animate={{ scale: 1 }} 
            className="font-bold text-gray-900"
          >
            ₹{subtotal.toLocaleString()}
          </motion.span>
        </div>

        {/* Coupon Discount if applicable */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700">
            <span className="flex items-center gap-1">
              <Tag size={12} className="text-emerald-600" />
              <span>Coupon Savings</span>
            </span>
            <span className="font-black">- ₹{discount.toLocaleString()}</span>
          </div>
        )}

        {/* Delivery Fee with Animated FREE Transition */}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Truck size={13} className="text-gray-400" />
            <span>Delivery Charge</span>
          </span>

          <AnimatePresence mode="wait">
            {isFreeDelivery ? (
              <motion.span
                key="free-delivery"
                initial={{ opacity: 0, scale: 0.8, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 5 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                className="font-black text-[#105634] flex items-center gap-1.5"
              >
                <span className="line-through text-gray-300 text-[10px] font-normal">
                  ₹40
                </span>
                <span className="bg-emerald-100 text-[#105634] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  FREE
                </span>
              </motion.span>
            ) : (
              <motion.span
                key="paid-delivery"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="font-bold text-gray-900"
              >
                ₹40
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* GST Tax */}
        <div className="flex justify-between items-center">
          <span>GST & Govt Taxes (5%)</span>
          <span className="font-bold text-gray-800">₹{tax}</span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3 mt-1 text-sm font-black text-gray-900">
          <div>
            <span>Grand Total</span>
            <p className="text-[9px] font-bold text-gray-400 uppercase">To Pay</p>
          </div>
          <motion.span
            key={grandTotal}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="text-xl font-black text-[#105634]"
          >
            ₹{grandTotal.toLocaleString()}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

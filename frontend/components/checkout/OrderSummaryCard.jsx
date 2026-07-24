'use client';

import React from 'react';
import { Tag, BadgePercent, ShieldCheck, Truck, Store, Lock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSummaryCard({
  cartItems = [],
  subtotal = 0,
  deliveryFee = 0,
  tax = 0,
  totalPrice = 0,
  discountAmount = 0,
  couponCode = 'FIRST50'
}) {
  const [showItems, setShowItems] = React.useState(true);

  // Calculate estimated total savings (coupon + delivery discount + store savings)
  const totalSavings = discountAmount + (deliveryFee === 0 ? 30 : 0);

  return (
    <div className="w-full flex flex-col gap-4 sticky top-24">
      {/* Coupon Savings Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-[#105634] rounded-2xl p-4 flex items-center justify-between text-white shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0">
            <Tag size={18} className="text-amber-300" />
          </div>
          <div className="leading-tight text-left">
            <p className="text-xs font-black tracking-wide">
              COUPON APPLIED: <span className="text-amber-300">{couponCode}</span>
            </p>
            <p className="text-[11px] font-bold opacity-90 mt-0.5">
              🎉 You are saving ₹{totalSavings} on this order!
            </p>
          </div>
        </div>
        <Sparkles size={18} className="text-amber-300 animate-pulse shrink-0" />
      </motion.div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-5 md:p-6 flex flex-col gap-5 text-left">
        
        {/* Card Title & Item Toggle */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-xs font-extrabold tracking-widest text-[#105634] uppercase flex items-center gap-2">
            <span>Order Summary</span>
            <span className="bg-emerald-50 text-[#105634] text-[10px] font-black px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)} Items
            </span>
          </h3>
          <button
            type="button"
            onClick={() => setShowItems(!showItems)}
            className="text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer"
            title="Toggle item details"
          >
            {showItems ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Product Items List */}
        {showItems && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-50"
          >
            {cartItems.map((item) => (
              <div key={item._id || item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#105634] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                      {item.qty}
                    </span>
                  </div>
                  <div className="leading-tight min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                      {item.unit || '1 unit'} × {item.qty}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-gray-900 shrink-0">
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Estimated Delivery Time */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#105634] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck size={16} />
          </div>
          <div className="leading-tight text-left">
            <p className="text-xs font-black text-[#0e3e26]">
              ⚡ Express Delivery in 25–30 Mins
            </p>
            <p className="text-[10px] font-bold text-emerald-700 mt-0.5">
              Direct from your neighborhood verified store
            </p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-600">
          <div className="flex justify-between">
            <span>Item Subtotal</span>
            <span className="text-gray-900 font-bold">₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-emerald-700">
            <span className="flex items-center gap-1">
              <BadgePercent size={14} className="text-emerald-600" />
              <span>Coupon Savings</span>
            </span>
            <span className="font-black">- ₹{discountAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Partner Fee</span>
            {deliveryFee === 0 ? (
              <span className="text-emerald-700 font-black flex items-center gap-1">
                <span className="line-through text-gray-300 text-[10px]">₹30</span>
                <span>🚀 FREE</span>
              </span>
            ) : (
              <span className="text-gray-900 font-bold">₹{deliveryFee}</span>
            )}
          </div>

          <div className="flex justify-between">
            <span>GST & Govt Taxes (5%)</span>
            <span className="text-gray-800 font-bold">₹{tax}</span>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3.5 mt-1 text-sm font-black text-[#0e3e26]">
            <div>
              <span>Grand Total</span>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Inclusive of all taxes</p>
            </div>
            <span className="text-2xl font-black text-[#105634]">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Savings Badge Card */}
        {totalSavings > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
              <span>🎉</span>
              <span>Total Checkout Savings</span>
            </span>
            <span className="text-sm font-black text-amber-800">
              ₹{totalSavings.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Trust Indicators Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs">
          <Lock size={18} className="text-emerald-600 shrink-0" />
          <div className="leading-tight text-left">
            <p className="text-[11px] font-black text-gray-900">🔒 Secure Checkout</p>
            <p className="text-[9px] text-gray-400 font-bold">256-bit Encrypted</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs">
          <Truck size={18} className="text-emerald-600 shrink-0" />
          <div className="leading-tight text-left">
            <p className="text-[11px] font-black text-gray-900">🚚 Fast Delivery</p>
            <p className="text-[9px] text-gray-400 font-bold">Under 30 minutes</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs">
          <Store size={18} className="text-emerald-600 shrink-0" />
          <div className="leading-tight text-left">
            <p className="text-[11px] font-black text-gray-900">✅ Verified Stores</p>
            <p className="text-[9px] text-gray-400 font-bold">50+ Bihar Partners</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
          <div className="leading-tight text-left">
            <p className="text-[11px] font-black text-gray-900">💳 Safe Payments</p>
            <p className="text-[9px] text-gray-400 font-bold">UPI, COD, Cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}

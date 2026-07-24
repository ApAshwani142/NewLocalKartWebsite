'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Cart Sub-components
import FreeDeliveryProgressBar from '@/components/cart/FreeDeliveryProgressBar';
import CartItemList from '@/components/cart/CartItemList';
import CartOrderSummary from '@/components/cart/CartOrderSummary';

export default function CartModal({ isOpen, onClose }) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    tax,
    totalPrice
  } = useCart();

  const [visible, setVisible] = useState(false);

  // Synchronize drawer visibility animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleProceedToCheckout = () => {
    handleClose();
    if (!user) {
      setTimeout(() => router.push('/login?redirect=/checkout'), 300);
    } else {
      setTimeout(() => router.push('/checkout'), 300);
    }
  };

  const discount = Math.round(subtotal * 0.1);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Blurred Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: visible ? 0 : '100%' }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-[420px] bg-white flex flex-col h-full shadow-2xl relative"
        >
          {/* Top Brand Green Stripe */}
          <div className="h-1.5 bg-gradient-to-r from-[#105634] via-emerald-500 to-teal-400 w-full shrink-0" />

          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#105634] text-white flex items-center justify-center shadow-md">
                <ShoppingBag size={20} />
              </div>
              <div className="leading-tight text-left">
                <h2 className="text-sm font-black text-gray-900 tracking-tight">
                  Your Cart
                </h2>
                <p className="text-[10px] font-bold text-gray-400">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in your bag
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center text-emerald-300">
                  <ShoppingBag size={42} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Your Cart is Empty</h3>
                  <p className="text-xs font-bold text-gray-400 mt-1 max-w-[220px]">
                    Explore daily essentials and local stores to add items!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 bg-[#105634] hover:bg-emerald-700 text-white text-xs font-black rounded-full uppercase tracking-wider transition cursor-pointer shadow-md shadow-emerald-500/10"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              /* Cart Layout Flow:
                 Cart Items -> Free Delivery Card -> Order Summary -> Secure Checkout Badge -> Checkout Button
              */
              <>
                {/* 1. Cart Items */}
                <CartItemList
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />

                {/* 2. Free Delivery Card (Threshold ₹100) */}
                <FreeDeliveryProgressBar
                  subtotal={subtotal}
                  onClose={handleClose}
                />

                {/* 3. Order Summary */}
                <CartOrderSummary
                  subtotal={subtotal}
                  discount={discount}
                  tax={tax}
                />

                {/* 4. Secure Checkout Badge */}
                <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3 flex items-center justify-center gap-2 text-emerald-800 text-[11px] font-extrabold shadow-2xs">
                  <ShieldCheck size={16} className="text-[#105634]" />
                  <span>100% Secure Checkout • 256-Bit SSL Encrypted</span>
                </div>
              </>
            )}
          </div>

          {/* Sticky Bottom Action Bar (Proceed to Checkout Button) */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 shadow-2xl shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-5 bg-[#105634] hover:bg-emerald-700 text-white rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-between transition cursor-pointer shadow-xl shadow-emerald-500/20"
              >
                <div className="flex items-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </div>
                <span className="bg-emerald-800/60 px-3 py-1 rounded-xl text-amber-300 font-mono text-base font-black">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

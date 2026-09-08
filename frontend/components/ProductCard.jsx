'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Star, Heart, Plus, Minus, Store, Clock, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';

const getSafeProductImage = (src) => {
  if (!src || typeof src !== 'string') return DEFAULT_PRODUCT_IMG;
  const trimmed = src.trim();
  if (trimmed.startsWith('blob:') || !trimmed.startsWith('http')) return DEFAULT_PRODUCT_IMG;
  return trimmed;
};

export default function ProductCard({ product, layout = 'vertical' }) {
  const { cartItems, addToCart, updateQuantity } = useCart();

  // Find if item already exists in cart
  const cartItem = cartItems.find((item) => item.product === product._id);
  const qty = cartItem ? cartItem.qty : 0;

  const storeName = product.storeName || 'Local Partner Store';
  const distanceKm = product.distanceKm !== undefined ? product.distanceKm : 0.8;
  const deliveryTime = product.deliveryTime || '15 mins';
  const isDeliverable = product.isDeliverable !== undefined ? product.isDeliverable : true;

  const resolvedImage = getSafeProductImage(product.image || product.imageUrl);

  const handleAdd = () => {
    if (isDeliverable) {
      addToCart(product);
    }
  };

  const handleIncrement = () => {
    updateQuantity(product._id, qty + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product._id, qty - 1);
  };

  // Animation variants for card entry
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Horizontal Card Layout (Trending Beverages format)
  if (layout === 'horizontal') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ 
          y: -4,
          boxShadow: '0 12px 24px -10px rgba(14, 62, 38, 0.15)',
          borderColor: '#a7f3d0'
        }}
        whileTap={{ scale: 0.98 }}
        className={`rounded-3xl border border-gray-100/70 p-4 flex items-center gap-4 transition duration-300 shadow-card ${
          !isDeliverable
            ? 'bg-slate-50 opacity-75 dark:bg-slate-900/60'
            : 'bg-white hover:border-emerald-100 dark:bg-slate-900 dark:border-slate-800'
        }`}
      >
        {/* Left Image Section */}
        <Link href={`/products/${product._id}`} className="shrink-0 block">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800 relative flex items-center justify-center border border-gray-100/50 cursor-pointer">
            <motion.img
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
              src={resolvedImage}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';
              }}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Right Details Section */}
        <div className="flex-1 flex flex-col justify-between items-stretch text-left h-full">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              {/* Store & Proximity pill */}
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20 truncate max-w-[170px]">
                <Store size={10} className="shrink-0" />
                <span className="truncate">{storeName}</span>
              </span>

              <span className="flex items-center gap-0.5 text-xs font-black text-amber-500 shrink-0">
                <Star size={12} className="fill-amber-500 stroke-amber-500" />
                {product.rating || '4.5'}
              </span>
            </div>

            <Link href={`/products/${product._id}`}>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight hover:text-[#0e3e26] transition-colors duration-200 cursor-pointer line-clamp-1">
                {product.name}
              </h4>
            </Link>

            {/* Distance & Delivery Time */}
            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center gap-0.5">
                <Navigation size={10} className="text-emerald-500" />
                {distanceKm} km
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold">
                <Clock size={10} />
                {deliveryTime}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5 gap-2">
            <div className="text-left leading-tight">
              <span className="text-sm font-black text-[#0e3e26] dark:text-emerald-400">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-[10px] text-gray-400 line-through ml-1.5 font-bold">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Cart Controller or Deliverability Badge */}
            {!isDeliverable ? (
              <span className="text-[9px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded-full border border-red-200 dark:border-red-900/50">
                Unavailable
              </span>
            ) : qty > 0 ? (
              <motion.div
                key="controller"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex items-center bg-[#0e3e26] text-white rounded-full overflow-hidden shadow-sm border border-green-800"
              >
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleDecrement}
                  className="px-2.5 py-1.5 hover:bg-green-800 transition text-xs font-bold cursor-pointer"
                >
                  <Minus size={11} className="stroke-[3]" />
                </motion.button>
                <span className="px-1.5 text-xs font-black min-w-[14px] text-center">{qty}</span>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleIncrement}
                  className="px-2.5 py-1.5 hover:bg-green-800 transition text-xs font-bold cursor-pointer"
                >
                  <Plus size={11} className="stroke-[3]" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="add-btn"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileHover={{ scale: 1.05, backgroundColor: '#105634' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="flex items-center gap-1.5 bg-[#0e3e26] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition shadow-md shadow-brand-dark/10 cursor-pointer"
              >
                <Plus size={10} className="stroke-[3]" /> Add
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Vertical Card Layout (Popular Products format)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -6,
        boxShadow: '0 20px 25px -5px rgba(14, 62, 38, 0.08)',
        borderColor: '#a7f3d0'
      }}
      whileTap={{ scale: 0.99 }}
      className={`rounded-[28px] border border-gray-100/70 p-4 flex flex-col justify-between transition duration-300 shadow-card group ${
        !isDeliverable
          ? 'bg-slate-50 opacity-75 dark:bg-slate-900/60'
          : 'bg-white hover:border-emerald-100 dark:bg-slate-900 dark:border-slate-800'
      }`}
    >
      {/* Image & Badges */}
      <div className="w-full h-40 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden mb-3 border border-gray-100/30">
        {product.discount > 0 && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-2.5 left-2.5 bg-[#e8f5e9] text-[#10b981] px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase z-10"
          >
            {product.discount}% Off
          </motion.span>
        )}
        
        <motion.button 
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs hover:bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition shadow-sm cursor-pointer z-10"
        >
          <Heart size={13} className="hover:fill-red-500 transition-colors" />
        </motion.button>

        <Link href={`/products/${product._id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
          <motion.img
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
            src={resolvedImage}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';
            }}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Info & Store Metrics */}
      <div className="text-left flex-1 flex flex-col justify-between items-stretch">
        <div>
          {/* Store Name Pill */}
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20 truncate max-w-[140px]">
              <Store size={10} className="shrink-0 text-emerald-600" />
              <span className="truncate">{storeName}</span>
            </span>
            <span className="flex items-center gap-0.5 text-xs font-black text-amber-500">
              <Star size={11} className="fill-amber-500 stroke-amber-500" />
              {product.rating || '4.5'}
            </span>
          </div>

          <Link href={`/products/${product._id}`}>
            <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight hover:text-[#0e3e26] transition-colors duration-200 cursor-pointer line-clamp-1">
              {product.name}
            </h4>
          </Link>

          {/* Dynamic Distance & Delivery Time */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-0.5">
              <Navigation size={10} className="text-emerald-500" />
              {distanceKm} km
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 font-bold text-amber-600 dark:text-amber-400">
              <Clock size={10} />
              {deliveryTime}
            </span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="text-left leading-tight">
            <span className="text-sm font-black text-[#0e3e26] dark:text-emerald-400">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through ml-1.5 font-bold">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {!isDeliverable ? (
            <span className="text-[9px] font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-900/50">
              Currently unavailable in your area
            </span>
          ) : qty > 0 ? (
            <motion.div
              key="controller"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center bg-[#0e3e26] text-white rounded-full overflow-hidden shadow-sm border border-green-800"
            >
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleDecrement}
                className="px-2.5 py-1.5 hover:bg-green-800 transition text-xs font-bold cursor-pointer"
              >
                <Minus size={11} className="stroke-[3]" />
              </motion.button>
              <span className="px-1.5 text-xs font-black min-w-[14px] text-center">{qty}</span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleIncrement}
                className="px-2.5 py-1.5 hover:bg-green-800 transition text-xs font-bold cursor-pointer"
              >
                <Plus size={11} className="stroke-[3]" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="add-btn"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.05, backgroundColor: '#105634' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-[#0e3e26] text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition shadow-md shadow-brand-dark/10 cursor-pointer"
            >
              <Plus size={10} className="stroke-[3]" /> Add
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

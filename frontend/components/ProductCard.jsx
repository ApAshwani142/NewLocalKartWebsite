'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Star, Heart, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCard({ product, layout = 'vertical' }) {
  const { cartItems, addToCart, updateQuantity } = useCart();

  // Find if item already exists in cart
  const cartItem = cartItems.find((item) => item.product === product._id);
  const qty = cartItem ? cartItem.qty : 0;

  const handleAdd = () => {
    addToCart(product);
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
        className="bg-white rounded-3xl border border-gray-100/70 p-4.5 flex items-center gap-4.5 transition duration-300 shadow-card hover:border-emerald-100"
      >
        {/* Left Image Section */}
        <Link href={`/products/${product._id}`} className="shrink-0 block">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 relative flex items-center justify-center border border-gray-100/50 cursor-pointer">
            <motion.img
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Right Details Section */}
        <div className="flex-1 flex flex-col justify-between items-stretch text-left h-full">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="bg-[#e8f5e9] text-[#10b981] px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                Trending
              </span>
              <span className="flex items-center gap-0.5 text-xs font-black text-amber-500">
                <Star size={12} className="fill-amber-500 stroke-amber-500" />
                {product.rating || '4.5'}
              </span>
            </div>

            <Link href={`/products/${product._id}`}>
              <h4 className="text-sm font-black text-gray-900 leading-tight hover:text-[#0e3e26] transition-colors duration-200 cursor-pointer">
                {product.name}
              </h4>
            </Link>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5">
              {product.unit}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="text-left leading-tight">
              <span className="text-sm font-black text-[#0e3e26]">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-[10px] text-gray-400 line-through ml-1.5 font-bold">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Cart Controller */}
            <AnimatePresence mode="wait">
              {qty > 0 ? (
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
                  className="flex items-center gap-1.5 bg-[#0e3e26] text-white px-4.5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-shadow shadow-md shadow-brand-dark/10 cursor-pointer"
                >
                  <Plus size={10} className="stroke-[3]" /> Add
                </motion.button>
              )}
            </AnimatePresence>
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
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(14, 62, 38, 0.08), 0 10px 10px -5px rgba(14, 62, 38, 0.04)',
        borderColor: '#a7f3d0'
      }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-[28px] border border-gray-100/70 p-4.5 flex flex-col justify-between transition duration-300 shadow-card group hover:border-emerald-100"
    >
      {/* Image & Badges */}
      <div className="w-full h-44 rounded-2xl bg-gray-50 flex items-center justify-center relative overflow-hidden mb-4 p-4 border border-gray-100/30">
        {product.discount > 0 && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 left-3 bg-[#e8f5e9] text-[#10b981] px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase z-10"
          >
            {product.discount}% Off
          </motion.span>
        )}
        
        <motion.button 
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs hover:bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition shadow-sm cursor-pointer z-10"
        >
          <Heart size={14} className="hover:fill-red-500 transition-colors" />
        </motion.button>

        <Link href={`/products/${product._id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
          <motion.img
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.3 }}
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </Link>
      </div>

      {/* Info & Price */}
      <div className="text-left flex-1 flex flex-col justify-between items-stretch">
        <div>
          <span className="flex items-center gap-0.5 text-xs font-black text-amber-500 mb-1.5">
            <Star size={12} className="fill-amber-500 stroke-amber-500" />
            {product.rating || '4.5'}
          </span>
          <Link href={`/products/${product._id}`}>
            <h4 className="text-sm font-black text-gray-900 leading-tight hover:text-[#0e3e26] transition-colors duration-200 cursor-pointer">
              {product.name}
            </h4>
          </Link>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">
            {product.unit}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 gap-2">
          <div className="text-left leading-tight">
            <span className="text-sm font-black text-[#0e3e26]">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through ml-1.5 font-bold">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Cart Controller */}
          <AnimatePresence mode="wait">
            {qty > 0 ? (
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
                className="flex items-center gap-1.5 bg-[#0e3e26] text-white px-4.5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition shadow-md shadow-brand-dark/10 cursor-pointer"
              >
                <Plus size={10} className="stroke-[3]" /> Add
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

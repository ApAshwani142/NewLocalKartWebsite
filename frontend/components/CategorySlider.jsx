'use client';

import React from 'react';
import { CATEGORIES } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function CategorySlider({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-black text-gray-900 tracking-wider uppercase">
          Browse by Category
        </h2>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
          Swipe to scroll ➜
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2.5 shrink-0 group focus:outline-none cursor-pointer"
            >
              <div 
                className={`w-24 h-24 rounded-full bg-white flex items-center justify-center p-1.5 transition-all duration-350 ${
                  isSelected 
                    ? 'ring-4 ring-emerald-500/20 border border-brand-medium/30 scale-95 shadow-md' 
                    : 'border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-emerald-100'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50 flex items-center justify-center">
                  <motion.img
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.3 }}
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-brand-dark/5" />
                  {/* Category icon */}
                  <span className="absolute bottom-1 right-1 text-sm bg-white/90 backdrop-blur-xs w-6 h-6 flex items-center justify-center rounded-full shadow-sm border border-gray-100">
                    {cat.icon}
                  </span>
                </div>
              </div>

              {/* Title Text */}
              <span className={`text-xs font-black transition duration-200 ${
                isSelected ? 'text-brand-dark' : 'text-gray-600 group-hover:text-gray-900'
              }`}>
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

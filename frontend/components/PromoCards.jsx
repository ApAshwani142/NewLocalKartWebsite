'use client';

import React from 'react';
import { ArrowRight, Flame, Sparkles, Truck } from 'lucide-react';
import { PROMOS } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function PromoCards() {
  const getIcon = (id) => {
    switch (id) {
      case 1:
        return <Flame size={14} className="text-white fill-white/25" />;
      case 2:
        return <Sparkles size={14} className="text-white fill-white/25" />;
      case 3:
        return <Truck size={14} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {PROMOS.map((promo, idx) => (
        <motion.div
          key={promo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ 
            y: -6,
            scale: 1.02,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          whileTap={{ scale: 0.98 }}
          className={`relative rounded-3xl p-7 text-white bg-gradient-to-br ${promo.gradient} shadow-card overflow-hidden flex flex-col justify-between items-start min-h-[220px] transition-shadow duration-300`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-black/10 blur-xl pointer-events-none" />

          {/* Tag and Info */}
          <div className="flex flex-col items-start gap-3 w-full">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase">
              {getIcon(promo.id)}
              {promo.tag}
            </span>
            <div className="text-left mt-1">
              <h3 className="text-xl font-black tracking-tight leading-tight mb-1">
                {promo.title}
              </h3>
              <p className="text-xs text-white/80 font-bold leading-normal">
                {promo.desc}
              </p>
            </div>
          </div>

          {/* Call-to-action Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-gray-900 hover:bg-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-wider uppercase transition shadow-md hover:shadow-lg mt-4 cursor-pointer"
          >
            {promo.btnText} <ArrowRight size={12} className="stroke-[2.5]" />
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';

export default function LocationToast({ toast }) {
  if (!toast || !toast.show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 dark:bg-emerald-950/95 text-white rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md max-w-sm"
      >
        <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shrink-0 shadow-md shadow-emerald-500/20">
          <MapPin size={18} className="stroke-[2.5]" />
        </div>
        <div className="text-left pr-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Sparkles size={10} /> Delivery location updated
            </span>
          </div>
          <p className="text-xs font-bold text-slate-100 truncate">
            {toast.area || 'Current Location'}
            {toast.city ? `, ${toast.city}` : ''}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

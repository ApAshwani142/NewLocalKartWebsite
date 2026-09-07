'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Tag, Clock } from 'lucide-react';

export default function DealOfTheDay({ activePromotion = null }) {
  const API_URL = '/api';
  
  // Default active promotion state for initial showcase (controlled by admin/API)
  const [promo, setPromo] = useState(activePromotion || {
    isActive: true,
    title: 'Mega Grocery Sale Live Now!',
    discountText: '30% Flat Discount on all Juice Items!',
    badge: 'Deal of the Day',
    expiresInSeconds: 4 * 3600 + 18 * 60 + 6
  });

  const [timeLeft, setTimeLeft] = useState(promo?.expiresInSeconds || 0);

  useEffect(() => {
    // Attempt fetching live promo from backend if available
    const fetchActivePromo = async () => {
      try {
        const res = await fetch(`${API_URL}/promotions/active`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.isActive) {
            setPromo(data);
            setTimeLeft(data.expiresInSeconds || 3600);
          } else {
            setPromo(null);
          }
        }
      } catch (err) {
        // Fallback to default promo if backend endpoint not active
      }
    };

    if (!activePromotion) {
      fetchActivePromo();
    }
  }, [activePromotion, API_URL]);

  useEffect(() => {
    if (!promo || !promo.isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPromo(null); // Hide section when countdown reaches zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [promo]);

  // If no active promotion exists, return null (no placeholder, no empty space)
  if (!promo || !promo.isActive) {
    return null;
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hrs: String(hrs).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0')
    };
  };

  const { hrs, mins, secs } = formatTime(timeLeft);

  return (
    <div className="w-full bg-gradient-to-r from-[#f4faf7] via-emerald-50/60 to-teal-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900 rounded-[24px] border border-emerald-500/20 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm transition-all duration-300">
      {/* Promo Info */}
      <div className="text-left flex-1">
        <div className="inline-flex items-center gap-1.5 bg-[#0e3e26] text-white px-3.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-3 shadow-xs">
          <Sparkles size={11} className="fill-white/20 text-amber-300" />
          {promo.badge || 'Deal of the Day'}
        </div>
        <h2 className="text-xl md:text-2xl font-black text-[#0e3e26] dark:text-emerald-400 leading-tight mb-1.5 flex items-center gap-2">
          {promo.title}
        </h2>
        <p className="text-sm md:text-base font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
          <Tag size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          {promo.discountText}
        </p>
      </div>

      {/* Ticking Countdown Timer */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0e3e26] dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md border border-emerald-600/40">
            {hrs}
          </div>
          <span className="text-[9px] text-[#0e3e26] dark:text-emerald-300 font-extrabold tracking-widest uppercase mt-2">Hrs</span>
        </div>

        <span className="text-[#0e3e26] dark:text-emerald-400 font-black text-xl md:text-2xl -mt-5">:</span>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0e3e26] dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md border border-emerald-600/40">
            {mins}
          </div>
          <span className="text-[9px] text-[#0e3e26] dark:text-emerald-300 font-extrabold tracking-widest uppercase mt-2">Mins</span>
        </div>

        <span className="text-[#0e3e26] dark:text-emerald-400 font-black text-xl md:text-2xl -mt-5">:</span>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0e3e26] dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md border border-emerald-600/40">
            {secs}
          </div>
          <span className="text-[9px] text-[#0e3e26] dark:text-emerald-300 font-extrabold tracking-widest uppercase mt-2">Secs</span>
        </div>
      </div>
    </div>
  );
}


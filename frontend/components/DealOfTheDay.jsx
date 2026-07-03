'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function DealOfTheDay() {
  // Set initial countdown to 4 hours, 18 mins, 6 secs
  const [timeLeft, setTimeLeft] = useState(4 * 3600 + 18 * 60 + 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          return 4 * 3600 + 18 * 60 + 6; // Reset/loop for visual demo
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <div className="w-full bg-[#f4faf7] rounded-[24px] border-2 border-dashed border-[#a7f3d0] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
      {/* Promo Info */}
      <div className="text-left flex-1">
        <div className="inline-flex items-center gap-1.5 bg-[#0e3e26] text-white px-3.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-4">
          <Sparkles size={11} className="fill-white/10" />
          Deal of the Day
        </div>
        <h2 className="text-xl md:text-2xl font-black text-[#0e3e26] leading-tight mb-2">
          Mega Grocery Sale Live Now!
        </h2>
        <p className="text-sm md:text-base font-bold text-emerald-800">
          30% Flat Discount on all Juice Items!
        </p>
      </div>

      {/* Ticking Countdown Timer */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0e3e26] rounded-2xl flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md border border-green-800">
            {hrs}
          </div>
          <span className="text-[9px] text-[#0e3e26] font-extrabold tracking-widest uppercase mt-2">Hrs</span>
        </div>

        <span className="text-[#0e3e26] font-black text-xl md:text-2xl -mt-5">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0e3e26] rounded-2xl flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md border border-green-800">
            {mins}
          </div>
          <span className="text-[9px] text-[#0e3e26] font-extrabold tracking-widest uppercase mt-2">Mins</span>
        </div>

        <span className="text-[#0e3e26] font-black text-xl md:text-2xl -mt-5">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0e3e26] rounded-2xl flex items-center justify-center text-white text-lg md:text-xl font-black shadow-md border border-green-800">
            {secs}
          </div>
          <span className="text-[9px] text-[#0e3e26] font-extrabold tracking-widest uppercase mt-2">Secs</span>
        </div>
      </div>
    </div>
  );
}

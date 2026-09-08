'use client';

import React from 'react';
import { Store, ArrowRight, ShieldCheck, Zap, Heart, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 pt-4 pb-2">
      <div className="w-full bg-white dark:bg-slate-900 rounded-[28px] border border-gray-100 dark:border-slate-800 shadow-premium overflow-hidden flex flex-col lg:flex-row items-center">
        
        {/* Left Text Pane */}
        <div className="flex-1 p-7 md:p-10 lg:p-14 flex flex-col items-start text-left gap-5">
          
          {/* Hyperlocal Badge */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-[#0e3e26] dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase">
            <Store size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Hyperlocal Store-to-Doorstep Platform</span>
          </div>
          
          {/* Main Messaging Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Shop Direct From <br />
            <span className="text-[#0e3e26] dark:text-emerald-400 underline decoration-amber-400 decoration-4 underline-offset-4">
              Your Nearby Local Stores
            </span>
          </h1>
          
          {/* Subheading Answering What Makes e-LocalKart Different */}
          <p className="text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm md:text-base max-w-lg leading-relaxed">
            e-LocalKart connects you directly to verified neighborhood Kirana shops, bakeries, and fresh produce markets. Delivered in <strong>15–45 minutes</strong> while empowering your local community.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mt-1">
            <Link 
              href="#products" 
              className="px-7 py-3.5 bg-[#0e3e26] hover:bg-emerald-800 text-white font-black rounded-full text-xs tracking-wider flex items-center gap-2 uppercase shadow-lg shadow-[#0e3e26]/20 transition cursor-pointer"
            >
              Explore Nearby Products <ArrowRight size={15} />
            </Link>
            <Link 
              href="/stores" 
              className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-black rounded-full text-xs tracking-wider flex items-center gap-2 uppercase transition duration-200 shadow-xs cursor-pointer"
            >
              <Store size={14} className="text-emerald-600" />
              Find Stores Near Me
            </Link>
          </div>

          {/* Trust Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 border-t border-gray-100 dark:border-slate-800/80 pt-4 w-full text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>15-45 Min Express</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Verified Shops</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
              <Heart size={14} className="text-red-500 fill-red-500/20 shrink-0" />
              <span>Support Kiranas</span>
            </div>
          </div>
        </div>

        {/* Right Graphic Pane */}
        <div className="flex-1 w-full lg:h-[450px] relative self-stretch overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div 
            className="w-full h-64 lg:h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800")' 
            }}
          />
          <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white dark:from-slate-900 to-transparent" />

          {/* Floating Badge 1 */}
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Zap size={16} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase">Hyperlocal Express</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">15 Min Delivery</p>
            </div>
          </div>

          {/* Floating Badge 2 */}
          <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <MapPin size={16} />
            </div>
            <div className="text-left leading-tight">
              <p className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase">Neighborhood Stores</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">500+ Local Kiranas</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

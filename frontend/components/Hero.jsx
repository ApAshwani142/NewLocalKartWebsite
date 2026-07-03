'use client';

import React from 'react';
import { Leaf, ArrowRight, Phone, Check } from 'lucide-react';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 pt-6 pb-2">
      <div className="w-full bg-white rounded-[28px] border border-gray-100 shadow-premium overflow-hidden flex flex-col lg:flex-row items-center">
        {/* Left Text Pane */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col items-start text-left gap-6">
          <div className="flex items-center gap-1.5 bg-[#fef5ec] border border-[#fce6d1] text-[#b35900] px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase">
            <Leaf size={14} className="text-[#f27a21]" />
            Purely Hyperlocal & Fresh
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.08]">
            Fresh Groceries <br />
            Delivered to <br />
            Your Doorstep
          </h1>
          
          <p className="text-gray-500 font-medium text-sm md:text-base max-w-lg leading-relaxed">
            Buy your daily needs from Ara's top local stores. Farm-fresh vegetables, dairy, bakery, meat, and essentials shipped directly in under 40 minutes.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link href="/products" className="px-7 py-4 bg-brand-accent hover:bg-orange-600 transition text-white font-bold rounded-full text-xs tracking-wider flex items-center gap-2 uppercase shadow-lg shadow-orange-500/20 cursor-pointer">
              Shop Now <ArrowRight size={15} />
            </Link>
            <a
              href="tel:+919876543210"
              className="px-7 py-4 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-full text-xs tracking-wider flex items-center gap-2 uppercase transition duration-200 shadow-sm"
            >
              Call to Order
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-4 border-t border-gray-50 pt-5 w-full text-xs font-black text-gray-400 tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="bg-[#e8f5e9] text-[#10b981] p-0.5 rounded-full">
                <Check size={12} className="stroke-[3.5]" />
              </span>
              100% QUALITY ASSURANCE
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#e8f5e9] text-[#10b981] p-0.5 rounded-full">
                <Check size={12} className="stroke-[3.5]" />
              </span>
              CASH ON DELIVERY
            </div>
          </div>
        </div>

        {/* Right Graphic Pane */}
        <div className="flex-1 w-full lg:h-[480px] relative self-stretch overflow-hidden flex items-center justify-center bg-gray-50">
          {/* Background shelves image */}
          <div 
            className="w-full h-64 lg:h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800")' 
            }}
          />
          {/* Left side soft gradient mask */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />

          {/* Floating badge 1: Top Right */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-premium border border-gray-100 flex items-center gap-2">
            <span className="text-xl bg-purple-50 p-1.5 rounded-xl">🍇</span>
            <div className="text-left leading-tight">
              <p className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase">100% Organic</p>
              <p className="text-xs font-black text-brand-dark">Farm Fresh</p>
            </div>
          </div>

          {/* Floating badge 2: Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-premium border border-gray-100 flex items-center gap-2">
            <span className="text-lg bg-red-50 p-1.5 rounded-xl">📍</span>
            <div className="text-left leading-tight">
              <p className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase">Local Stores</p>
              <p className="text-xs font-black text-brand-dark">Ara Partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

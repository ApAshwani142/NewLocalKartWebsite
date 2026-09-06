'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Clock } from 'lucide-react';

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('localkart_recently_viewed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentProducts(parsed.slice(0, 4));
        }
      }
    } catch (e) {
      console.warn('Error reading recently viewed:', e);
    }
  }, []);

  if (!recentProducts || recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6 text-left">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-wider uppercase flex items-center gap-1.5">
            <Clock size={18} className="text-emerald-600 dark:text-emerald-400" />
            Recently Viewed
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide mt-1">
            Pick up right where you left off from your recent browsing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {recentProducts.map((product) => (
          <ProductCard key={product._id} product={product} layout="vertical" />
        ))}
      </div>
    </section>
  );
}

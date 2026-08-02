'use client';

import React, { useState } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/mockData';

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState(PRODUCTS.slice(0, 3));

  const handleRemove = (productId) => {
    setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 flex items-center justify-between text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-3">
              <Heart size={14} className="fill-rose-500" />
              Saved Favourites
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Saved Wishlist ({wishlistProducts.length})
            </h1>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider hover:underline"
          >
            Explore All Products <ArrowRight size={14} />
          </Link>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-full text-rose-500">
              <Heart size={36} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm font-medium">
              Save your favorite daily groceries and essential items here to re-order instantly anytime.
            </p>
            <Link
              href="/products"
              className="mt-2 bg-[#0e3e26] hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlistProducts.map((product) => (
              <ProductCard key={product._id} product={product} layout="vertical" />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

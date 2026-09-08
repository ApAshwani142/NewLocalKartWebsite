'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';

export default function BottomNav({ onCartClick }) {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const isHomeActive = pathname === '/';
  const isCategoriesActive = pathname.startsWith('/products') || pathname.startsWith('/stores');
  const isAccountActive = pathname.startsWith('/account') || pathname.startsWith('/settings');

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white dark:bg-slate-900 border-t border-gray-200/90 dark:border-slate-800 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_12px_rgba(0,0,0,0.4)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            isHomeActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <Home
            size={22}
            className={isHomeActive ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : 'stroke-[1.8]'}
          />
          <span className="text-[11px] tracking-tight">Home</span>
        </Link>

        {/* 2. Categories / Products */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            isCategoriesActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid
            size={22}
            className={isCategoriesActive ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : 'stroke-[1.8]'}
          />
          <span className="text-[11px] tracking-tight">Categories</span>
        </Link>

        {/* 3. Account (Direct link, NO dropdown!) */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center py-1 gap-1 transition-colors ${
            isAccountActive
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
          }`}
        >
          <User
            size={22}
            className={isAccountActive ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : 'stroke-[1.8]'}
          />
          <span className="text-[11px] tracking-tight">Account</span>
        </Link>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={onCartClick}
          className="flex flex-col items-center justify-center py-1 gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart size={22} className="stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Cart</span>
        </button>
      </div>
    </nav>
  );
}

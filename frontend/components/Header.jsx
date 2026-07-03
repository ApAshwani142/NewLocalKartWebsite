'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, MapPin, Search, Phone, User, LogOut } from 'lucide-react';

export default function Header({ onCartClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header className="w-full bg-white z-50 sticky top-0 shadow-xs border-b border-gray-100/80">
      {/* Main Navigation Bar */}
      <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative flex items-center justify-center p-2 rounded-lg border border-gray-100 bg-white shadow-sm">
              <span className="text-orange-500 font-extrabold text-2xl tracking-tighter flex items-center gap-0.5">
                e-
                <span className="text-[#0e3e26] font-black italic">Local</span>
                <span className="text-[#e25822]">Kart</span>
              </span>
            </div>
          </Link>

          {/* Location Delivery Selector */}
          <Link href="/addresses" className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100/80 transition duration-200 px-3.5 py-2.5 rounded-full border border-gray-200 cursor-pointer">
            <MapPin size={18} className="text-green-600" />
            <div className="text-left leading-tight hidden xs:block">
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Deliver To</p>
              <p className="text-xs font-bold text-gray-800 flex items-center gap-0.5">
                Ara, Bihar <span className="text-[10px] text-gray-500">▼</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Pill Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:max-w-md relative">
          <input
            type="text"
            placeholder="Search groceries, bakery, medicines..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white text-sm text-gray-800 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition duration-200 shadow-sm"
          />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark transition cursor-pointer flex items-center justify-center p-0 bg-transparent border-0">
            <Search size={18} />
          </button>
        </form>

        {/* Links, Auth & Cart Controls */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-end">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold tracking-wider text-gray-500">
            <Link href="/" className="hover:text-brand-dark transition duration-200">
              HOME
            </Link>
            <Link href="/products" className="hover:text-brand-dark transition duration-200">
              PRODUCTS
            </Link>
            <Link href="/orders" className="hover:text-brand-dark transition duration-200">
              TRACK ORDER
            </Link>
            <Link href="/contact" className="hover:text-brand-dark transition duration-200">
              CONTACT
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Logged in state avatar */}
                <Link href="/account" className="relative group flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 transition px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-black text-sm flex items-center justify-center uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left text-[11px] leading-tight hidden xs:block">
                    <p className="font-bold text-gray-700">{user.name}</p>
                    <p className="text-gray-400 font-semibold uppercase tracking-wider">{user.role}</p>
                  </div>
                </Link>
                <button 
                  onClick={logout} 
                  title="Log Out"
                  className="p-1.5 text-gray-400 hover:text-red-500 transition duration-150 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold rounded-full text-xs tracking-wider transition duration-200 uppercase"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 bg-brand-dark hover:bg-brand-medium text-white font-bold rounded-full text-xs tracking-wider transition duration-200 uppercase shadow-md shadow-brand-dark/10"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="flex items-center gap-2 bg-[#e8f5e9] hover:bg-[#dcfce7] transition duration-200 text-brand-dark px-5 py-2.5 rounded-full border border-green-200 font-bold text-xs tracking-wider shadow-sm uppercase cursor-pointer"
            >
              <ShoppingCart size={16} className="text-brand-dark font-black" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

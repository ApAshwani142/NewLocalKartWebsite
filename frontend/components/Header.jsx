'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, MapPin, Search, Phone, User, LogOut, Menu, X } from 'lucide-react';

export default function Header({ onCartClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Main Navigation Bar (Row 1) */}
      <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
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
                Bihar <span className="text-[10px] text-gray-500">▼</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Pill Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:flex-1 md:max-w-xl relative">
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

        {/* Auth & Cart Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
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
              <div className="flex items-center gap-2">
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
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="flex items-center gap-2 bg-[#e8f5e9] hover:bg-[#dcfce7] transition duration-200 text-brand-dark px-5 py-2.5 rounded-full border border-green-200 font-bold text-xs tracking-wider shadow-sm uppercase cursor-pointer"
            >
              <ShoppingCart size={16} className="text-brand-dark font-black" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-dark hover:bg-gray-100 rounded-full cursor-pointer transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar for Desktop (Row 2) */}
      <div className="w-full bg-[#f8f9fa] border-t border-b border-gray-100/60 py-2.5 hidden md:block">
        <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-8 text-xs font-black tracking-wider text-gray-600 uppercase whitespace-nowrap">
            <Link href="/" className="hover:text-brand-dark transition duration-200">
              Home
            </Link>
            <Link href="/products" className="hover:text-brand-dark transition duration-200">
              Products
            </Link>
            <Link href="/orders" className="hover:text-brand-dark transition duration-200">
              Track Order
            </Link>
            <Link href="/contact" className="hover:text-brand-dark transition duration-200">
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-5 text-xs font-bold text-gray-500 whitespace-nowrap">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">Quick Categories:</span>
            <Link href="/products?category=Vegetables" className="hover:text-brand-dark transition">🥦 Vegetables</Link>
            <Link href="/products?category=Fruits" className="hover:text-brand-dark transition">🍎 Fruits</Link>
            <Link href="/products?category=Cloth" className="hover:text-brand-dark transition">👕 Cloth</Link>
            <Link href="/products?category=Electronic" className="hover:text-brand-dark transition">⚡ Electronic</Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      {/* Mobile Drawer Menu */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="text-lg font-black text-brand-dark uppercase tracking-wide">Navigation</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-4 py-6 text-sm font-extrabold text-gray-700 tracking-wide uppercase">
            <Link href="/" className="hover:text-brand-dark py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="hover:text-brand-dark py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
              Products
            </Link>
            <Link href="/orders" className="hover:text-brand-dark py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
              Track Order
            </Link>
            <Link href="/contact" className="hover:text-brand-dark py-2 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
          </nav>
          
          <div className="mt-auto border-t border-gray-100 pt-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Quick Categories</p>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-600">
              <Link href="/products?category=Vegetables" className="hover:text-brand-dark" onClick={() => setIsMobileMenuOpen(false)}>🥦 Vegetables</Link>
              <Link href="/products?category=Fruits" className="hover:text-brand-dark" onClick={() => setIsMobileMenuOpen(false)}>🍎 Fruits</Link>
              <Link href="/products?category=Cloth" className="hover:text-brand-dark" onClick={() => setIsMobileMenuOpen(false)}>👕 Cloth</Link>
              <Link href="/products?category=Electronic" className="hover:text-brand-dark" onClick={() => setIsMobileMenuOpen(false)}>⚡ Electronic</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

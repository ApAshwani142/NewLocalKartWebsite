'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/hooks/useTheme';
import { ShoppingCart, MapPin, Search, Phone, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

export default function Header({ onCartClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <header
      className="w-full z-50 sticky top-0 shadow-xs border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Main Navigation Bar (Row 1) */}
      <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div
              className="relative flex items-center justify-center p-2 rounded-lg border shadow-sm transition-colors duration-300"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
            >
              <span className="text-orange-500 font-extrabold text-2xl tracking-tighter flex items-center gap-0.5">
                e-
                <span className="text-[#0e3e26] font-black italic">Local</span>
                <span className="text-[#e25822]">Kart</span>
              </span>
            </div>
          </Link>

          {/* Location Delivery Selector */}
          <Link
            href="/addresses"
            className="flex items-center gap-2 transition duration-200 px-3.5 py-2.5 rounded-full border cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-surface-2)',
              borderColor: 'var(--border-color)',
            }}
          >
            <MapPin size={18} className="text-green-600" />
            <div className="text-left leading-tight hidden xs:block">
              <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>Deliver To</p>
              <p className="text-xs font-bold flex items-center gap-0.5" style={{ color: 'var(--text-primary)' }}>
                Bihar <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>▼</span>
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
            className="w-full pl-11 pr-4 py-3 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-[#0e3e26] focus:border-transparent transition duration-200 shadow-sm"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
            }}
          />
          <button
            type="submit"
            className="absolute left-4 top-1/2 -translate-y-1/2 transition cursor-pointer flex items-center justify-center p-0 bg-transparent border-0"
            style={{ color: 'var(--text-muted)' }}
          >
            <Search size={18} />
          </button>
        </form>

        {/* Auth & Cart Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Logged in state avatar */}
                <Link
                  href="/account"
                  className="relative group flex items-center gap-1.5 transition px-3 py-1.5 rounded-full border cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-color)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-black text-sm flex items-center justify-center uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left text-[11px] leading-tight hidden xs:block">
                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                    <p className="font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-1.5 hover:text-red-500 transition duration-150 rounded-full hover:bg-red-50/10 cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 border font-bold rounded-full text-xs tracking-wider transition duration-200 uppercase"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
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
              className="flex items-center gap-2 transition duration-200 text-brand-dark px-5 py-2.5 rounded-full border font-bold text-xs tracking-wider shadow-sm uppercase cursor-pointer"
              style={{
                backgroundColor: isDark ? 'rgba(16,185,129,0.12)' : '#e8f5e9',
                borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#bbf7d0',
              }}
            >
              <ShoppingCart size={16} className="text-brand-dark font-black" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ===== THEME TOGGLE BUTTON ===== */}
              <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark mode"
                className="relative flex items-center cursor-pointer select-none shrink-0"
                style={{ width: '56px', height: '28px' }}
              >
                {/* Track */}
                <span
                  className="absolute inset-0 rounded-full transition-all duration-500 ease-in-out border"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, #0f1923 0%, #1a2e4a 100%)'
                      : 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
                    borderColor: isDark ? '#1e3a2f' : '#fcd34d',
                    boxShadow: isDark
                      ? '0 0 0 1px rgba(16,185,129,0.2), inset 0 1px 3px rgba(0,0,0,0.4)'
                      : '0 0 0 1px rgba(251,191,36,0.4), inset 0 1px 3px rgba(255,255,255,0.6)',
                  }}
                />
                {/* Stars (dark) */}
                {isDark && (
                  <>
                    <span className="absolute left-2 top-1.5 w-0.5 h-0.5 rounded-full bg-white/70" />
                    <span className="absolute left-3.5 top-3 w-0.5 h-0.5 rounded-full bg-white/50" />
                    <span className="absolute left-2.5 top-4 w-px h-px rounded-full bg-white/60" />
                  </>
                )}
                {/* Thumb */}
                <span
                  className="absolute top-0.5 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-md"
                  style={{
                    width: '22px',
                    height: '22px',
                    left: isDark ? 'calc(100% - 24px)' : '3px',
                    background: isDark
                      ? 'radial-gradient(circle at 35% 35%, #e2e8f0, #94a3b8)'
                      : 'radial-gradient(circle at 35% 35%, #fef3c7, #f59e0b)',
                    boxShadow: isDark
                      ? '0 1px 4px rgba(0,0,0,0.5), inset -2px -1px 0 #64748b'
                      : '0 1px 6px rgba(251,191,36,0.6), 0 0 12px rgba(251,191,36,0.3)',
                  }}
                >
                  {isDark
                    ? <Moon size={11} strokeWidth={2} className="text-slate-800" />
                    : <Sun size={12} strokeWidth={2.5} className="text-amber-700" />
                  }
                </span>
              </button>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100/10 rounded-full cursor-pointer transition"
              aria-label="Toggle navigation menu"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar for Desktop (Row 2) */}
      <div
        className="w-full border-t border-b py-2.5 hidden md:block transition-colors duration-300"
        style={{ backgroundColor: 'var(--subnav-bg)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-8 text-xs font-black tracking-wider uppercase whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/" className="hover:text-brand-dark transition duration-200">Home</Link>
            <Link href="/products" className="hover:text-brand-dark transition duration-200">Products</Link>
            <Link href="/orders" className="hover:text-brand-dark transition duration-200">Track Order</Link>
            <Link href="/contact" className="hover:text-brand-dark transition duration-200">Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-5 text-xs font-bold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
            <span className="text-[10px] uppercase tracking-widest font-extrabold" style={{ color: 'var(--text-muted)' }}>Quick Categories:</span>
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
      <div
        className={`fixed top-0 right-0 h-full w-72 shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-lg font-black text-brand-dark uppercase tracking-wide">Navigation</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100/10 cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile theme toggle */}
          <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button
              onClick={toggleTheme}
              className="relative flex items-center cursor-pointer select-none"
              style={{ width: '48px', height: '26px' }}
            >
              <span
                className="absolute inset-0 rounded-full border transition-all duration-500"
                style={{
                  background: isDark ? 'linear-gradient(135deg,#0f1923,#1a2e4a)' : 'linear-gradient(135deg,#fef9c3,#fde68a)',
                  borderColor: isDark ? '#1e3a2f' : '#fcd34d',
                }}
              />
              <span
                className="absolute top-0.5 rounded-full flex items-center justify-center transition-all duration-500 shadow-md"
                style={{
                  width: '20px', height: '20px',
                  left: isDark ? 'calc(100% - 22px)' : '3px',
                  background: isDark ? 'radial-gradient(circle at 35% 35%,#e2e8f0,#94a3b8)' : 'radial-gradient(circle at 35% 35%,#fef3c7,#f59e0b)',
                }}
              >
                {isDark ? <Moon size={10} className="text-slate-800" /> : <Sun size={10} className="text-amber-700" />}
              </span>
            </button>
          </div>


          <nav className="flex flex-col gap-4 py-6 text-sm font-extrabold tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
            <Link href="/" className="hover:text-brand-dark py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" className="hover:text-brand-dark py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            <Link href="/orders" className="hover:text-brand-dark py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Track Order</Link>
            <Link href="/contact" className="hover:text-brand-dark py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </nav>

          <div className="mt-auto border-t pt-6" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Quick Categories</p>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
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

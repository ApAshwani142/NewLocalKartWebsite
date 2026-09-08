'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/hooks/useTheme';
import { useLocation } from '@/hooks/useLocation';
import LocationModal from '@/components/LocationModal';
import BottomNav from '@/components/BottomNav';
import { 
  ShoppingCart, Search, User, LogOut, Menu, X, Sun, Moon, 
  ChevronDown, Package, MapPin, Heart, Settings, Bell, 
  Bot, HelpCircle, Info, PhoneCall, Store, ChevronRight
} from 'lucide-react';

export default function Header({ onCartClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { location, isLocationPickerOpen, setIsLocationPickerOpen } = useLocation();
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
    <>
      <header
        className="w-full z-40 sticky top-0 shadow-xs border-b"
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (>= md): Full Nav with Logo, Address, Search, Actions & Subnav */}
        {/* ========================================================================= */}
        <div className="hidden md:block w-full">
          <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-5">
            {/* Logo & Location */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/" className="flex items-center">
                <div
                  className="relative flex items-center justify-center p-2 rounded-xl border shadow-xs"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
                >
                  <span className="text-orange-500 font-extrabold text-2xl tracking-tighter flex items-center gap-0.5">
                    e-
                    <span className="text-[#0e3e26] dark:text-emerald-400 font-black italic">Local</span>
                    <span className="text-[#e25822]">Kart</span>
                  </span>
                </div>
              </Link>

              {/* Delivery Location Selector */}
              <button
                type="button"
                onClick={() => setIsLocationPickerOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border cursor-pointer group hover:border-emerald-500/50 shadow-xs text-left"
                style={{
                  backgroundColor: 'var(--bg-surface-2)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="leading-tight">
                  <p className="text-[10px] font-black tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                    Delivering To
                  </p>
                  <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 max-w-[140px]">
                    {location.area || 'Grand Trunk Road'}
                  </p>
                  <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {location.city || 'Ara'}
                    <ChevronDown size={12} className="text-emerald-500 shrink-0 group-hover:translate-y-0.5" />
                  </p>
                </div>
              </button>
            </div>

            {/* Pill Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
              <input
                type="text"
                placeholder="Search groceries, fresh fruits, daily essentials..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-[#0e3e26] focus:border-transparent shadow-xs"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)',
                }}
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center p-0 bg-transparent border-0"
                style={{ color: 'var(--text-muted)' }}
              >
                <Search size={18} />
              </button>
            </form>

            {/* Desktop Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Account Direct Link (NO Dropdown!) */}
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 p-1.5 px-3 rounded-full border cursor-pointer shadow-xs hover:border-emerald-500"
                  style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-color)' }}
                  title="My Account"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0e3e26] to-emerald-500 text-white font-black text-sm flex items-center justify-center uppercase shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left text-[11px] leading-tight hidden lg:block">
                    <p className="font-extrabold max-w-[100px] truncate" style={{ color: 'var(--text-primary)' }}>
                      {user.name}
                    </p>
                    <p className="font-semibold uppercase text-[9px] tracking-wider text-emerald-600 dark:text-emerald-400">
                      Account
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 border font-extrabold rounded-full text-xs tracking-wider uppercase"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-[#0e3e26] hover:bg-emerald-800 text-white font-extrabold rounded-full text-xs tracking-wider uppercase shadow-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Cart Button */}
              <button
                type="button"
                onClick={onCartClick}
                className="flex items-center gap-2 text-brand-dark px-4 py-2 rounded-full border font-bold text-xs tracking-wider shadow-xs uppercase cursor-pointer"
                style={{
                  backgroundColor: isDark ? 'rgba(16,185,129,0.12)' : '#e8f5e9',
                  borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#bbf7d0',
                }}
              >
                <ShoppingCart size={16} className="text-brand-dark font-black" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Instant Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark mode"
                className="relative flex items-center cursor-pointer select-none shrink-0"
                style={{ width: '56px', height: '28px' }}
              >
                <span
                  className="absolute inset-0 rounded-full border"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, #0f1923 0%, #1a2e4a 100%)'
                      : 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
                    borderColor: isDark ? '#1e3a2f' : '#fcd34d',
                  }}
                />
                <span
                  className="absolute top-0.5 rounded-full flex items-center justify-center shadow-md"
                  style={{
                    width: '22px',
                    height: '22px',
                    left: isDark ? 'calc(100% - 24px)' : '3px',
                    background: isDark ? '#94a3b8' : '#f59e0b',
                  }}
                >
                  {isDark ? (
                    <Moon size={11} strokeWidth={2} className="text-slate-900" />
                  ) : (
                    <Sun size={12} strokeWidth={2.5} className="text-amber-900" />
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Subnav Row for Desktop */}
          <div
            className="w-full border-t py-2"
            style={{ backgroundColor: 'var(--subnav-bg)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
              <nav className="flex items-center gap-8 text-xs font-black tracking-wider uppercase whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                <Link href="/" className="hover:text-emerald-600">Home</Link>
                <Link href="/products" className="hover:text-emerald-600">All Products</Link>
                <Link href="/stores" className="hover:text-emerald-600">Nearby Stores</Link>
                <Link href="/orders" className="hover:text-emerald-600">Track Order</Link>
                <Link href="/chatbot" className="hover:text-emerald-600">AI Assistant</Link>
                <Link href="/about-us" className="hover:text-emerald-600">About Us</Link>
                <Link href="/contact-us" className="hover:text-emerald-600">Contact Us</Link>
                <Link href="/help-center" className="hover:text-emerald-600">Help Center</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< md): Reorganized Header as Requested                     */}
        {/* Top: Logo (Left) | Address Selection (Center) | Menu (Right)             */}
        {/* Just Under: Full-width Search Bar                                         */}
        {/* ========================================================================= */}
        <div className="md:hidden w-full px-3.5 py-2.5 flex flex-col gap-2">
          {/* Top Row: Logo, Address, Menu Toggle */}
          <div className="w-full flex items-center justify-between gap-2">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <div
                className="flex items-center justify-center px-2 py-1 rounded-xl border shadow-xs"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
              >
                <span className="text-orange-500 font-extrabold text-xl tracking-tighter flex items-center gap-0.5">
                  e-
                  <span className="text-[#0e3e26] dark:text-emerald-400 font-black italic">Local</span>
                  <span className="text-[#e25822]">Kart</span>
                </span>
              </div>
            </Link>

            {/* Address Selection (Center) */}
            <button
              type="button"
              onClick={() => setIsLocationPickerOpen(true)}
              className="flex-1 flex items-center justify-between px-2.5 py-1 rounded-xl border cursor-pointer hover:border-emerald-500 shadow-xs max-w-[210px] overflow-hidden text-left"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="leading-none truncate pr-1">
                <p className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Delivering To
                </p>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {location.area || 'Grand Trunk Road'}
                </p>
              </div>
              <ChevronDown size={14} className="text-emerald-500 shrink-0" />
            </button>

            {/* Hover-Menu Button (Right) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl border flex items-center justify-center cursor-pointer shadow-xs shrink-0"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Just Under: Full-width Search Bar */}
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search groceries, essentials..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0e3e26] shadow-xs"
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center p-0 bg-transparent border-0"
              style={{ color: 'var(--text-muted)' }}
            >
              <Search size={15} />
            </button>
          </form>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE HOVER-MENU / DRAWER: Houses All Other Links                         */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl z-50 transform md:hidden flex flex-col justify-between overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="p-5 flex flex-col gap-5">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-black text-xl tracking-tighter">e-LocalKart</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-full border hover:bg-gray-100/10 cursor-pointer"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Title & Status */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Navigation
            </span>
          </div>

          {/* Theme Switcher Row */}
          <div
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-color)' }}
          >
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="relative flex items-center cursor-pointer select-none"
              style={{ width: '48px', height: '24px' }}
            >
              <span
                className="absolute inset-0 rounded-full border"
                style={{
                  background: isDark ? '#1a2e4a' : '#fde68a',
                  borderColor: isDark ? '#1e3a2f' : '#fcd34d',
                }}
              />
              <span
                className="absolute top-0.5 rounded-full flex items-center justify-center shadow-xs"
                style={{
                  width: '20px',
                  height: '20px',
                  left: isDark ? 'calc(100% - 22px)' : '2px',
                  background: isDark ? '#94a3b8' : '#f59e0b',
                }}
              >
                {isDark ? <Moon size={10} className="text-slate-900" /> : <Sun size={11} className="text-amber-900" />}
              </span>
            </button>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-1 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            <Link
              href="/stores"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/20"
            >
              <Store size={16} className="text-emerald-600" />
              Nearby Partner Stores
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/20"
            >
              <Package size={16} className="text-blue-500" />
              Track Orders
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/20"
            >
              <Heart size={16} className="text-red-500" />
              Wishlist
            </Link>

            <Link
              href="/notifications"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/20"
            >
              <Bell size={16} className="text-amber-500" />
              Notifications
            </Link>

            <Link
              href="/addresses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/20"
            >
              <MapPin size={16} className="text-emerald-500" />
              Saved Delivery Addresses
            </Link>

            <Link
              href="/chatbot"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/20"
            >
              <Bot size={16} className="text-indigo-500" />
              Chat Support (AI Bot)
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50/20"
            >
              <Settings size={16} className="text-slate-500" />
              Settings & Preferences
            </Link>

            <div className="my-2 border-t" style={{ borderColor: 'var(--border-color)' }} />

            <Link
              href="/about-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500"
            >
              <Info size={15} />
              About Us
            </Link>

            <Link
              href="/contact-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500"
            >
              <PhoneCall size={15} />
              Contact Us
            </Link>
          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Image 1)                                   */}
      {/* ========================================================================= */}
      <BottomNav onCartClick={onCartClick} />

      {/* Global Location Picker Modal */}
      <LocationModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
      />
    </>
  );
}

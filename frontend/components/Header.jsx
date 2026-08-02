'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/hooks/useTheme';
import { useLocation } from '@/hooks/useLocation';
import LocationModal from '@/components/LocationModal';
import { 
  ShoppingCart, Search, User, LogOut, Menu, X, Sun, Moon, 
  ChevronDown, Package, MapPin, Heart, Settings, Shield, Bell
} from 'lucide-react';

export default function Header({ onCartClick }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { location, isLocationPickerOpen, setIsLocationPickerOpen } = useLocation();
  const router = useRouter();
  
  const [searchVal, setSearchVal] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = theme === 'dark';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div
              className="relative flex items-center justify-center p-2 rounded-xl border shadow-xs transition-colors duration-300"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
            >
              <span className="text-orange-500 font-extrabold text-2xl tracking-tighter flex items-center gap-0.5">
                e-
                <span className="text-[#0e3e26] dark:text-emerald-400 font-black italic">Local</span>
                <span className="text-[#e25822]">Kart</span>
              </span>
            </div>
          </Link>

          {/* Hyperlocal Real-time Location Delivery Selector */}
          <button
            type="button"
            onClick={() => setIsLocationPickerOpen(true)}
            className="flex items-center gap-2 transition duration-200 px-3.5 py-1.5 rounded-2xl border cursor-pointer group hover:border-emerald-500/50 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-surface-2)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="text-left leading-tight">
              <p className="text-[10px] font-black tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Delivering To
              </p>
              <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 max-w-[120px] sm:max-w-[160px]">
                {location.area || 'Grand Trunk Road'}
              </p>
              <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {location.city || 'Ara'}
                <ChevronDown size={12} className="text-emerald-500 shrink-0 group-hover:translate-y-0.5 transition-transform" />
              </p>
            </div>
          </button>
        </div>

        {/* Pill Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:flex-1 md:max-w-xl relative">
          <input
            type="text"
            placeholder="Search groceries, fresh fruits, daily essentials..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-[#0e3e26] focus:border-transparent transition duration-200 shadow-sm"
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
              /* PART 4: Logged in State with Avatar & Interactive Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border cursor-pointer transition shadow-xs hover:border-emerald-500"
                  style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-color)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0e3e26] to-emerald-500 text-white font-black text-sm flex items-center justify-center uppercase shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left text-[11px] leading-tight hidden sm:block">
                    <p className="font-extrabold max-w-[90px] truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                    <p className="font-semibold uppercase text-[9px] tracking-wider text-emerald-600 dark:text-emerald-400">Account</p>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 text-gray-500 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs font-black text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] font-semibold text-gray-400 truncate">{user.email || user.phone}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition"
                      >
                        <User size={15} className="text-emerald-600 dark:text-emerald-400" />
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition"
                      >
                        <Package size={15} className="text-emerald-600 dark:text-emerald-400" />
                        Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition"
                      >
                        <Heart size={15} className="text-emerald-600 dark:text-emerald-400" />
                        Wishlist
                      </Link>
                      <Link
                        href="/addresses"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition"
                      >
                        <MapPin size={15} className="text-emerald-600 dark:text-emerald-400" />
                        Saved Addresses
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition"
                      >
                        <Bell size={15} className="text-emerald-600 dark:text-emerald-400" />
                        Notifications
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-gray-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-black text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left cursor-pointer"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* PART 4: Guest User State with Login & Sign Up */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 border font-extrabold rounded-full text-xs tracking-wider transition duration-200 uppercase"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-[#0e3e26] hover:bg-emerald-800 text-white font-extrabold rounded-full text-xs tracking-wider transition duration-200 uppercase shadow-md shadow-[#0e3e26]/10"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="flex items-center gap-2 transition duration-200 text-brand-dark px-4 py-2 rounded-full border font-bold text-xs tracking-wider shadow-sm uppercase cursor-pointer"
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

      {/* Sub Navigation Bar for Desktop (Row 2) - Clean without duplicate categories */}
      <div
        className="w-full border-t border-b py-2.5 hidden md:block transition-colors duration-300"
        style={{ backgroundColor: 'var(--subnav-bg)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="w-full max-w-[95%] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-8 text-xs font-black tracking-wider uppercase whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/" className="hover:text-emerald-600 transition duration-200">Home</Link>
            <Link href="/products" className="hover:text-emerald-600 transition duration-200">All Products</Link>
            <Link href="/stores" className="hover:text-emerald-600 transition duration-200">Nearby Stores</Link>
            <Link href="/orders" className="hover:text-emerald-600 transition duration-200">Track Order</Link>
            <Link href="/about-us" className="hover:text-emerald-600 transition duration-200">About Us</Link>
            <Link href="/contact-us" className="hover:text-emerald-600 transition duration-200">Contact Us</Link>
            <Link href="/help-center" className="hover:text-emerald-600 transition duration-200">Help Center</Link>
          </nav>
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
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Navigation</span>
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

          <nav className="flex flex-col gap-3 py-6 text-sm font-extrabold tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
            <Link href="/" className="hover:text-emerald-600 py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" className="hover:text-emerald-600 py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
            <Link href="/stores" className="hover:text-emerald-600 py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Nearby Stores</Link>
            <Link href="/orders" className="hover:text-emerald-600 py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Track Order</Link>
            <Link href="/about-us" className="hover:text-emerald-600 py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact-us" className="hover:text-emerald-600 py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
            <Link href="/help-center" className="hover:text-emerald-600 py-2 border-b" style={{ borderColor: 'var(--border-color)' }} onClick={() => setIsMobileMenuOpen(false)}>Help Center</Link>
          </nav>
        </div>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
      />
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { 
  ArrowLeft, Search, ShoppingCart, ChevronRight, PhoneCall, Gift, 
  Calendar, Banknote, Smartphone, CreditCard, Languages, Heart, 
  Share2, Store, Package, MapPin, Settings, ShieldCheck, LogOut, 
  Camera, Check, X, Bell, User as UserIcon, Loader2
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, loading, logout, setUser } = useAuth();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active Interactive Modals
  const [activeModal, setActiveModal] = useState(null); // 'payLater' | 'upi' | 'language' | 'shared'
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [upiId, setUpiId] = useState('user@upi');
  const [savedUpiMsg, setSavedUpiMsg] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-xs font-bold text-gray-400">Loading Account...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSaveUpi = (e) => {
    e.preventDefault();
    setSavedUpiMsg(true);
    setTimeout(() => {
      setSavedUpiMsg(false);
      setActiveModal(null);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-900 dark:text-white font-sans">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header onCartClick={() => setIsCartOpen(true)} />
      </div>

      {/* Mobile Top App Bar (matching reference Image 2) */}
      <div className="md:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="p-1 -ml-1 text-slate-700 dark:text-slate-200 hover:text-slate-900"
            aria-label="Back"
          >
            <ArrowLeft size={22} className="stroke-[2.2]" />
          </button>
          <h1 className="text-base font-extrabold tracking-wider text-slate-900 dark:text-white uppercase">
            Account
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/products" className="text-slate-700 dark:text-slate-200">
            <Search size={22} className="stroke-[2.2]" />
          </Link>
          <button 
            type="button" 
            onClick={() => setIsCartOpen(true)} 
            className="text-slate-700 dark:text-slate-200 relative"
          >
            <ShoppingCart size={22} className="stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[10px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Account Body */}
      <main className="flex-1 w-full max-w-xl mx-auto md:py-8 px-4 md:px-0 flex flex-col gap-5">
        
        {/* ========================================================================= */}
        {/* 1. Profile Section Card (matching Image 2)                                */}
        {/* ========================================================================= */}
        {user ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 p-4 md:p-5 shadow-xs flex items-center justify-between mt-2 md:mt-0">
            <div className="flex items-center gap-4">
              {/* Avatar with Camera badge */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-emerald-200 dark:from-emerald-900 dark:to-teal-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-xs">
                  <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100 uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </span>
                </div>
                <Link
                  href="/settings"
                  className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-xs hover:text-emerald-600"
                  title="Edit profile photo"
                >
                  <Camera size={13} />
                </Link>
              </div>

              {/* Name & Phone/Email */}
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                  {user.name || 'LocalKart User'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.phone || user.email || '+91 9876543210'}
                </p>
              </div>
            </div>

            {/* Chevron link to Settings */}
            <Link 
              href="/settings" 
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              title="Account Settings"
            >
              <ChevronRight size={22} className="stroke-[2.2]" />
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col gap-4 mt-2 md:mt-0 text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-900/60 shadow-xs shrink-0">
                <UserIcon size={26} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Welcome to e-LocalKart
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Log in or sign up to manage your orders, addresses, and store payments.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link
                href="/login"
                className="py-2.5 text-center text-xs font-black uppercase rounded-xl bg-[#0e3e26] hover:bg-emerald-800 text-white shadow-xs transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="py-2.5 text-center text-xs font-black uppercase rounded-xl border border-gray-300 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. Quick Action Cards (Help Centre & Settings/Refer) (matching Image 2)   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/help-center"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-emerald-500/50 shadow-xs transition"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PhoneCall size={20} className="stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Help Centre</span>
          </Link>

          <Link
            href="/settings"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-emerald-500/50 shadow-xs transition"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Gift size={20} className="stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Settings & Refer</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 3. Section: My Payments (matching Image 2)                                */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-4 pt-4 pb-1">
            <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Payments
            </h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800/80 text-sm">
            {/* Pay Later */}
            <button
              type="button"
              onClick={() => setActiveModal('payLater')}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">e-LocalKart Pay Later</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

            {/* Personal Loans */}
            <button
              type="button"
              onClick={() => setActiveModal('loans')}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Banknote size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Instant Store Credit</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  New
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

            {/* Bank & UPI Details */}
            <button
              type="button"
              onClick={() => setActiveModal('upi')}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-blue-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Bank & UPI Details</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

            {/* Payment & Refund */}
            <Link
              href="/orders"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-sky-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Payment & Refund History</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. Section: My Activity (matching Image 2)                                */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-4 pt-4 pb-1">
            <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Activity
            </h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800/80 text-sm">
            {/* My Orders */}
            <Link
              href="/orders"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">My Orders & Tracking</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            {/* Saved Addresses */}
            <Link
              href="/addresses"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Saved Delivery Addresses</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            {/* Wishlisted Products */}
            <Link
              href="/wishlist"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <Heart size={20} className="text-rose-500 fill-rose-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Wishlisted Products</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            {/* Followed Shops */}
            <Link
              href="/stores"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <Store size={20} className="text-amber-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Followed Local Shops</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  New
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            {/* Change Language */}
            <button
              type="button"
              onClick={() => setActiveModal('language')}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Languages size={20} className="text-pink-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Change Language</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>{selectedLanguage}</span>
                <ChevronRight size={18} />
              </div>
            </button>

            {/* Shared Products */}
            <button
              type="button"
              onClick={() => setActiveModal('shared')}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Share2 size={20} className="text-purple-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Shared Products & Links</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. Section: Others / Account Management                                    */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-4 pt-4 pb-1">
            <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Others
            </h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800/80 text-sm">
            {/* Settings Page Link (working) */}
            <Link
              href="/settings"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-slate-600 dark:text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Settings & Security</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            {/* Chatbot Support Link */}
            <Link
              href="/chatbot"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <PhoneCall size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">24/7 AI Chat Support</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            {/* Privacy Policy */}
            <Link
              href="/privacy-policy"
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Privacy & Terms</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>

            {/* Logout / Login row */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-red-50/50 dark:hover:bg-red-950/20 transition cursor-pointer text-red-600 dark:text-red-400"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={20} className="shrink-0 stroke-[2]" />
                  <span className="font-bold">Log Out</span>
                </div>
                <ChevronRight size={18} className="text-red-400" />
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition cursor-pointer text-emerald-600 dark:text-emerald-400"
              >
                <div className="flex items-center gap-3">
                  <UserIcon size={20} className="shrink-0 stroke-[2]" />
                  <span className="font-bold">Log In or Sign Up</span>
                </div>
                <ChevronRight size={18} className="text-emerald-500" />
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS FOR ACCOUNTS SECTION                                    */}
      {/* ========================================================================= */}

      {/* 1. Pay Later Modal */}
      {activeModal === 'payLater' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">e-LocalKart Pay Later</h3>
            <p className="text-xs text-slate-500 mt-1">Shop today from your neighborhood store and pay on the 1st of next month with 0% interest.</p>

            <div className="my-5 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600">Approved Credit Limit</span>
                <p className="text-xl font-black text-purple-700 dark:text-purple-300">₹5,000</p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-purple-600 text-white">Active</span>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 2. Bank & UPI Details Modal */}
      {activeModal === 'upi' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <Smartphone size={20} />
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Bank &amp; UPI Details</h3>
            <p className="text-xs text-slate-500 mt-1">Your registered UPI ID for 1-click checkout and instantaneous order refund credits.</p>

            <form onSubmit={handleSaveUpi} className="my-4 flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-400">Primary UPI VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@oksbi"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {savedUpiMsg && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <Check size={14} /> UPI ID updated successfully!
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Save UPI ID
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Instant Store Credit Modal */}
      {activeModal === 'loans' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Banknote size={20} />
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Instant Grocery Credit</h3>
            <p className="text-xs text-slate-500 mt-1">Get flexible monthly store credit directly linked with your trusted neighborhood Kirana.</p>

            <div className="my-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                You are pre-approved for up to ₹15,000 monthly credit balance.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* 4. Language Selector Modal */}
      {activeModal === 'language' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Select Language</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 my-2">
              {['English', 'हिंदी (Hindi)', 'भोजपुरी (Bhojpuri)', 'বাংলা (Bengali)'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang.split(' ')[0]);
                    setActiveModal(null);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition ${
                    selectedLanguage === lang.split(' ')[0]
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{lang}</span>
                  {selectedLanguage === lang.split(' ')[0] && <Check size={16} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Shared Products Modal */}
      {activeModal === 'shared' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Share e-LocalKart</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500">Share e-LocalKart with friends & family to earn ₹50 grocery voucher on their first delivery.</p>

            <div className="my-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
              <span className="truncate">https://e-localkart.in/r/{user.name?.toLowerCase().replace(/\s+/g, '') || 'invite'}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://e-localkart.in/r/${user.name || 'invite'}`);
                  alert('Referral link copied to clipboard!');
                }}
                className="ml-2 px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase shrink-0"
              >
                Copy
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:block mt-8">
        <Footer />
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

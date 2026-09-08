'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';
import { 
  ArrowLeft, User, Mail, Phone, Lock, Moon, Sun, Bell, 
  Shield, Check, AlertCircle, Loader2, Save, LogOut, Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, loading, logout, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Password states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference switches
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(true);
  const [contactless, setContactless] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('Call before arrival.');

  // UI state
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_URL = '/api';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    if (password && password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const payload = { name, email, phone };
      if (password) payload.password = password;

      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Settings saved successfully!');
        setUser((prev) => ({ ...prev, ...data }));
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setErrorMessage(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMessage('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-xs font-bold text-gray-400">Loading Settings...</span>
        </div>
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-900 dark:text-white font-sans">
      <div className="hidden md:block">
        <Header onCartClick={() => setIsCartOpen(true)} />
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1 -ml-1 text-slate-700 dark:text-slate-200"
            aria-label="Back"
          >
            <ArrowLeft size={22} className="stroke-[2.2]" />
          </button>
          <h1 className="text-base font-extrabold tracking-wider text-slate-900 dark:text-white uppercase">
            Settings
          </h1>
        </div>
        <Link href="/account" className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          Done
        </Link>
      </div>

      <main className="flex-1 w-full max-w-xl mx-auto md:py-8 px-4 md:px-0 flex flex-col gap-5">
        {/* Status Alerts */}
        {message && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check size={16} />
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

        {/* 1. Appearance & Instant Theme */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">App Appearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isDark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold cursor-pointer hover:border-emerald-500"
            >
              Switch to {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* 2. Personal Information Form */}
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col gap-4 text-left">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Personal Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage your delivery contact details and name</p>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={13} /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={13} /> Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={13} /> New Password (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {password && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Profile Changes
          </button>
        </form>

        {/* 3. Notification Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col gap-4 text-left">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={16} className="text-amber-500" /> Notifications &amp; Alerts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Control order tracking and promotional updates</p>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Order Updates &amp; Tracking</p>
                <p className="text-slate-500 text-[11px]">Real-time courier status and OTP dispatch</p>
              </div>
              <input
                type="checkbox"
                checked={orderNotifs}
                onChange={(e) => setOrderNotifs(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Deals &amp; Flash Sales</p>
                <p className="text-slate-500 text-[11px]">Daily discounts on fresh groceries in your area</p>
              </div>
              <input
                type="checkbox"
                checked={promoNotifs}
                onChange={(e) => setPromoNotifs(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. Delivery Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col gap-4 text-left">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield size={16} className="text-emerald-500" /> Delivery Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Special instructions for your neighborhood delivery agent</p>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Contactless Doorstep Delivery</p>
              <p className="text-slate-500 text-[11px]">Rider leaves parcel at the door and rings bell</p>
            </div>
            <input
              type="checkbox"
              checked={contactless}
              onChange={(e) => setContactless(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Default Delivery Instruction
            </label>
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g. Call before arrival, leave at security"
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 5. Danger Zone */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl md:border border-red-100 dark:border-red-950/50 p-5 shadow-xs flex flex-col gap-3 text-left">
          <h3 className="text-xs font-bold uppercase text-red-600 dark:text-red-400">Account Session</h3>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-red-100/50"
          >
            <LogOut size={15} /> Log Out From All Devices
          </button>
        </div>
      </main>

      <div className="hidden md:block mt-8">
        <Footer />
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

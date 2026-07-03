'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Shield, MapPin, Zap, Store, Rocket, CreditCard } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();
  
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);

    const result = await login(emailOrPhone, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      
      {/* Left Pane (Green branding panel) */}
      <div className="w-full md:w-[45%] bg-[#105634] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between items-start text-left relative overflow-hidden">
        {/* Soft background glow circles */}
        <div className="absolute right-0 top-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-1/4 w-80 h-80 rounded-full bg-black/10 blur-3xl pointer-events-none" />

        {/* Top section: Logo and Tag */}
        <div className="flex flex-col items-start gap-4">
          <Link href="/">
            <div className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center justify-center">
              <span className="text-orange-500 font-extrabold text-xl tracking-tighter flex items-center gap-0.5">
                e-
                <span className="text-[#0e3e26] font-black italic">Local</span>
                <span className="text-[#e25822]">Kart</span>
              </span>
            </div>
          </Link>
          
          <div className="bg-white/10 border border-white/10 px-3.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 mt-2">
            <Store size={13} className="text-emerald-300" />
            Serving Ara, Bihar
          </div>
        </div>

        {/* Mid section: Catchphrase and feature checklist */}
        <div className="my-10 flex flex-col gap-6 max-w-sm">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Order Local, <br />
            Delivered Fast <span className="text-amber-400">⚡</span>
          </h2>
          <p className="text-emerald-100/75 text-xs font-semibold leading-relaxed">
            Sign in to access your orders, track deliveries, and discover shops near you.
          </p>

          <ul className="flex flex-col gap-4 text-xs font-bold text-emerald-100/90 mt-2">
            <li className="flex items-center gap-3.5">
              <span className="bg-white/10 p-1.5 rounded-lg text-emerald-300">
                <Zap size={14} className="fill-emerald-300/10" />
              </span>
              Same-hour delivery from local shops
            </li>
            <li className="flex items-center gap-3.5">
              <span className="bg-white/10 p-1.5 rounded-lg text-emerald-300">
                <Store size={14} />
              </span>
              50+ shops in Ara, Bihar
            </li>
            <li className="flex items-center gap-3.5">
              <span className="bg-white/10 p-1.5 rounded-lg text-emerald-300">
                <Rocket size={14} />
              </span>
              Free delivery for limited time
            </li>
            <li className="flex items-center gap-3.5">
              <span className="bg-white/10 p-1.5 rounded-lg text-emerald-300">
                <CreditCard size={14} />
              </span>
              Cash on delivery & UPI accepted
            </li>
          </ul>
        </div>

        {/* Bottom section: Stats footer row */}
        <div className="w-full grid grid-cols-3 border-t border-white/10 pt-6 gap-2 text-center md:text-left">
          <div>
            <p className="text-lg lg:text-xl font-black text-white">5,000+</p>
            <p className="text-[9px] font-bold text-emerald-200/60 uppercase tracking-wider mt-0.5">Happy Customers</p>
          </div>
          <div>
            <p className="text-lg lg:text-xl font-black text-white">50+</p>
            <p className="text-[9px] font-bold text-emerald-200/60 uppercase tracking-wider mt-0.5">Local Shops</p>
          </div>
          <div>
            <p className="text-lg lg:text-xl font-black text-white">60 min</p>
            <p className="text-[9px] font-bold text-emerald-200/60 uppercase tracking-wider mt-0.5">Avg Delivery</p>
          </div>
        </div>

      </div>

      {/* Right Pane (White Form panel) */}
      <div className="flex-1 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center relative">
        
        <div className="w-full max-w-sm flex flex-col items-stretch gap-6">
          {/* Titles */}
          <div className="text-left">
            <h3 className="text-2xl font-black text-gray-900 leading-tight flex items-center gap-1.5">
              Welcome back! 👋
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-1.5 uppercase tracking-wide">
              Sign in to your LocalKart account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3.5 rounded-2xl text-left">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            {/* Email/Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-extrabold tracking-widest uppercase">
                Email or Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white text-sm text-gray-800 rounded-2xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-transparent transition"
                  required
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-extrabold tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white text-sm text-gray-800 rounded-2xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-transparent transition"
                  required
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#105634] hover:bg-brand-dark text-white py-3.5 mt-2 rounded-2xl text-xs font-black tracking-widest uppercase flex items-center justify-center gap-1.5 transition shadow-lg shadow-[#105634]/15 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in ➔'}
            </button>
          </form>

          {/* Create account trigger */}
          <p className="text-xs font-semibold text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-black">
              Create one free ➔
            </Link>
          </p>

          {/* Secure details tags */}
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-[9px] font-black tracking-wide text-gray-500 uppercase">
              <Shield size={12} className="text-emerald-500 fill-emerald-500/10" /> Secure Login
            </span>
            <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-[9px] font-black tracking-wide text-gray-500 uppercase">
              <MapPin size={12} className="text-[#f27a21]" /> Ara, Bihar
            </span>
            <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-[9px] font-black tracking-wide text-gray-500 uppercase">
              <Zap size={12} className="text-emerald-500 fill-emerald-500/10" /> Instant Access
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

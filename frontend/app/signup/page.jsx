'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Banknote,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { user, signup, signupWithSupabase, sendOtp, loading: authLoading } = useAuth();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Verification states
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);

  // Language state
  const [selectedLang, setSelectedLang] = useState('English');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Step 1: Send Registration OTP
  const handleSendRegistrationOtp = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const result = await sendOtp(name, email, phone, password);
      if (result.success) {
        setOtpSent(true);
        setInfoMessage(result.message || 'Verification code sent to your email.');
      } else {
        setError(result.error || 'Failed to send verification OTP.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Create Customer Account
  const handleVerifyAndCreateAccount = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result = await signup(name, email, phone, password, otp);

      // Fallback if needed
      if (!result.success && signupWithSupabase) {
        result = await signupWithSupabase(email, password, name, phone, 'customer');
      }

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Account creation failed. Please check your verification code.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans bg-gray-50 text-slate-900 overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* ========================================== */}
      {/* LEFT SIDE PANEL (45% Desktop Branding & Storytelling) */}
      {/* ========================================== */}
      <div className="w-full md:w-[45%] bg-gradient-to-br from-[#092918] via-[#0e3e26] to-[#061f12] text-white p-8 md:p-12 lg:p-14 flex flex-col justify-between items-start relative overflow-hidden min-h-[500px] md:min-h-screen shadow-2xl">
        
        {/* Soft background glow orbs */}
        <div className="absolute -right-16 top-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute -left-16 bottom-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

        {/* 1. Header Logo */}
        <div className="w-full flex items-center justify-between z-10">
          <Link href="/" className="group flex items-center gap-2 transition transform active:scale-95">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/20 flex items-center justify-center">
              <span className="text-amber-500 font-extrabold text-xl tracking-tighter flex items-center gap-0.5">
                e-
                <span className="text-[#0e3e26] font-black italic">Local</span>
                <span className="text-[#e25822]">Kart</span>
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Hyperlocal Grocery
          </span>
        </div>

        {/* 2. Storytelling Hero Content */}
        <div className="my-8 md:my-auto z-10 max-w-lg flex flex-col gap-6 text-left">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.15] text-white">
              Freshness in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-300">
                Every Order 🌱
              </span>
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
              Create your free account to browse neighborhood stores, unlock exclusive deals, and order fresh daily essentials.
            </p>
          </div>

          {/* Value Propositions checklist */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-emerald-100/90">
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <MapPin size={15} />
              </div>
              <span className="leading-tight">Nearby Local Stores</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Clock size={15} />
              </div>
              <span className="leading-tight">Fast Delivery (10–20 min)</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <ShieldCheck size={15} />
              </div>
              <span className="leading-tight">Safe & Secure Payments</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-sm">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Banknote size={15} />
              </div>
              <span className="leading-tight">Cash on Delivery</span>
            </div>
          </div>

          {/* Hero Visual Asset Showcase */}
          <div className="relative mt-2 w-full h-44 sm:h-52 rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
            <Image
              src="/images/grocery_basket.png"
              alt="e-LocalKart Fresh Grocery Basket"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-center group-hover:scale-105 transition duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061f12]/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-[11px] font-bold">
              <span className="flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 size={13} className="text-emerald-400" /> 100% Fresh Guaranteed
              </span>
              <span className="text-emerald-200/80 text-[10px] font-medium uppercase tracking-wider">e-LocalKart Express</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Real Metrics Footer */}
        <div className="w-full z-10 grid grid-cols-3 gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
          <div>
            <p className="text-base sm:text-lg font-black text-white">50,000+</p>
            <p className="text-[10px] font-semibold text-emerald-200/70 uppercase tracking-wider">Happy Customers</p>
          </div>
          <div className="border-x border-white/10">
            <p className="text-base sm:text-lg font-black text-white">500+</p>
            <p className="text-[10px] font-semibold text-emerald-200/70 uppercase tracking-wider">Local Stores</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-black text-white">10–20 min</p>
            <p className="text-[10px] font-semibold text-emerald-200/70 uppercase tracking-wider">Avg Delivery</p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE PANEL (55% Desktop Clean Signup) */}
      {/* ========================================== */}
      <div className="flex-1 bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between items-center relative min-h-screen overflow-y-auto">
        
        {/* Top Header Row (Language Selector) */}
        <div className="w-full max-w-md flex justify-end items-center mb-4">
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <Globe size={14} className="text-emerald-600" />
              <span>{selectedLang}</span>
              <span className="text-[10px] text-gray-400">▼</span>
            </button>
          </div>
        </div>

        {/* Main Authentication Form Container */}
        <div className="w-full max-w-md my-auto flex flex-col items-stretch gap-5 py-4">
          
          {/* Card Title */}
          <div className="text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Create an Account 🎉
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Join e-LocalKart for free & get instant delivery
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2 animate-shake">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={!otpSent ? handleSendRegistrationOtp : handleVerifyAndCreateAccount}
            className="flex flex-col gap-3.5 text-left"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-11 pr-4 py-3 bg-white disabled:bg-gray-50 text-sm text-slate-900 rounded-2xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  required
                />
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-11 pr-4 py-3 bg-white disabled:bg-gray-50 text-sm text-slate-900 rounded-2xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  required
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  maxLength={10}
                  className="w-full pl-11 pr-4 py-3 bg-white disabled:bg-gray-50 text-sm text-slate-900 rounded-2xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  required
                />
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Password (min 6 chars)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-11 pr-11 py-3 bg-white disabled:bg-gray-50 text-sm text-slate-900 rounded-2xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  required
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={otpSent}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-11 pr-4 py-3 bg-white disabled:bg-gray-50 text-sm text-slate-900 rounded-2xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  required
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* OTP Verification Block */}
            {otpSent && (
              <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 mt-1">
                <label className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-amber-500" /> Email Verification OTP Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 bg-emerald-50 text-base font-black text-slate-900 text-center tracking-widest rounded-2xl border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setInfoMessage(null);
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-slate-700 text-center uppercase tracking-wider mt-1"
                >
                  Edit Information
                </button>
              </div>
            )}

            {/* Submit Button */}
            {!otpSent ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#105634] hover:bg-[#0b3e25] text-white py-3.5 mt-2 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 cursor-pointer transition active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Sending Verification Code...' : 'Send Verification OTP ➔'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-3.5 mt-2 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Verify & Create Account Now ➔'}
              </button>
            )}
          </form>

          {/* Already have an account trigger */}
          <div className="text-center pt-2">
            <p className="text-xs font-semibold text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-700 hover:text-emerald-800 font-extrabold hover:underline">
                Sign in here ➔
              </Link>
            </p>
          </div>

        </div>

        {/* Bottom Legal Notice */}
        <div className="w-full max-w-md text-center pt-6 mt-auto">
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="/terms-and-conditions" target="_blank" className="text-emerald-700 font-bold underline hover:text-emerald-900">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" target="_blank" className="text-emerald-700 font-bold underline hover:text-emerald-900">
              Privacy Policy
            </a>
          </p>
        </div>

      </div>

    </div>
  );
}

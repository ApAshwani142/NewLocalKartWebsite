'use client';

import React, { useState } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Store, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PartnerLoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(phone, password);
      if (res.success) {
        router.push('/partner/dashboard');
      } else {
        setError(res.error || 'Invalid partner login credentials');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during partner sign-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col items-stretch justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2.5 bg-[#0e3e26] text-white rounded-2xl">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">Partner Portal</h1>
              <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Merchant & Rider Access</p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 mt-4">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Partner Mobile Number or Email
              </label>
              <input
                type="text"
                required
                placeholder="Enter 10-digit registered number or email"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Partner Security Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0e3e26] hover:bg-emerald-800 text-white font-black py-3.5 mt-2 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md cursor-pointer transition disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Partner Dashboard'} <ArrowRight size={15} />
            </button>
          </form>

          <p className="text-xs text-slate-500 font-semibold mt-6 text-center">
            New shopkeeper or rider?{' '}
            <Link href="/partner/shopkeeper" className="text-emerald-600 font-black hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

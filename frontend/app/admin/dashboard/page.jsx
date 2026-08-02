'use client';

import React, { useState, useEffect } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { productsApi, ordersApi } from '@/services/api';
import {
  ShieldAlert,
  Users,
  Store,
  Package,
  ShoppingBag,
  RefreshCw,
  BarChart3,
  CheckCircle,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        productsApi.getAll(),
        ordersApi.getStoreOrders()
      ]);
      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(Array.isArray(ords) ? ords : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-400" size={32} />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-between font-sans">
        <HeaderWrapper />
        <main className="max-w-md w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-xl">
            <ShieldAlert size={48} className="mx-auto text-rose-600 mb-4" />
            <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2">Admin Security Access Required</h1>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              You must be logged in with an Administrator account to view system analytics and manage roles.
            </p>
            <Link
              href="/partner/login"
              className="inline-block w-full bg-[#0e3e26] hover:bg-emerald-800 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition"
            >
              Sign In to Admin Portal
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0e3e26] via-[#124d30] to-[#072415] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
              <ShieldAlert size={14} /> Master Platform Administrator
            </div>
            <h1 className="text-2xl md:text-3xl font-black">e-LocalKart System Oversight</h1>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              Platform metrics across Bihar hyperlocal merchant stores, customers, and delivery runs.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-lg transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Telemetry
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 text-left">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl w-fit">
              <BarChart3 size={22} />
            </div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Gross GMV</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl w-fit">
              <ShoppingBag size={22} />
            </div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Total Orders</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl w-fit">
              <Package size={22} />
            </div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Active Catalog</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{products.length} Items</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl w-fit">
              <Users size={22} />
            </div>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">User System</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Multi-Role Active</h3>
          </div>
        </div>

        {/* Live Orders Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm text-left">
          <h3 className="text-base font-black text-slate-900 dark:text-white mb-4">Platform System Feeds</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-slate-600 dark:text-slate-400">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 dark:border-slate-850 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">#{o._id.substring(o._id.length - 8).toUpperCase()}</td>
                    <td className="py-3">{o.user?.name || 'Customer'}</td>
                    <td className="py-3 font-semibold">{o.paymentMethod}</td>
                    <td className="py-3 font-black text-slate-900 dark:text-white">₹{o.totalPrice}</td>
                    <td className="py-3">
                      <span className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        {o.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

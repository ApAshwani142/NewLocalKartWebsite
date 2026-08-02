'use client';

import React, { useState, useEffect } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { ordersApi } from '@/services/api';
import {
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  RefreshCw,
  PhoneCall,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

export default function DeliveryAgentDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveryOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getStoreOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load delivery orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'delivery_agent' || user.role === 'admin')) {
      fetchDeliveryOrders();
    }
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      fetchDeliveryOrders();
    } catch (err) {
      alert(err.message || 'Failed to update delivery status');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-400" size={32} />
      </div>
    );
  }

  if (!user || (user.role !== 'delivery_agent' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-between font-sans">
        <HeaderWrapper />
        <main className="max-w-md w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-xl">
            <Truck size={48} className="mx-auto text-emerald-600 mb-4" />
            <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2">Delivery Partner Access Required</h1>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Please sign in with a registered Delivery Agent account to access the express dispatch portal.
            </p>
            <Link
              href="/partner/login"
              className="inline-block w-full bg-[#0e3e26] hover:bg-emerald-800 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition"
            >
              Partner Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0e3e26] via-[#124d30] to-[#072415] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
              <Truck size={14} /> Rider Express Terminal
            </div>
            <h1 className="text-2xl md:text-3xl font-black">Agent {user.name}</h1>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              Active Express Deliveries in Ara & GT Road Hyperlocal Zone.
            </p>
          </div>

          <button
            onClick={fetchDeliveryOrders}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-lg transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Active Runs
          </button>
        </div>

        {/* Orders Feed */}
        <div className="flex flex-col gap-5 text-left">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package size={18} className="text-emerald-600" /> Assigned Delivery Orders ({orders.length})
          </h2>

          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={28} />
              <p className="text-xs font-bold">Syncing delivery feed...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-gray-100 dark:border-slate-800 text-center shadow-sm">
              <Truck size={40} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-black text-slate-800 dark:text-white mb-1">No Orders to Deliver</h3>
              <p className="text-xs text-slate-500 font-medium">
                New delivery dispatches will appear here automatically as soon as merchants mark orders ready.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        Run #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                      </span>
                      <p className="text-[10px] text-slate-500 font-bold">Payment: {ord.paymentMethod} (₹{ord.totalPrice})</p>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
                      {ord.deliveryStatus}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Dropoff Destination</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">{ord.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <PhoneCall size={14} className="text-emerald-600" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {ord.user?.name || 'Customer'}: {ord.user?.phone || 'Contact on arrival'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                    <button
                      onClick={() => handleUpdateStatus(ord._id, 'Out for Delivery')}
                      disabled={ord.deliveryStatus === 'Out for Delivery' || ord.deliveryStatus === 'Delivered'}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition"
                    >
                      Pick Up Run
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ord._id, 'Delivered')}
                      disabled={ord.deliveryStatus === 'Delivered'}
                      className="w-full bg-[#0e3e26] hover:bg-emerald-900 disabled:opacity-40 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition"
                    >
                      Mark Delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/hooks/useAuth';
import { Package, Clock, ShieldCheck, MapPin, Truck, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const API_URL = '/api';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          // Expand first order by default if available
          if (data.length > 0) {
            setExpandedOrderId(data[0]._id);
          }
        }
      } catch (err) {
        console.warn('Error fetching orders:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, API_URL]);

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 rounded-full border-4 border-[#0e3e26] border-t-transparent animate-spin" />
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'Placed', label: 'Order Placed', desc: 'We have received your order' },
      { key: 'Processing', label: 'Processing', desc: 'Preparing fresh items at local store' },
      { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your door' },
      { key: 'Delivered', label: 'Delivered', desc: 'Order delivered successfully' }
    ];

    const statusIndices = {
      'Placed': 0,
      'Processing': 1,
      'Out for Delivery': 2,
      'Delivered': 3
    };

    const currentIdx = statusIndices[status] || 0;

    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= currentIdx,
      active: idx === currentIdx
    }));
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb]">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-10 text-left">
        <div className="flex flex-col gap-6">
          <div className="border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Order History</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
              Track active deliveries and review past checkouts
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-44 animate-pulse border border-gray-100/50" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-300">
                <ShoppingBag size={36} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-800">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-400 font-bold mt-1 max-w-[240px] leading-relaxed mx-auto">
                  You haven't ordered anything yet. Browse our top local categories to place your first same-hour delivery!
                </p>
              </div>
              <Link
                href="/"
                className="px-6 py-2.5 bg-brand-dark hover:bg-brand-medium text-white text-xs font-black rounded-full uppercase tracking-wider transition cursor-pointer"
              >
                Go Shop Groceries
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order._id;
                const trackerSteps = getStatusSteps(order.deliveryStatus);
                const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-card hover:shadow-premium transition duration-300"
                  >
                    {/* Card Summary Header */}
                    <div
                      onClick={() => toggleExpand(order._id)}
                      className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition duration-150"
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit">
                          ID: #{order._id.substring(order._id.length - 8)}
                        </span>
                        <p className="text-xs font-black text-gray-700 mt-1.5 flex items-center gap-1.5">
                          <Clock size={13} className="text-gray-400" />
                          Ordered: {orderDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Amount</p>
                          <p className="text-base font-black text-brand-dark">₹{order.totalPrice}</p>
                        </div>
                        
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                          <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                            order.deliveryStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {order.deliveryStatus}
                          </span>
                        </div>

                        <button className="text-gray-400 hover:text-gray-700 transition">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Tracking Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 p-6 bg-gray-50/30 flex flex-col gap-8">
                        {/* Timeline Status Tracker */}
                        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative px-2">
                          
                          {/* Desktop timeline horizontal connector line */}
                          <div className="hidden md:block absolute left-10 right-10 top-5 h-0.5 bg-gray-100 z-0" />

                          {trackerSteps.map((step, idx) => (
                            <div
                              key={step.key}
                              className="flex flex-row md:flex-col items-center gap-3.5 md:text-center z-10 w-full md:w-1/4"
                            >
                              {/* Step circle */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 font-black transition-all ${
                                step.completed
                                  ? 'bg-[#0e3e26] border-[#0e3e26] text-white shadow-sm'
                                  : 'bg-white border-gray-200 text-gray-400'
                              } ${step.active ? 'ring-4 ring-emerald-50 scale-105' : ''}`}>
                                {idx + 1}
                              </div>
                              
                              <div className="text-left md:text-center leading-tight">
                                <p className={`text-xs font-black uppercase tracking-wider ${
                                  step.completed ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  {step.label}
                                </p>
                                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 max-w-[140px] md:mx-auto">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Details & Summary splits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-50">
                          
                          {/* List items */}
                          <div className="flex flex-col gap-3.5 text-left">
                            <h4 className="text-xs font-extrabold tracking-widest text-[#0e3e26] uppercase flex items-center gap-1.5 mb-1">
                              <Package size={14} className="text-emerald-500" />
                              Order Items
                            </h4>
                            <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl border border-gray-100">
                              {order.orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-xs font-bold text-gray-600">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                                    />
                                    <span className="text-gray-800 truncate">{item.name} ({item.unit})</span>
                                  </div>
                                  <span>{item.qty} × ₹{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipment details */}
                          <div className="flex flex-col gap-3.5 text-left">
                            <h4 className="text-xs font-extrabold tracking-widest text-[#0e3e26] uppercase flex items-center gap-1.5 mb-1">
                              <MapPin size={14} className="text-emerald-500" />
                              Delivery Info & Payment
                            </h4>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 text-xs text-gray-500 font-semibold">
                              <div>
                                <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Delivery Address</p>
                                <p className="text-gray-800 font-bold mt-0.5">{order.deliveryAddress}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 border-t border-gray-50 pt-2.5">
                                <div>
                                  <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Payment Method</p>
                                  <p className="text-gray-800 font-bold mt-0.5">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay'}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Payment Status</p>
                                  <span className={`inline-flex items-center gap-1 mt-0.5 font-bold ${
                                    order.isPaid ? 'text-emerald-600' : 'text-amber-600'
                                  }`}>
                                    {order.isPaid ? (
                                      <>
                                        <ShieldCheck size={13} className="text-emerald-500" />
                                        Paid
                                      </>
                                    ) : (
                                      'Unpaid / Pending'
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

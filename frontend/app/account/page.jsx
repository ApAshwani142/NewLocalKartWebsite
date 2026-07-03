'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/hooks/useAuth';
import { User, Phone, Mail, MapPin, Key, CreditCard, LogOut, CheckCircle, AlertTriangle, ShieldCheck, Box, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, loading, logout, setUser } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Orders and Addresses States
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Auth Guard: Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Set initial form values
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Fetch user orders & extract addresses
  useEffect(() => {
    const fetchOrdersAndAddresses = async () => {
      if (!token) return;
      try {
        setOrdersLoading(true);
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const orderData = await res.json();
          setOrders(orderData);

          // Extract unique delivery addresses
          const uniqueAddresses = [
            ...new Set(orderData.map((order) => order.deliveryAddress))
          ].filter(Boolean);
          setAddresses(uniqueAddresses);
        }
      } catch (err) {
        console.warn('Failed to fetch user orders/addresses:', err.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user && token) {
      fetchOrdersAndAddresses();
    }
  }, [user, token, API_URL]);

  // Handle Profile Update Submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(null);

    if (password && password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    setUpdateLoading(true);

    try {
      const payload = { name, email, phone };
      if (password) {
        payload.password = password;
      }

      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update storage and context user state
      localStorage.setItem('localkart_token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role
      });

      setUpdateSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#0e3e26] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Checking Authentication...</span>
        </div>
      </div>
    );
  }

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb]">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-[95%] mx-auto px-4 md:px-6 py-8 flex flex-col gap-8 text-left">
        {/* Page title header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-5"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
              <Link href="/" className="hover:text-brand-dark transition">Home</Link>
              <span>/</span>
              <span className="text-gray-600">Account</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-950 mt-1 tracking-tight">
              My Profile Dashboard
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Manage details, view order addresses, and check security settings
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            <LogOut size={13} className="stroke-[3]" /> Log Out
          </button>
        </motion.div>

        {/* Dashboard Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* Left Panel: Profile Detail Summary Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 flex flex-col items-center text-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-emerald-500/20 to-[#0e3e26]/10" />
              
              <div className="w-20 h-20 rounded-full bg-[#0e3e26] text-white font-black text-2xl flex items-center justify-center uppercase relative z-10 border-4 border-white shadow-md mt-6">
                {user.name.charAt(0)}
              </div>

              <div className="relative z-10 flex flex-col items-center gap-1 mt-2">
                <span className="text-[10px] bg-emerald-50 text-[#0e3e26] border border-emerald-100 px-3 py-0.5 rounded-full font-black uppercase tracking-widest w-fit">
                  {user.role}
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-2">{user.name}</h3>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><Mail size={12} /> {user.email}</p>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5"><Phone size={12} /> {user.phone}</p>
              </div>

              <div className="w-full border-t border-gray-50 pt-5 mt-2 flex flex-col gap-3.5 text-xs text-gray-500 font-bold">
                <div className="flex justify-between items-center px-2">
                  <span className="text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">Verification State</span>
                  <span className="text-emerald-600 flex items-center gap-1 font-black"><ShieldCheck size={14} /> Verified</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">Account Active since</span>
                  <span>{new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Saved Addresses list card */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 text-left flex flex-col gap-4">
              <h4 className="text-xs font-black text-[#0e3e26] uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-500" /> Saved Delivery Locations
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider -mt-2">
                Extracted from your previous orders
              </p>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-6 text-gray-400 gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-dark" />
                  <span className="text-xs font-bold">Loading addresses...</span>
                </div>
              ) : addresses.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-400 text-xs font-bold leading-normal">
                  No delivery addresses found. Place an order to save your address details!
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                  {addresses.map((address, index) => (
                    <div
                      key={index}
                      className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex items-start gap-3 text-xs text-gray-700 font-bold hover:bg-gray-50 transition"
                    >
                      <MapPin size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                      <p className="leading-relaxed">{address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Panel: Edit profile form & history (2 columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-8 w-full">
            {/* Profile edit Card */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 md:p-10 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">
                  Update Account Details
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                  Modify profile information and security password
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {updateSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold"
                    >
                      <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black">Success</p>
                        <p className="text-emerald-600/90 mt-0.5">{updateSuccess}</p>
                      </div>
                    </motion.div>
                  )}
                  {updateError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold"
                    >
                      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black">Update Failed</p>
                        <p className="text-red-600/90 mt-0.5">{updateError}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter mobile number"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 pt-5 mt-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                      <Key size={10} /> New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                      <Key size={10} /> Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="bg-[#0e3e26] hover:bg-[#105634] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-brand-dark/10 mt-2"
                >
                  {updateLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Quick Order History Summary */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 md:p-8 flex flex-col gap-5 text-left">
              <h4 className="text-xs font-black text-[#0e3e26] uppercase tracking-widest flex items-center gap-1.5">
                <Box size={14} className="text-emerald-500" /> Recent Orders
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider -mt-3.5">
                Track status and shipping timelines
              </p>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-6 text-gray-400 gap-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-[#0e3e26] border-t-transparent animate-spin" />
                  <span className="text-xs font-bold">Loading orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-250 p-8 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">📦</span>
                  <p className="text-xs font-bold">No orders placed yet.</p>
                  <Link
                    href="/"
                    className="px-5 py-2 bg-brand-dark text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md hover:bg-brand-medium mt-1"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order._id}
                      className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs font-bold"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-150 flex items-center justify-center text-[#0e3e26] shadow-xs shrink-0">
                          <Box size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 font-black">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-extrabold uppercase mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {order.orderItems.length} items • ₹{order.totalPrice}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-gray-100 pt-3.5 sm:pt-0">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          order.deliveryStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : order.deliveryStatus === 'Out for Delivery'
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {order.deliveryStatus}
                        </span>
                        
                        <Link
                          href="/orders"
                          className="text-[#0e3e26] hover:underline text-[11px] font-black uppercase tracking-wider"
                        >
                          Track Status
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  {orders.length > 3 && (
                    <Link
                      href="/orders"
                      className="text-center text-xs font-black text-[#0e3e26] hover:text-emerald-700 transition uppercase tracking-wider mt-2"
                    >
                      View all {orders.length} orders
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

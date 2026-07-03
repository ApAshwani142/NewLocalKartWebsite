'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/hooks/useAuth';
import { 
  MapPin, 
  Home, 
  Briefcase, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Check, 
  Loader2, 
  User, 
  Phone, 
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressesPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Addresses lists
  const [orderAddresses, setOrderAddresses] = useState([]);
  const [customAddresses, setCustomAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form & Modal States
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Ara');
  const [state, setState] = useState('Bihar');
  const [postalCode, setPostalCode] = useState('');
  const [addressType, setAddressType] = useState('Home'); // Home, Work, Other
  const [isDefault, setIsDefault] = useState(false);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Auth protection guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch past order addresses and load custom ones from LocalStorage
  useEffect(() => {
    const loadAddresses = async () => {
      if (!token) return;
      try {
        setLoading(true);

        // 1. Fetch addresses from orders
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const orderData = await res.json();
          const uniqueAddresses = [
            ...new Set(orderData.map((order) => order.deliveryAddress))
          ].filter(Boolean);
          setOrderAddresses(uniqueAddresses);
        }

        // 2. Load custom addresses from LocalStorage
        const localData = localStorage.getItem('localkart_custom_addresses');
        if (localData) {
          setCustomAddresses(JSON.parse(localData));
        }
      } catch (err) {
        console.warn('Error loading addresses:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      loadAddresses();
    }
  }, [user, token, API_URL]);

  // Save custom addresses to local storage when state changes
  const saveToLocalStorage = (newAddresses) => {
    localStorage.setItem('localkart_custom_addresses', JSON.stringify(newAddresses));
    setCustomAddresses(newAddresses);
  };

  // Handle adding new custom address
  const handleAddAddress = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim() || !phone.trim() || !streetAddress.trim() || !postalCode.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const newAddressObj = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      address: `${streetAddress.trim()}, ${city.trim()}, ${state.trim()} - ${postalCode.trim()}`,
      type: addressType,
      isDefault: isDefault
    };

    let updatedAddresses = [...customAddresses];

    // If setting as default, unset previous default addresses
    if (isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
    }

    updatedAddresses.unshift(newAddressObj);
    saveToLocalStorage(updatedAddresses);

    // Reset Form
    setName('');
    setPhone('');
    setStreetAddress('');
    setPostalCode('');
    setAddressType('Home');
    setIsDefault(false);

    setFormSuccess('Address added successfully!');
    setTimeout(() => {
      setShowAddForm(false);
      setFormSuccess('');
    }, 1000);
  };

  // Handle deleting custom address
  const handleDeleteAddress = (id) => {
    const updatedAddresses = customAddresses.filter((addr) => addr.id !== id);
    saveToLocalStorage(updatedAddresses);
  };

  // Set address as default
  const handleSetDefault = (id) => {
    const updatedAddresses = customAddresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveToLocalStorage(updatedAddresses);
  };

  if (authLoading || !user) {
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
      transition: { staggerChildren: 0.08 }
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
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 bg-white rounded-full border border-gray-150 text-gray-700 hover:text-brand-dark transition shadow-xs"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                <Link href="/" className="hover:text-brand-dark transition">Home</Link>
                <span>/</span>
                <span className="text-gray-600">Saved Addresses</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-950 mt-1 tracking-tight flex items-center gap-2">
                Delivery Addresses <Sparkles size={20} className="text-orange-500 animate-pulse" />
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-[#0e3e26] hover:bg-[#105634] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-brand-dark/10"
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>

        {/* Form Modal for Adding Address */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-[32px] w-full max-w-lg p-6 md:p-8 shadow-2xl relative border border-gray-100 text-left"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Add Delivery Location</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-0.5">Define your shipping details</p>
                  </div>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="flex flex-col gap-4">
                  {formError && (
                    <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Contact Person *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Recipient Name"
                        className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Mobile Number"
                        className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Street Address *</label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="House No, Building, Street, Area"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">State *</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Pincode *</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 801101"
                        className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Address Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Home', 'Work', 'Other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressType(type)}
                          className={`py-2 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            addressType === type
                              ? 'bg-emerald-50 border-[#0e3e26] text-[#0e3e26]'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {type === 'Home' && <Home size={13} />}
                          {type === 'Work' && <Briefcase size={13} />}
                          {type === 'Other' && <MapPin size={13} />}
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="default-check"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="w-4.5 h-4.5 accent-[#0e3e26] cursor-pointer"
                    />
                    <label htmlFor="default-check" className="text-xs text-gray-600 font-bold select-none cursor-pointer">
                      Set as Default Delivery Address
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0e3e26] hover:bg-[#105634] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer mt-4"
                  >
                    Add Address
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Addresses Dashboard Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-brand-dark" />
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Retrieving Location Records...</span>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Action Card: Add New Address */}
            <motion.div 
              variants={itemVariants}
              onClick={() => setShowAddForm(true)}
              className="bg-emerald-50/10 border-2 border-dashed border-emerald-800/20 hover:border-[#0e3e26]/50 hover:bg-emerald-50/20 rounded-[32px] p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition duration-300 min-h-[190px]"
            >
              <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#0e3e26] flex items-center justify-center shadow-xs">
                <Plus size={24} className="stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">New Location</h4>
                <p className="text-xs text-gray-400 font-bold mt-1 max-w-[200px]">Save another house or office address for fast checkout</p>
              </div>
            </motion.div>

            {/* Custom Saved Addresses */}
            {customAddresses.map((addr) => (
              <motion.div 
                key={addr.id}
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-premium flex flex-col justify-between gap-5 relative hover:-translate-y-1 transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      addr.type === 'Home'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : addr.type === 'Work'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-purple-50 text-purple-600 border border-purple-100'
                    }`}>
                      {addr.type === 'Home' && <Home size={10} />}
                      {addr.type === 'Work' && <Briefcase size={10} />}
                      {addr.type === 'Other' && <MapPin size={10} />}
                      {addr.type}
                    </span>

                    {addr.isDefault && (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check size={8} className="stroke-[4]" /> Default
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-gray-900 mt-4 leading-normal">
                    {addr.address}
                  </h3>

                  <div className="flex flex-col gap-1.5 mt-4 text-[11px] text-gray-500 font-bold">
                    <p className="flex items-center gap-1.5"><User size={12} className="text-gray-400" /> {addr.name}</p>
                    <p className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {addr.phone}</p>
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-4 flex items-center justify-between mt-2">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[10px] font-extrabold text-gray-400 hover:text-[#0e3e26] transition uppercase tracking-wider cursor-pointer"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-0.5">
                      Selected Default
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Past Order Extracted Addresses */}
            {orderAddresses.map((addr, index) => {
              // Deduplicate if custom addresses contain this address
              const isAlreadyCustom = customAddresses.some(c => c.address.toLowerCase().includes(addr.toLowerCase()) || addr.toLowerCase().includes(c.address.toLowerCase()));
              if (isAlreadyCustom) return null;

              return (
                <motion.div 
                  key={`order-${index}`}
                  variants={itemVariants}
                  className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-premium flex flex-col justify-between gap-5 relative opacity-85 hover:opacity-100 transition duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="bg-gray-50 text-gray-500 border border-gray-200 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                        <MapPin size={10} /> Past Order
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-gray-900 mt-4 leading-relaxed">
                      {addr}
                    </h3>
                  </div>

                  <div className="border-t border-gray-50 pt-4 flex items-center justify-between mt-2">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">
                      Auto-saved from checkout
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

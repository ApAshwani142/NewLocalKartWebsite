'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { 
  MapPin, Home, Briefcase, Plus, Trash2, ArrowLeft, Check, 
  Loader2, User, Phone, Edit3, Compass, Navigation, 
  CheckCircle2, X, AlertCircle, Building, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressesPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const { selectLocation } = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Address list from MongoDB
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form & Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detectingGps, setDetectingGps] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    houseNo: '',
    street: '',
    landmark: '',
    area: '',
    city: 'Ara',
    pincode: '802301',
    label: 'Home',
    isDefault: false,
    lat: 25.556,
    lng: 84.660
  });

  const API_URL = '/api';

  // Auth Protection Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/addresses');
    }
  }, [user, authLoading, router]);

  // Fetch dynamic addresses from MongoDB
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`${API_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setAddresses(Array.isArray(data) ? data : []);
      } else {
        const err = await res.json();
        setErrorMsg(err.message || 'Failed to retrieve saved addresses.');
      }
    } catch (err) {
      setErrorMsg('Could not connect to database server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchAddresses();
    }
  }, [user, token]);

  // Open Form Modal for New Address
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      houseNo: '',
      street: '',
      landmark: '',
      area: '',
      city: 'Ara',
      pincode: '802301',
      label: 'Home',
      isDefault: addresses.length === 0,
      lat: 25.556,
      lng: 84.660
    });
    setErrorMsg('');
    setShowFormModal(true);
  };

  // Open Form Modal for Editing
  const handleOpenEditModal = (addr) => {
    setEditingId(addr._id);
    setFormData({
      name: addr.name || user?.name || '',
      phone: addr.phone || user?.phone || '',
      houseNo: addr.houseNo || '',
      street: addr.street || '',
      landmark: addr.landmark || '',
      area: addr.area || '',
      city: addr.city || 'Ara',
      pincode: addr.pincode || '802301',
      label: addr.label || 'Home',
      isDefault: Boolean(addr.isDefault),
      lat: addr.lat || 25.556,
      lng: addr.lng || 84.660
    });
    setErrorMsg('');
    setShowFormModal(true);
  };

  // GPS Geolocation Auto-Detection
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingGps(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const a = data.address;
              const detectedCity = a.city || a.town || a.village || a.state_district || 'Ara';
              const detectedRoad = a.road || a.suburb || a.neighbourhood || a.residential || '';
              const detectedArea = a.suburb || a.neighbourhood || a.county || '';
              const detectedPincode = (a.postcode || '802301').replace(/\s+/g, '').slice(0, 6);

              setFormData((prev) => ({
                ...prev,
                street: detectedRoad || prev.street,
                area: detectedArea || prev.area,
                city: detectedCity || prev.city,
                pincode: detectedPincode || prev.pincode,
                lat: latitude,
                lng: longitude
              }));
            }
          }
        } catch (e) {
          console.warn('Reverse geocode error:', e);
        } finally {
          setDetectingGps(false);
        }
      },
      (err) => {
        setDetectingGps(false);
        setErrorMsg('Location permission denied or unavailable. Please fill in manually.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Form Submission (Add or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter recipient contact name and phone number.');
      return;
    }
    if (!formData.houseNo.trim() && !formData.street.trim()) {
      setErrorMsg('Please provide house/flat number or street details.');
      return;
    }
    if (!formData.pincode.trim()) {
      setErrorMsg('Please provide a valid 6-digit postal pincode.');
      return;
    }

    setActionLoading(true);
    setErrorMsg('');

    try {
      const endpoint = editingId ? `${API_URL}/addresses/${editingId}` : `${API_URL}/addresses`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const savedData = await res.json();

      if (res.ok) {
        setSuccessMsg(editingId ? 'Address updated successfully!' : 'Address saved successfully!');
        setShowFormModal(false);
        await fetchAddresses();

        // If saved address was marked default, sync with global location
        if (formData.isDefault) {
          selectLocation({
            city: formData.city,
            area: formData.area || formData.street,
            pincode: formData.pincode,
            lat: formData.lat,
            lng: formData.lng,
            fullAddress: `${formData.houseNo}, ${formData.street}${formData.landmark ? ', Near ' + formData.landmark : ''}, ${formData.city} - ${formData.pincode}`,
            name: formData.name,
            phone: formData.phone
          });
        }

        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(savedData.message || 'Failed to save address.');
      }
    } catch (err) {
      setErrorMsg('Error saving address. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this delivery address?')) return;

    try {
      const res = await fetch(`${API_URL}/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a._id !== id));
        setSuccessMsg('Address removed.');
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      setErrorMsg('Could not delete address.');
    }
  };

  // Set Address as Default
  const handleSetDefault = async (addr) => {
    try {
      const res = await fetch(`${API_URL}/addresses/${addr._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isDefault: true })
      });

      if (res.ok) {
        setAddresses((prev) =>
          prev.map((item) => ({
            ...item,
            isDefault: item._id === addr._id
          }))
        );

        // Update active location
        selectLocation({
          city: addr.city,
          area: addr.area || addr.street,
          pincode: addr.pincode,
          lat: addr.lat,
          lng: addr.lng,
          fullAddress: `${addr.houseNo ? addr.houseNo + ', ' : ''}${addr.street}${addr.landmark ? ', Near ' + addr.landmark : ''}, ${addr.city} - ${addr.pincode}`,
          name: addr.name,
          phone: addr.phone
        });

        setSuccessMsg(`Default delivery address set to ${addr.label}!`);
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      setErrorMsg('Could not update default address.');
    }
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#0e3e26]" />
          <span className="text-xs font-bold text-gray-500">Loading Delivery Addresses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb] text-slate-900 font-sans">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 text-left">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3.5">
            <Link
              href="/account"
              className="p-2 rounded-xl bg-white border border-gray-200 text-slate-700 hover:text-[#0e3e26] hover:border-emerald-500 shadow-xs transition"
              aria-label="Back to Account"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <Link href="/" className="hover:text-[#0e3e26] transition">Home</Link>
                <span>/</span>
                <Link href="/account" className="hover:text-[#0e3e26] transition">Account</Link>
                <span>/</span>
                <span className="text-slate-700">Saved Addresses</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Saved Delivery Addresses
              </h1>
            </div>
          </div>

          {/* Add New Address Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-[#0e3e26] hover:bg-[#105634] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} className="stroke-[3]" /> Add New Address
          </button>
        </div>

        {/* Notifications & Status Alerts */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Addresses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#0e3e26]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Retrieving Addresses from Database...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Quick Add Dashed Card */}
            <div
              onClick={handleOpenAddModal}
              className="bg-emerald-50/20 border-2 border-dashed border-emerald-800/20 hover:border-[#0e3e26] hover:bg-emerald-50/40 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition min-h-[220px] group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0e3e26] flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                <Plus size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Add New Location
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 max-w-[210px]">
                  Save another house, flat or office address for 1-click checkout
                </p>
              </div>
            </div>

            {/* Dynamic MongoDB Saved Addresses */}
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`bg-white rounded-3xl p-5 sm:p-6 shadow-xs border transition flex flex-col justify-between gap-4 relative hover:shadow-md ${
                  addr.isDefault ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200/80 hover:border-gray-300'
                }`}
              >
                <div>
                  {/* Card Top Row: Label Tag & Default Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        addr.label === 'Home'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : addr.label === 'Work'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {addr.label === 'Home' && <Home size={11} />}
                      {addr.label === 'Work' && <Briefcase size={11} />}
                      {addr.label === 'Other' && <MapPin size={11} />}
                      {addr.label || 'Home'}
                    </span>

                    {addr.isDefault ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={11} className="stroke-[3]" /> Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr)}
                        className="text-[10px] font-extrabold text-slate-400 hover:text-[#0e3e26] transition uppercase tracking-wider cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  {/* Recipient Contact */}
                  <div className="mt-3.5 flex flex-col gap-0.5">
                    <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <User size={13} className="text-emerald-700" />
                      {addr.name || user?.name || 'Customer'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 ml-0.5">
                      <Phone size={12} className="text-slate-400" />
                      {addr.phone || user?.phone || 'Contact phone'}
                    </p>
                  </div>

                  {/* Formatted Address Lines */}
                  <div className="mt-3 text-xs text-slate-700 leading-relaxed font-medium bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                    <p className="font-bold text-slate-900">
                      {addr.houseNo ? `${addr.houseNo}, ` : ''}
                      {addr.street}
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Landmark: Near {addr.landmark}
                      </p>
                    )}
                    <p className="text-slate-600 mt-0.5">
                      {addr.area ? `${addr.area}, ` : ''}{addr.city} - {addr.pincode}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(addr)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0e3e26] transition cursor-pointer"
                  >
                    <Edit3 size={13} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State when 0 addresses */}
        {!loading && addresses.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center flex flex-col items-center gap-3 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Saved Delivery Addresses Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Add your home, office, or local address once to enjoy instantaneous checkout across all partner stores.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 bg-[#0e3e26] hover:bg-[#105634] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition cursor-pointer"
            >
              Add Your First Address
            </button>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* DETAILED ADDRESS FORM MODAL (MANUAL + GPS AUTO-FILL)                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 text-[#0e3e26]">
                    <Building2 size={18} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingId ? 'Edit Delivery Address' : 'Add Delivery Address'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* GPS Auto-Detect Banner Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={detectingGps}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#0e3e26] to-[#105634] hover:from-[#105634] hover:to-[#0e3e26] text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-75"
                >
                  <div className="flex items-center gap-2.5">
                    <Navigation size={16} className={detectingGps ? 'animate-spin' : ''} />
                    <span>{detectingGps ? 'Fetching GPS Coordinates...' : 'Auto-fill from Device GPS'}</span>
                  </div>
                  <Compass size={16} className="text-emerald-200" />
                </button>
              </div>

              {/* Detailed Form Fields */}
              <form onSubmit={handleSubmitForm} className="mt-4 flex flex-col gap-3.5">
                {/* Name & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] bg-gray-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] bg-gray-50/60 focus:bg-white"
                    />
                  </div>
                </div>

                {/* House/Flat No */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Flat / House No. / Building / Floor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302, Royal Residency / House 12-B"
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] bg-gray-50/60 focus:bg-white"
                  />
                </div>

                {/* Street / Locality */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Street Address / Colony / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Trunk Road / Boring Road"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] bg-gray-50/60 focus:bg-white"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near City Hospital / Opposite Axis Bank"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] bg-gray-50/60 focus:bg-white"
                  />
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ara / Patna"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] bg-gray-50/60 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 802301"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] bg-gray-50/60 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Address Type Chips (Home, Work, Other) */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Address Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Home', 'Work', 'Other'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, label: type })}
                        className={`py-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          formData.label === type
                            ? 'bg-[#0e3e26] text-white border-[#0e3e26] shadow-xs'
                            : 'bg-gray-50 text-slate-600 border-gray-200 hover:bg-gray-100'
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

                {/* Set as Default Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="modal-default-check"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#0e3e26] cursor-pointer"
                  />
                  <label htmlFor="modal-default-check" className="text-xs text-slate-700 font-bold select-none cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="mt-2 w-full py-3 bg-[#0e3e26] hover:bg-[#105634] text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : editingId ? 'Update Address' : 'Save Address to Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

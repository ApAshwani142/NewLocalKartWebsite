'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Home, Map, Star, Building2, Flag, AlertCircle, Check, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddressForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  error,
  setError
}) {
  const [focusedField, setFocusedField] = useState(null);
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState(null);

  const {
    fullName,
    phone,
    pincode,
    houseNo,
    locality,
    landmark,
    city,
    state,
    addressType = 'Home',
    isDefault = false
  } = formData;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  // Pincode Autofill Effect
  useEffect(() => {
    const cleanPin = pincode ? pincode.trim() : '';
    if (cleanPin.length === 6 && /^\d+$/.test(cleanPin)) {
      setLoadingPincode(true);
      setPincodeError(null);

      fetch(`https://api.postalpincode.in/pincode/${cleanPin}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            const fetchedCity = po.District || po.Block || po.Circle;
            const fetchedState = po.State;
            
            setFormData((prev) => ({
              ...prev,
              city: fetchedCity || prev.city,
              state: fetchedState || prev.state,
              locality: prev.locality || po.Name || ''
            }));
            setPincodeError(null);
          } else {
            setPincodeError('Invalid or unserviceable pincode. Please check your pincode.');
          }
        })
        .catch((err) => {
          console.warn('Pincode fetch error:', err);
        })
        .finally(() => {
          setLoadingPincode(false);
        });
    } else if (cleanPin.length > 0 && cleanPin.length !== 6) {
      setPincodeError('Pincode must be 6 digits');
    } else {
      setPincodeError(null);
    }
  }, [pincode, setFormData]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 text-left w-full">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          Delivery Details
        </h3>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
          Required for shipping
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Address Type Selector Tags (Home / Work / Other) */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Tag As:
        </span>
        {['Home', 'Work', 'Other'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleChange('addressType', type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              addressType === type
                ? 'bg-[#105634] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'Home' ? '🏠 Home' : type === 'Work' ? '💼 Work' : '📍 Other'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div
          className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
            focusedField === 'fullName'
              ? 'border-[#105634] ring-2 ring-[#105634]/15'
              : 'border-gray-200'
          }`}
        >
          <span
            className={`transition ${
              focusedField === 'fullName' ? 'text-[#105634]' : 'text-gray-400'
            }`}
          >
            <User size={18} />
          </span>
          <div className="flex-1 flex flex-col">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g. Rahul Sharma"
              className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div
          className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
            focusedField === 'phone'
              ? 'border-[#105634] ring-2 ring-[#105634]/15'
              : 'border-gray-200'
          }`}
        >
          <span
            className={`transition ${
              focusedField === 'phone' ? 'text-[#105634]' : 'text-gray-400'
            }`}
          >
            <Phone size={18} />
          </span>
          <div className="flex-1 flex flex-col">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="10-digit mobile number"
              className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pincode with Autofill & Validation */}
        <div className="flex flex-col gap-1">
          <div
            className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
              pincodeError
                ? 'border-red-400 ring-2 ring-red-400/15'
                : focusedField === 'pincode'
                ? 'border-[#105634] ring-2 ring-[#105634]/15'
                : 'border-gray-200'
            }`}
          >
            <span
              className={`transition ${
                focusedField === 'pincode' ? 'text-[#105634]' : 'text-gray-400'
              }`}
            >
              <MapPin size={18} />
            </span>
            <div className="flex-1 flex flex-col">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Pincode *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                onFocus={() => setFocusedField('pincode')}
                onBlur={() => setFocusedField(null)}
                placeholder="6-digit Pincode (e.g. 800001)"
                className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
              />
            </div>
            {loadingPincode && (
              <Loader2 size={16} className="animate-spin text-[#105634]" />
            )}
          </div>
          {pincodeError && (
            <span className="text-[10px] font-extrabold text-red-500 pl-2">
              {pincodeError}
            </span>
          )}
        </div>

        {/* House No / Building */}
        <div
          className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
            focusedField === 'houseNo'
              ? 'border-[#105634] ring-2 ring-[#105634]/15'
              : 'border-gray-200'
          }`}
        >
          <span
            className={`transition ${
              focusedField === 'houseNo' ? 'text-[#105634]' : 'text-gray-400'
            }`}
          >
            <Home size={18} />
          </span>
          <div className="flex-1 flex flex-col">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              House No. / Flat / Building *
            </label>
            <input
              type="text"
              required
              value={houseNo}
              onChange={(e) => handleChange('houseNo', e.target.value)}
              onFocus={() => setFocusedField('houseNo')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g. House 42, Ground Floor"
              className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Locality / Area */}
      <div
        className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
          focusedField === 'locality'
            ? 'border-[#105634] ring-2 ring-[#105634]/15'
            : 'border-gray-200'
        }`}
      >
        <span
          className={`transition ${
            focusedField === 'locality' ? 'text-[#105634]' : 'text-gray-400'
          }`}
        >
          <Map size={18} />
        </span>
        <div className="flex-1 flex flex-col">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
            Locality / Street / Area *
          </label>
          <input
            type="text"
            required
            value={locality}
            onChange={(e) => handleChange('locality', e.target.value)}
            onFocus={() => setFocusedField('locality')}
            onBlur={() => setFocusedField(null)}
            placeholder="e.g. Boring Road, Near Alankar Jewellers"
            className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
          />
        </div>
      </div>

      {/* Landmark */}
      <div
        className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
          focusedField === 'landmark'
            ? 'border-[#105634] ring-2 ring-[#105634]/15'
            : 'border-gray-200'
        }`}
      >
        <span
          className={`transition ${
            focusedField === 'landmark' ? 'text-[#105634]' : 'text-gray-400'
          }`}
        >
          <Star size={18} />
        </span>
        <div className="flex-1 flex flex-col">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
            Landmark (Optional)
          </label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => handleChange('landmark', e.target.value)}
            onFocus={() => setFocusedField('landmark')}
            onBlur={() => setFocusedField(null)}
            placeholder="e.g. Opposite SBI ATM"
            className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City / Town */}
        <div
          className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
            focusedField === 'city'
              ? 'border-[#105634] ring-2 ring-[#105634]/15'
              : 'border-gray-200'
          }`}
        >
          <span
            className={`transition ${
              focusedField === 'city' ? 'text-[#105634]' : 'text-gray-400'
            }`}
          >
            <Building2 size={18} />
          </span>
          <div className="flex-1 flex flex-col">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              City / Town *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => handleChange('city', e.target.value)}
              onFocus={() => setFocusedField('city')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g. Patna"
              className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
            />
          </div>
        </div>

        {/* State */}
        <div
          className={`relative border rounded-2xl py-1.5 px-4 bg-white flex items-center gap-3 transition-all duration-200 ${
            focusedField === 'state'
              ? 'border-[#105634] ring-2 ring-[#105634]/15'
              : 'border-gray-200'
          }`}
        >
          <span
            className={`transition ${
              focusedField === 'state' ? 'text-[#105634]' : 'text-gray-400'
            }`}
          >
            <Flag size={18} />
          </span>
          <div className="flex-1 flex flex-col">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              State *
            </label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => handleChange('state', e.target.value)}
              onFocus={() => setFocusedField('state')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g. Bihar"
              className="w-full text-sm font-bold text-gray-800 focus:outline-none bg-transparent placeholder-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Make Default Address Checkbox */}
      <label className="flex items-center gap-3 cursor-pointer select-none py-1 w-fit mt-1">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => handleChange('isDefault', e.target.checked)}
          className="w-4 h-4 text-[#105634] border-gray-300 rounded focus:ring-[#105634] cursor-pointer"
        />
        <span className="text-xs font-black text-gray-700">
          Save as default address for future orders
        </span>
      </label>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-black uppercase transition cursor-pointer"
          >
            Cancel
          </button>
        )}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3.5 bg-[#105634] hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-emerald-500/10 cursor-pointer"
        >
          <span>Use This Address</span>
          <ArrowRight size={15} />
        </motion.button>
      </div>
    </form>
  );
}

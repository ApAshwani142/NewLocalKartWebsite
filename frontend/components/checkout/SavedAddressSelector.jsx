'use client';

import React, { useState } from 'react';
import { Home, Briefcase, MapPin, Plus, Check, Edit2, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedAddressSelector({
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  isFormOpen,
  onToggleForm,
  onCurrentLocationDetected
}) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];

  // Geolocation API handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse Geocode via OpenStreetMap Nominatim free API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          if (data && data.address) {
            const addr = data.address;
            const pincode = addr.postcode || '';
            const city = addr.city || addr.town || addr.village || addr.county || 'Patna';
            const state = addr.state || 'Bihar';
            const locality = addr.suburb || addr.neighbourhood || addr.road || addr.residential || '';
            const houseNo = addr.house_number || addr.building || '';

            onCurrentLocationDetected({
              pincode: pincode.replace(/\s+/g, '').slice(0, 6),
              city,
              state,
              locality,
              houseNo
            });
          } else {
            // Fallback default
            onCurrentLocationDetected({
              city: 'Patna',
              state: 'Bihar',
              locality: 'Boring Road',
              pincode: '800001'
            });
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
          onCurrentLocationDetected({
            city: 'Patna',
            state: 'Bihar',
            locality: 'Main Road',
            pincode: '800001'
          });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setLocationError('Could not fetch location. Please enter address manually.');
        console.warn('Geolocation error:', err);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const getAddressIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'work':
      case 'office':
        return <Briefcase size={16} className="text-blue-600" />;
      case 'home':
        return <Home size={16} className="text-emerald-600" />;
      default:
        return <MapPin size={16} className="text-orange-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Action Header: Use Current Location & Saved Addresses Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide uppercase flex items-center gap-2">
          <span>Saved Delivery Addresses</span>
          {savedAddresses.length > 0 && (
            <span className="bg-emerald-100 text-[#105634] text-[10px] font-black px-2 py-0.5 rounded-full">
              {savedAddresses.length} Available
            </span>
          )}
        </h3>

        {/* 📍 Use Current Location Button */}
        <motion.button
          type="button"
          onClick={handleDetectLocation}
          disabled={locating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-[#105634] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
        >
          {locating ? (
            <Loader2 size={15} className="animate-spin text-[#105634]" />
          ) : (
            <Navigation size={15} className="text-emerald-600 fill-emerald-600/20" />
          )}
          <span>{locating ? 'Detecting Location...' : '📍 Use Current Location'}</span>
        </motion.button>
      </div>

      {locationError && (
        <div className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
          ⚠️ {locationError}
        </div>
      )}

      {/* Selected Deliver To Card (UX Improvement: Skip Manual Address Entry) */}
      {!isFormOpen && selectedAddress && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50/60 border-2 border-[#105634] rounded-2xl p-5 shadow-sm relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                {getAddressIcon(selectedAddress.type)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-wide">
                    Deliver To: {selectedAddress.name}
                  </span>
                  <span className="bg-[#105634] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                    {selectedAddress.type || 'Home'}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-700 mt-1.5 leading-relaxed">
                  {selectedAddress.streetAddress || selectedAddress.houseNo}, {selectedAddress.locality}
                  {selectedAddress.landmark ? `, Near ${selectedAddress.landmark}` : ''}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode || selectedAddress.pincode}
                </p>
                <p className="text-[11px] font-extrabold text-gray-500 mt-1">
                  📞 Phone: {selectedAddress.phone}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleForm}
              className="flex items-center gap-1.5 text-xs font-black text-[#105634] hover:text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
            >
              <Edit2 size={13} />
              <span>Change</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Saved Address Horizontal/Grid Selection Chips */}
      {savedAddresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {savedAddresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id && !isFormOpen;
            return (
              <motion.div
                key={addr.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  onSelectAddress(addr);
                  if (isFormOpen) onToggleForm();
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between gap-2 relative ${
                  isSelected
                    ? 'border-[#105634] bg-emerald-50/50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAddressIcon(addr.type)}
                    <span className="text-xs font-black text-gray-900 uppercase">
                      {addr.type || 'Saved Address'}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#105634] text-white flex items-center justify-center">
                      <Check size={12} className="stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-semibold text-gray-600 line-clamp-2 leading-tight">
                  <span className="font-bold text-gray-800">{addr.name}: </span>
                  {addr.streetAddress || addr.houseNo}, {addr.locality}, {addr.city}
                </div>
              </motion.div>
            );
          })}

          {/* "+ Add New Address" Button Card */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              onAddNewAddress();
              if (!isFormOpen) onToggleForm();
            }}
            className={`p-3.5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-black min-h-[85px] ${
              isFormOpen
                ? 'border-[#105634] text-[#105634] bg-emerald-50/30'
                : 'border-gray-300 hover:border-emerald-500 text-gray-600 hover:text-[#105634] bg-gray-50/50'
            }`}
          >
            <Plus size={16} />
            <span>+ Add New Address</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}

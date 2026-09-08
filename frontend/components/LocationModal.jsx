'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLocation, PRESET_LOCATIONS } from '@/hooks/useLocation';
import { useAuth } from '@/hooks/useAuth';
import { 
  MapPin, Navigation, X, Check, Search, Compass, History, 
  Building2, Loader2, Home, Briefcase, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const {
    location,
    recentLocations,
    detectGpsLocation,
    selectLocation,
    isDetecting,
    locationError
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [apiResults, setApiResults] = useState([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // Dynamic Saved Addresses from MongoDB
  const [savedDbAddresses, setSavedDbAddresses] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      const fetchDbAddresses = async () => {
        try {
          setLoadingSaved(true);
          const res = await fetch('/api/addresses', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setSavedDbAddresses(data);
            }
          }
        } catch (err) {
          // silent fallback
        } finally {
          setLoadingSaved(false);
        }
      };
      fetchDbAddresses();
    }
  }, [isOpen, token]);

  // Debounced search for online autocomplete via OpenStreetMap
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 3) {
      setIsSearchingApi(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in&limit=5`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const formatted = data.map((item) => {
              const nameParts = item.display_name.split(',');
              const area = nameParts[0] ? nameParts[0].trim() : query;
              const city = nameParts[1] ? nameParts[1].trim() : 'Bihar';
              return {
                area,
                city,
                pincode: '802301',
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                displayName: item.display_name
              };
            });
            setApiResults(formatted);
          }
        })
        .catch(() => setApiResults([]))
        .finally(() => setIsSearchingApi(false));
    } else {
      setApiResults([]);
    }
  };

  // Preset location search filtering
  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return PRESET_LOCATIONS;
    const q = searchQuery.toLowerCase();
    return PRESET_LOCATIONS.filter(
      (item) =>
        item.area.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.pincode.includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleGpsClick = async () => {
    await detectGpsLocation(false);
    onClose();
  };

  const handleLocationClick = (loc) => {
    selectLocation(loc);
    onClose();
  };

  const handleSelectSavedAddress = (addr) => {
    const fullAddrStr = `${addr.houseNo ? addr.houseNo + ', ' : ''}${addr.street}${
      addr.landmark ? ', Near ' + addr.landmark : ''
    }, ${addr.city} - ${addr.pincode}`;

    selectLocation({
      city: addr.city,
      area: addr.area || addr.street,
      street: addr.street,
      houseNo: addr.houseNo,
      landmark: addr.landmark,
      pincode: addr.pincode,
      lat: addr.lat,
      lng: addr.lng,
      fullAddress: fullAddrStr,
      name: addr.name,
      phone: addr.phone,
      label: addr.label,
      id: addr._id
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-emerald-50/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20">
                <MapPin size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Choose your delivery location
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Select location to discover nearby stores & products
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Search Location Input with Live Autocomplete */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {isSearchingApi ? (
                  <Loader2 size={18} className="animate-spin text-emerald-600" />
                ) : (
                  <Search size={18} />
                )}
              </div>
              <input
                type="text"
                placeholder="Search Location (Area, Street, Landmark, Pincode, City)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-3 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] focus:bg-white transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setApiResults([]);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* GPS Auto Detect Button */}
            <button
              onClick={handleGpsClick}
              disabled={isDetecting}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#0e3e26] to-[#105634] hover:from-[#105634] hover:to-[#0e3e26] text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-75 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md">
                  <Navigation
                    size={18}
                    className={isDetecting ? 'animate-spin text-white' : 'text-white'}
                  />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-white text-xs sm:text-sm">
                    {isDetecting ? 'Detecting location via GPS...' : 'Use Current Location'}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-100">
                    Using Device GPS for real-time accuracy
                  </p>
                </div>
              </div>
              <Compass size={18} className="text-emerald-100" />
            </button>

            {locationError && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <span className="font-bold">Notice:</span> {locationError}
              </div>
            )}

            {/* ================================================================= */}
            {/* SAVED ADDRESSES SECTION (DYNAMIC FROM DATABASE FOR LOGGED IN)     */}
            {/* ================================================================= */}
            {user && savedDbAddresses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Home size={13} className="text-[#0e3e26]" /> Your Saved Addresses
                  </p>
                  <Link
                    href="/addresses"
                    onClick={onClose}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    Manage
                  </Link>
                </div>

                <div className="space-y-2">
                  {savedDbAddresses.map((addr) => {
                    const fullAddrStr = `${addr.houseNo ? addr.houseNo + ', ' : ''}${addr.street}${
                      addr.landmark ? ', Near ' + addr.landmark : ''
                    }, ${addr.city} - ${addr.pincode}`;
                    
                    const isSelected =
                      location.fullAddress === fullAddrStr ||
                      (location.area === addr.area && location.city === addr.city);

                    return (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-emerald-500 bg-white text-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <div className="p-1.5 rounded-lg bg-emerald-100 text-[#0e3e26] shrink-0 mt-0.5">
                            {addr.label === 'Home' ? (
                              <Home size={13} />
                            ) : addr.label === 'Work' ? (
                              <Briefcase size={13} />
                            ) : (
                              <MapPin size={13} />
                            )}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900">
                                {addr.label || 'Home'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                              {fullAddrStr}
                            </p>
                            {(addr.name || addr.phone) && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {addr.name} {addr.phone ? `• ${addr.phone}` : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700 text-white font-bold shrink-0 flex items-center gap-1">
                            <Check size={11} /> Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Online Autocomplete API Results */}
            {apiResults.length > 0 && (
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <Search size={12} className="text-emerald-500" /> Search Matches
                </p>
                <div className="space-y-2">
                  {apiResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLocationClick(item)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/40 hover:bg-emerald-100/50 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin size={16} className="text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.area}</p>
                          <p className="text-[10px] text-slate-500 truncate">{item.displayName}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Locations Section */}
            {recentLocations && recentLocations.length > 0 && (
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <History size={13} className="text-emerald-600" /> Recent Locations
                </p>
                <div className="space-y-2">
                  {recentLocations.map((recent, idx) => {
                    const isSelected =
                      location.area === recent.area && location.city === recent.city;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleLocationClick(recent)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                            : 'border-slate-200 hover:border-emerald-400 bg-slate-50/60 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <History
                            size={16}
                            className={isSelected ? 'text-emerald-600 shrink-0' : 'text-slate-400 shrink-0'}
                          />
                          <div className="truncate">
                            <p className="text-xs font-bold truncate">{recent.area}</p>
                            <p className="text-[10px] text-slate-400">
                              {recent.city} {recent.pincode ? `• ${recent.pincode}` : ''}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold shrink-0 flex items-center gap-1">
                            <Check size={12} /> Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nearby Areas Presets */}
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Building2 size={13} className="text-emerald-600" /> Nearby Markets & Areas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredPresets.map((preset, idx) => {
                  const isSelected =
                    location.area === preset.area && location.city === preset.city;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleLocationClick(preset)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-emerald-400 bg-slate-50/60 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin
                          size={15}
                          className={isSelected ? 'text-emerald-600 shrink-0' : 'text-slate-400 shrink-0'}
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">{preset.area}</p>
                          <p className="text-[10px] text-slate-400">
                            {preset.city} • {preset.pincode}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={15} className="text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { useLocation, PRESET_LOCATIONS } from '@/hooks/useLocation';
import { MapPin, Navigation, X, Check, Search, Compass, History, Building2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocationModal({ isOpen, onClose }) {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                <MapPin size={22} className="stroke-[2.5]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Choose your delivery location
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Select location to discover nearby stores & products
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Search Location Input with Live Autocomplete */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {isSearchingApi ? (
                  <Loader2 size={18} className="animate-spin text-emerald-500" />
                ) : (
                  <Search size={18} />
                )}
              </div>
              <input
                type="text"
                placeholder="Search Location (Area, Street, Landmark, Pincode, City)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-3.5 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition duration-200 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setApiResults([]);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* GPS Auto Detect Button */}
            <button
              onClick={handleGpsClick}
              disabled={isDetecting}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all duration-200 cursor-pointer disabled:opacity-75"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                  <Navigation
                    size={20}
                    className={isDetecting ? 'animate-spin text-white' : 'text-white'}
                  />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-white text-sm">
                    {isDetecting ? 'Detecting location via GPS...' : 'Use Current Location'}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-100">
                    Using Device GPS for real-time accuracy
                  </p>
                </div>
              </div>
              <Compass size={20} className="text-emerald-100" />
            </button>

            {locationError && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <span className="font-bold">Notice:</span> {locationError}
              </div>
            )}

            {/* Live Online Autocomplete API Results */}
            {apiResults.length > 0 && (
              <div>
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <Search size={12} className="text-emerald-500" /> Search Matches
                </p>
                <div className="space-y-2">
                  {apiResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLocationClick(item)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/30 hover:bg-emerald-100/50 text-left transition duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin size={16} className="text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.area}
                          </p>
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
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <History size={13} className="text-emerald-500" /> Recent Locations
                </p>
                <div className="space-y-2">
                  {recentLocations.map((recent, idx) => {
                    const isSelected =
                      location.area === recent.area && location.city === recent.city;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleLocationClick(recent)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition duration-150 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <History
                            size={16}
                            className={
                              isSelected ? 'text-emerald-600 shrink-0' : 'text-slate-400 shrink-0'
                            }
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
              <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <Building2 size={13} className="text-emerald-500" /> Nearby Markets & Areas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredPresets.map((preset, idx) => {
                  const isSelected =
                    location.area === preset.area && location.city === preset.city;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleLocationClick(preset)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin
                          size={16}
                          className={
                            isSelected
                              ? 'text-emerald-600 dark:text-emerald-400 shrink-0'
                              : 'text-slate-400 shrink-0'
                          }
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">{preset.area}</p>
                          <p className="text-[10px] text-slate-400">
                            {preset.city} • {preset.pincode}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
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

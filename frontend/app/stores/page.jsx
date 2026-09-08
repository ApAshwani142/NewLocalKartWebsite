'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { useLocation } from '@/hooks/useLocation';
import { Store as StoreIcon, Clock, Navigation, Star, Search, ChevronRight } from 'lucide-react';

const DEFAULT_STORE_LOGO = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=200';

const getStoreLogo = (logo) => {
  if (!logo || typeof logo !== 'string') return DEFAULT_STORE_LOGO;
  const trimmed = logo.trim();
  if (trimmed.startsWith('blob:') || !trimmed.startsWith('http')) return DEFAULT_STORE_LOGO;
  return trimmed;
};

export default function StoresPage() {
  const { location } = useLocation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const API_URL = '/api';

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (location.lat) queryParams.append('lat', location.lat);
        if (location.lng) queryParams.append('lng', location.lng);
        queryParams.append('limit', '30');

        const res = await fetch(`${API_URL}/stores?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setStores(data);
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [location.lat, location.lng, API_URL]);

  const filteredStores = stores.filter((store) =>
    store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb] dark:bg-slate-950 font-sans">
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Main Content */}
      <main className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-8 flex-1">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Nearby Partner Stores
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {filteredStores.length} Stores Available
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Local Kirana, Supermarkets & Express Grocery outlets delivering to{' '}
              <strong className="text-slate-700 dark:text-slate-300">{location.area || 'Grand Trunk Road'}, {location.city || 'Ara'}</strong>
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search stores or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition shadow-xs"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 bg-white dark:bg-slate-900/60 rounded-3xl animate-pulse p-6 border border-slate-100 dark:border-slate-800"></div>
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <StoreIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No stores found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or location settings.</p>
          </div>
        ) : (
          /* Store Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStores.map((store) => {
              const isClosed = store.isOpen === false;
              const isFar = !store.isDeliverable;

              return (
                <div
                  key={store._id}
                  className={`group relative flex flex-col justify-between p-5 rounded-3xl border transition-all duration-300 ${
                    isClosed || isFar
                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getStoreLogo(store.logo)}
                            alt={store.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_STORE_LOGO;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {store.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {store.area || 'Market'}, {store.city || 'Ara'}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                          isClosed
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isClosed ? 'Closed' : 'Open'}
                      </span>
                    </div>

                    {/* Metrics Pill Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 my-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                      <div className="flex flex-col items-center justify-center p-1">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Distance</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-0.5 mt-0.5">
                          <Navigation size={10} className="text-emerald-500" />
                          {store.distanceKm} km
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200/60 dark:border-slate-700/50">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Delivery</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-0.5 mt-0.5">
                          <Clock size={10} className="text-amber-500" />
                          {store.deliveryTime}
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-1">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Rating</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-0.5 mt-0.5">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          {store.rating || 4.5}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {store.productCount || 0}+ Products
                    </span>
                    <Link
                      href={`/stores/${store._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                      Visit Store
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

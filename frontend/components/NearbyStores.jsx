'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocation } from '@/hooks/useLocation';
import { Store as StoreIcon, Clock, Navigation, Star, ChevronRight, ShoppingBag } from 'lucide-react';

export default function NearbyStores() {
  const { location } = useLocation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = '/api';

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (location.lat) queryParams.append('lat', location.lat);
        if (location.lng) queryParams.append('lng', location.lng);
        queryParams.append('limit', '8');

        const res = await fetch(`${API_URL}/stores?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setStores(data);
        }
      } catch (err) {
        console.error('Error fetching nearby stores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [location.lat, location.lng, API_URL]);

  if (loading) {
    return (
      <section className="w-full py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse p-4"></div>
          ))}
        </div>
      </section>
    );
  }

  if (stores.length === 0) return null;

  return (
    <section className="w-full py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Nearby Stores
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Sorted by Nearest
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Local Kirana & Partner Supermarkets delivering to {location.area || location.city}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => {
          const isClosed = !store.isOpen;
          const isFar = !store.isDeliverable;

          return (
            <div
              key={store._id}
              className={`group relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 ${
                isClosed || isFar
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5'
              }`}
            >
              {/* Store Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {store.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {store.area}, {store.city}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                      isClosed
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isClosed ? 'Closed' : 'Open'}
                  </span>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-1.5 py-2 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
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
                      {store.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <ShoppingBag size={12} className="text-slate-400" />
                  {store.productCount || 10}+ Items
                </span>

                <Link
                  href={`/stores/${store._id}`}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition duration-200 cursor-pointer"
                >
                  Visit Store
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import React, { useEffect, useState, use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import ProductCard from '@/components/ProductCard';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, Navigation, Clock, Star, Phone, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StoreDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const { location } = useLocation();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (location.lat) queryParams.append('lat', location.lat);
        if (location.lng) queryParams.append('lng', location.lng);

        const res = await fetch(`${API_URL}/stores/${id}?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setStoreData(data);
        }
      } catch (err) {
        console.error('Error fetching store details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStore();
    }
  }, [id, location.lat, location.lng, API_URL]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 mb-4 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Homepage
        </Link>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            <div className="h-10 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              ))}
            </div>
          </div>
        ) : !storeData || !storeData.store ? (
          <div className="py-20 text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Store Not Found</h2>
            <p className="text-sm text-slate-500 mt-2">The requested nearby store could not be loaded.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Store Hero Banner & Details Card */}
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              
              {/* Cover Banner */}
              <div className="h-44 sm:h-56 w-full relative bg-slate-200 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={storeData.store.banner}
                  alt={storeData.store.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>

              {/* Store Info Content */}
              <div className="p-6 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                
                <div className="flex items-end gap-4">
                  {/* Logo */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 p-1 shadow-xl border-2 border-white dark:border-slate-800 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={storeData.store.logo}
                      alt={storeData.store.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Store Name & Subtitle */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {storeData.store.name}
                      </h1>
                      <ShieldCheck size={20} className="text-emerald-500 fill-emerald-500/20" />
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      {storeData.store.tagline || 'Hyperlocal Partner Store'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={13} className="text-slate-400" />
                      {storeData.store.address}, {storeData.store.city}
                    </p>
                  </div>
                </div>

                {/* Live Distance & Metrics Badges */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                    <Navigation size={14} className="text-emerald-600" />
                    {storeData.store.distanceKm} km away
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-bold">
                    <Clock size={14} className="text-amber-600" />
                    {storeData.store.deliveryTime}
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {storeData.store.rating} ({storeData.store.numRatings || 120}+ reviews)
                  </div>
                </div>

              </div>
            </div>

            {/* Store Products Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Store Products ({storeData.products ? storeData.products.length : 0})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Fresh stock available for immediate hyperlocal delivery
                  </p>
                </div>
              </div>

              {storeData.products && storeData.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {storeData.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-500">No products currently listed for this store.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

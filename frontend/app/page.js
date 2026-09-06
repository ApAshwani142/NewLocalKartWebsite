'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NearbyStores from '@/components/NearbyStores';
import CategorySlider from '@/components/CategorySlider';
import DealOfTheDay from '@/components/DealOfTheDay';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import LocationToast from '@/components/LocationToast';
import { useLocation } from '@/hooks/useLocation';
import { Sparkles, ShoppingBag, ArrowRight, Navigation, Flame, Star } from 'lucide-react';

export default function Home() {
  const { location, toast } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (location.lat) queryParams.append('lat', location.lat);
        if (location.lng) queryParams.append('lng', location.lng);

        const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
          }
        }
      } catch (error) {
        console.warn('Backend API fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.lat, location.lng, API_URL]);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Recommended Products: High rating / top proximity
  const recommendedProducts = filteredProducts.slice(0, 4);

  // Popular Products: Popular catalog listing
  const popularProducts = filteredProducts.slice(0, 8);

  // Trending Products: Trending items
  const trendingProducts = products.filter(
    (p) => p.isTrending || p.rating >= 4.5 || (p.category === 'Beverages' && p.price < 130)
  ).slice(0, 4);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb] dark:bg-slate-950 transition-colors duration-300 font-sans">
      {/* 1. Navbar */}
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* 2. Hero Section */}
      <Hero />

      {/* Hyperlocal Express Delivery Status Notice */}
      <div className="w-full bg-emerald-500/10 dark:bg-emerald-950/40 border-y border-emerald-500/20 py-2.5 px-4 text-center">
        <div className="max-w-[95%] mx-auto flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <Navigation size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>
            Hyperlocal Express Active: Delivering to{' '}
            <strong className="underline">{location.area || 'Ara'}, {location.city || 'Bihar'}</strong> in as fast as{' '}
            <strong>15-30 mins</strong>
          </span>
        </div>
      </div>

      {/* Main Shopping Stream */}
      <main className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-6">
        <div className="w-full flex flex-col gap-10">
          
          {/* 3. 🏪 Nearby Stores (Highest Priority) */}
          <NearbyStores />

          {/* 4. 🏷️ Browse Categories */}
          <CategorySlider
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />

          {/* Dynamic Active Promotion Banner (If available) */}
          <DealOfTheDay />

          {/* 5. ⭐ Recommended Products */}
          {recommendedProducts.length > 0 && (
            <section id="recommended" className="w-full">
              <div className="flex items-center justify-between mb-6 text-left">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-wider uppercase flex items-center gap-1.5">
                    <Star size={18} className="text-amber-500 fill-amber-500/20" />
                    Recommended For You
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide mt-1">
                    Handpicked top quality items from your closest neighborhood stores
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {recommendedProducts.map((product) => (
                  <ProductCard key={`rec-${product._id || product.id}`} product={product} layout="vertical" />
                ))}
              </div>
            </section>
          )}

          {/* 6. 🔥 Popular Products */}
          <section id="products" className="w-full">
            <div className="flex items-center justify-between mb-6 text-left">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles size={18} className="text-[#f27a21]" />
                  Popular Nearby Products
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide mt-1">
                  Fresh items sorted by closest store proximity & customer ratings
                </p>
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-black text-[#0e3e26] dark:text-emerald-400 hover:text-emerald-700 transition flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                >
                  Clear Filter <ArrowRight size={14} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-3xl h-72 animate-pulse border border-gray-100 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : popularProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <ShoppingBag size={36} className="text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-bold">No products found in this category near your location.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {popularProducts.map((product) => (
                  <ProductCard key={`pop-${product._id || product.id}`} product={product} layout="vertical" />
                ))}
              </div>
            )}
          </section>

          {/* 7. 🚀 Trending Products */}
          {trendingProducts.length > 0 && (
            <section className="w-full">
              <div className="flex items-center justify-between mb-6 text-left">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-wider uppercase flex items-center gap-1.5">
                    <Flame size={18} className="text-red-500 fill-red-500/20" />
                    Trending Express Essentials
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide mt-1">
                    Fastest selling daily items delivered ice-cold & fresh in 15 mins
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {trendingProducts.map((product) => (
                  <ProductCard key={`trend-${product._id || product.id}`} product={product} layout="vertical" />
                ))}
              </div>
            </section>
          )}

          {/* 8. 🕒 Recently Viewed */}
          <RecentlyViewed />

        </div>
      </main>

      {/* 9. Footer */}
      <Footer />

      {/* Dynamic Location Toast Notification */}
      <LocationToast toast={toast} />

      {/* Slide-out Cart Sidebar */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

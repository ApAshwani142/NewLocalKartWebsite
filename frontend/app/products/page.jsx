'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/data/mockData';
import { useLocation } from '@/hooks/useLocation';
import { Search, Sparkles, SlidersHorizontal, ArrowUpDown, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const { location } = useLocation();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'rating'

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        setError(null);
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
      } catch (err) {
        console.warn('Backend API connection error:', err.message);
        setError('Failed to load catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.lat, location.lng, API_URL]);

  // Handle category sync from homepage params if they change
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat !== null) setSelectedCategory(cat);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('default');
  };

  // Filter and Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return (b.rating || 4.5) - (a.rating || 4.5);
    }
    return 0; // Default ordering
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb]">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-[95%] mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
        {/* Breadcrumbs & Title */}
        <div className="text-left">
          <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-brand-dark transition">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Products</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-950 mt-1 tracking-tight">
            {selectedCategory ? `${selectedCategory} Collection` : 'All Groceries & Essentials'}
          </h1>
        </div>

        {/* Filter Controls Bar */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Instant Search Bar */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search in catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right: Sort controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <ArrowUpDown size={14} className="text-gray-400" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-black text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0e3e26] cursor-pointer"
            >
              <option value="default">Popularity (Default)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>

            {(selectedCategory || searchQuery || sortBy !== 'default') && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 transition px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Visual Category Slider (matching homepage style) */}
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-gray-900 tracking-wider uppercase">
              Browse by Category
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {/* 'All Categories' Option */}
            <motion.button
              onClick={() => setSelectedCategory(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2.5 shrink-0 group focus:outline-none cursor-pointer"
            >
              <div 
                className={`w-20 h-20 rounded-full bg-white flex items-center justify-center p-1.5 transition-all duration-300 ${
                  selectedCategory === null 
                    ? 'ring-4 ring-emerald-500/20 border border-brand-medium/30 scale-95 shadow-md' 
                    : 'border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-emerald-100'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200"
                    alt="All Products"
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-brand-dark/5" />
                  <span className="absolute bottom-1 right-1 text-xs bg-white/90 backdrop-blur-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-gray-100">
                    🛍️
                  </span>
                </div>
              </div>
              <span className={`text-[11px] font-black transition duration-200 ${
                selectedCategory === null ? 'text-[#0e3e26]' : 'text-gray-600 group-hover:text-gray-900'
              }`}>
                All Products
              </span>
            </motion.button>

            {CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2.5 shrink-0 group focus:outline-none cursor-pointer"
                >
                  <div 
                    className={`w-20 h-20 rounded-full bg-white flex items-center justify-center p-1.5 transition-all duration-300 ${
                      isSelected 
                        ? 'ring-4 ring-emerald-500/20 border border-brand-medium/30 scale-95 shadow-md' 
                        : 'border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-emerald-100'
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50 flex items-center justify-center">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-brand-dark/5" />
                      <span className="absolute bottom-1 right-1 text-xs bg-white/90 backdrop-blur-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-gray-100">
                        {cat.icon}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-black transition duration-200 ${
                    isSelected ? 'text-[#0e3e26]' : 'text-gray-600 group-hover:text-gray-900'
                  }`}>
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main Grid View */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-gray-100/50" />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center text-gray-400 flex flex-col items-center justify-center gap-4">
              <span className="text-3xl">🔍</span>
              <div>
                <p className="text-sm font-black text-gray-700">No products found</p>
                <p className="text-xs text-gray-400 mt-1">Try relaxing search terms or changing categories</p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-brand-medium"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product._id || product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} layout="vertical" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0e3e26] animate-spin" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Catalog...</span>
        </div>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}

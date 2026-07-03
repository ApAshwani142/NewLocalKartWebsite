'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/mockData';
import { Search, Sparkles, SlidersHorizontal, ArrowUpDown, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'rating'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setProducts(data);
          } else {
            setProducts(PRODUCTS);
          }
        } else {
          setProducts(PRODUCTS);
        }
      } catch (err) {
        console.warn('Backend API connection failed, using local mock data fallback:', err.message);
        setProducts(PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

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
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
            Showing {sortedProducts.length} of {products.length} items available in Ara
          </p>
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

        {/* Main Grid View */}
        <section className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Panel Filters (Category List) */}
          <aside className="w-full lg:w-1/4 bg-white rounded-3xl border border-gray-100 shadow-premium p-6 text-left shrink-0">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
              <SlidersHorizontal size={14} className="text-[#10b981]" />
              <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase">
                Filter Categories
              </h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === null
                    ? 'bg-[#e8f5e9] text-[#0e3e26]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>🛍️ All Categories</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                  selectedCategory === null ? 'bg-[#0e3e26]/10' : 'bg-gray-100 text-gray-400'
                }`}>
                  {products.length}
                </span>
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const categoryCount = products.filter(p => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#e8f5e9] text-[#0e3e26]'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-[#0e3e26]/10' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {categoryCount > 0 ? categoryCount : cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Panel Catalog Listings */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-gray-100/50" />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center text-gray-400 flex flex-col items-center justify-center gap-4">
                <span className="text-3xl">🔍</span>
                <div>
                  <p className="text-sm font-black text-gray-700">No products match your criteria</p>
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
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {sortedProducts.map((product) => (
                    <motion.div
                      key={product._id}
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
        </section>
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

'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategorySidebar from '@/components/CategorySidebar';
import CategorySlider from '@/components/CategorySlider';
import PromoCards from '@/components/PromoCards';
import DealOfTheDay from '@/components/DealOfTheDay';
import ProductCard from '@/components/ProductCard';
import TrustGuarantee from '@/components/TrustGuarantee';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { PRODUCTS } from '@/data/mockData';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products`);
        
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setProducts(data);
          } else {
            // If DB is empty, trigger backend seeding
            console.log('Product database is empty. Triggering seeding...');
            const seedRes = await fetch(`${API_URL}/products/seed`, { method: 'POST' });
            if (seedRes.ok) {
              const retryRes = await fetch(`${API_URL}/products`);
              const retryData = await retryRes.json();
              setProducts(retryData);
            } else {
              setProducts(PRODUCTS);
            }
          }
        } else {
          // Fallback to mock data if API fails
          console.warn('API connection failed. Using high-fidelity mock data fallback.');
          setProducts(PRODUCTS);
        }
      } catch (error) {
        console.warn('Error fetching products:', error.message);
        // Fallback to mock data
        setProducts(PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Filter trending drinks for the "Trending Beverages" section
  const trendingBeverages = products.filter(
    (p) => p.isTrending || (p.category === 'Beverages' && p.price < 130)
  ).slice(0, 3); // Get top 3 trending drinks

  // Filter popular products (typically vegetables or items on discount) for main listing
  const popularProducts = filteredProducts.filter((p) => !p.isTrending).slice(0, 6);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section Banner */}
      <Hero />

      {/* Main Body Grid */}
      <main className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Category Sidebar */}
        <aside className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-6">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => setSelectedCategory(catId)}
            />
          </div>
        </aside>

        {/* Right Side: Primary Content Stream */}
        <div className="flex-1 flex flex-col gap-10">
          {/* Browse Category Row */}
          <CategorySlider
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />

          {/* Three Gradient Promos */}
          <PromoCards />

          {/* Popular Products Heading & Grid */}
          <section id="products" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <h2 className="text-lg font-black text-gray-900 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#f27a21]" />
                  Popular Products
                </h2>
                <p className="text-xs text-gray-400 font-bold tracking-wide mt-1">
                  Ara's highest selling groceries today
                </p>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-black text-[#0e3e26] hover:text-emerald-700 transition flex items-center gap-1 uppercase tracking-wider cursor-pointer"
              >
                See All Products <ArrowRight size={14} />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-gray-100/50" />
                ))}
              </div>
            ) : popularProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
                <ShoppingBag size={36} className="text-gray-300" />
                <p className="text-sm font-bold">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {popularProducts.map((product) => (
                  <ProductCard key={product._id} product={product} layout="vertical" />
                ))}
              </div>
            )}
          </section>

          {/* Deal of the Day Count Down */}
          <DealOfTheDay />

          {/* Trending Beverages Grid */}
          <section className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <h2 className="text-lg font-black text-gray-900 tracking-wider uppercase flex items-center gap-1.5">
                  <span className="text-base">🥤</span>
                  Trending Beverages
                </h2>
                <p className="text-xs text-gray-400 font-bold tracking-wide mt-1">
                  Fresh juices and drinks delivered ice-cold
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-32 animate-pulse border border-gray-100/50" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {trendingBeverages.map((product) => (
                  <ProductCard key={product._id} product={product} layout="horizontal" />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Trust Guarantees */}
      <TrustGuarantee />

      {/* Footer */}
      <Footer />

      {/* Slide-out Cart Sidebar */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { PRODUCTS } from '@/data/mockData';
import { Star, MapPin, Trash2, ArrowLeft, Check, AlertCircle, ShoppingBag, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { user, token } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Delivery Checker State
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null); // 'available' | 'delayed' | 'unavailable'

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Find cart quantity of current product
  const cartItem = cartItems.find((item) => item.product === productId);
  const qty = cartItem ? cartItem.qty : 0;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data = null;
        let fetchedSuccessfully = false;

        // Try to fetch product details from database
        try {
          const res = await fetch(`${API_URL}/products/${productId}`);
          if (res.ok) {
            data = await res.json();
            fetchedSuccessfully = true;
          }
        } catch (fetchErr) {
          console.warn('Failed to fetch from backend API, checking fallback:', fetchErr.message);
        }

        // If not fetched from DB, try local mock data fallback
        if (!fetchedSuccessfully) {
          const mockProd = PRODUCTS.find((p) => p._id === productId);
          if (mockProd) {
            data = mockProd;
          } else {
            throw new Error('Product not found');
          }
        }

        setProduct(data);

        // Fetch recommendations from API if database product was loaded
        let recsFetched = false;
        if (fetchedSuccessfully) {
          try {
            const recRes = await fetch(`${API_URL}/products/${productId}/recommendations`);
            if (recRes.ok) {
              const recData = await recRes.json();
              setRecommendations(recData);
              recsFetched = true;
            }
          } catch (recErr) {
            console.warn('Failed to fetch recommendations:', recErr.message);
          }
        }

        // Fallback recommendations if DB call failed or using mock product
        if (!recsFetched && data) {
          const category = data.category;
          const recs = PRODUCTS.filter((p) => p._id !== data._id && p.category === category).slice(0, 4);
          if (recs.length < 4) {
            const extra = PRODUCTS.filter((p) => p._id !== data._id && p.category !== category).slice(0, 4 - recs.length);
            setRecommendations([...recs, ...extra]);
          } else {
            setRecommendations(recs);
          }
        }
      } catch (err) {
        console.warn('Error fetching product data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId, API_URL]);

  // Handle Pincode Check
  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode.trim()) return;

    const code = pincode.trim();
    if (code === '801101') {
      setDeliveryStatus('available'); // Hyperlocal 40 min delivery
    } else if (code.startsWith('801')) {
      setDeliveryStatus('delayed'); // General Bihar 2h delivery
    } else {
      setDeliveryStatus('unavailable'); // Outside delivery zone
    }
  };

  // Handle Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please write a comment');
      return;
    }

    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: Number(reviewRating),
          comment: reviewComment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setReviewSuccess('Thank you! Your review has been submitted.');
      setReviewComment('');
      setReviewRating(5);
      
      // Update local product reviews state
      setProduct(data.product);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete review');
      }

      // Update local product reviews state
      setProduct(data.product);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 rounded-full border-4 border-[#0e3e26] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9fafb]">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="flex-1 max-w-lg mx-auto py-24 px-4 text-center flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-red-500" />
          <h2 className="text-xl font-black text-gray-800">Error Loading Product</h2>
          <p className="text-xs text-gray-500 font-bold leading-relaxed">{error || 'The product could not be found.'}</p>
          <Link href="/" className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-black uppercase tracking-wider mt-4">
            Back to Homepage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb]">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-[95%] mx-auto px-4 md:px-6 py-8 flex flex-col gap-10">
        {/* Back Link */}
        <div className="text-left">
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-black text-gray-500 hover:text-brand-dark transition uppercase tracking-wider">
            <ArrowLeft size={13} /> Back to Products
          </Link>
        </div>

        {/* Product Details Section */}
        <section className="bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 md:p-10 flex flex-col lg:flex-row gap-10">
          {/* Left Block: Image View */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 rounded-2xl p-6 min-h-[300px] md:min-h-[400px] relative border border-gray-100/30 overflow-hidden">
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-50 text-[#10b981] border border-emerald-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                {product.discount}% Off
              </span>
            )}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={product.image}
              alt={product.name}
              className="max-h-[340px] max-w-full object-contain drop-shadow-md"
            />
          </div>

          {/* Right Block: Details Form */}
          <div className="flex-1 flex flex-col justify-between items-stretch text-left gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] bg-brand-light text-brand-dark border border-green-200 px-3 py-1 rounded-full font-black uppercase tracking-widest w-fit">
                {product.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mt-1">
                {product.name}
              </h1>

              {/* Rating Summaries */}
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-0.5 bg-amber-50 text-amber-500 border border-amber-100 px-2.5 py-1 rounded-lg text-xs font-black">
                  <Star size={13} className="fill-amber-500 stroke-amber-500" />
                  {product.rating ? product.rating.toFixed(1) : '4.5'}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {product.numReviews} Verified Reviews
                </span>
              </div>
            </div>

            {/* Price Detail */}
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex justify-between items-center">
              <div>
                <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">Pricing & Unit ({product.unit})</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#0e3e26]">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through font-bold">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Cart Controller Adjuster */}
              <AnimatePresence mode="wait">
                {qty > 0 ? (
                  <motion.div
                    key="qty-adj"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center bg-[#0e3e26] text-white rounded-full overflow-hidden shadow-sm border border-green-800"
                  >
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => updateQuantity(product._id, qty - 1)}
                      className="px-3.5 py-2 hover:bg-green-800 transition text-xs font-bold cursor-pointer"
                    >
                      <Minus size={13} className="stroke-[3]" />
                    </motion.button>
                    <span className="px-1 text-xs font-black min-w-[20px] text-center">{qty}</span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => updateQuantity(product._id, qty + 1)}
                      className="px-3.5 py-2 hover:bg-green-800 transition text-xs font-bold cursor-pointer"
                    >
                      <Plus size={13} className="stroke-[3]" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="add-btn"
                    whileHover={{ scale: 1.05, backgroundColor: '#105634' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 bg-[#0e3e26] text-white px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase transition shadow-md shadow-brand-dark/10 cursor-pointer"
                  >
                    <Plus size={13} className="stroke-[3]" /> Add to Cart
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Address Pincode Checker */}
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col gap-3 text-left">
              <label className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <MapPin size={13} className="text-emerald-500" /> Check Delivery Availability
              </label>
              
              <form onSubmit={handlePincodeCheck} className="flex gap-2 w-full max-w-md">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter Pincode (e.g. 801101)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 flex-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26]"
                />
                <button
                  type="submit"
                  className="bg-brand-dark hover:bg-brand-medium text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition"
                >
                  Check
                </button>
              </form>

              {/* Delivery checker notification banners */}
              {deliveryStatus === 'available' && (
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Check size={14} className="stroke-[3]" /> Delivery available in 40 mins at your address! (Hyperlocal Ara Partner Store)
                </p>
              )}
              {deliveryStatus === 'delayed' && (
                <p className="text-xs text-[#d97706] font-bold flex items-center gap-1">
                  <Check size={14} className="stroke-[3]" /> Delivery available within 2 hours at this location.
                </p>
              )}
              {deliveryStatus === 'unavailable' && (
                <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                  ❌ Delivery not available at this pincode (We currently serve Ara, Bihar area only).
                </p>
              )}
            </div>

            {/* Description Text */}
            <div className="text-left flex flex-col gap-2 border-t border-gray-50 pt-5">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                Product Details
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {product.description || 'Fresh and premium quality product locally sourced and delivered in under 40 minutes.'}
              </p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 md:p-10 text-left flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">
              Customer Feedback
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
              Verify customer reviews and experience details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews list (2 columns) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {product.reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-250 p-8 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">💬</span>
                  <p className="text-xs font-bold">No reviews submitted yet.</p>
                  <p className="text-[10px] text-gray-400">Be the first to share your purchase experience!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {product.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left flex flex-col gap-2 relative group"
                    >
                      {/* Delete review button (visible to author) */}
                      {user && user._id === rev.user.toString() && (
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          title="Delete Review"
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center uppercase">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-800">{rev.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold">
                              {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Star Rating display */}
                        <div className="flex items-center gap-0.5 text-xs font-black text-amber-500 pr-6">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < rev.rating
                                  ? 'fill-amber-500 stroke-amber-500'
                                  : 'text-gray-200'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 font-medium leading-relaxed pl-9 mt-1">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Block (1 column) */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left flex flex-col gap-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                Write a Review
              </h3>

              {!user ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-6">
                  <p className="text-xs text-gray-400 font-bold leading-normal">
                    You must be signed in to submit product feedback.
                  </p>
                  <Link
                    href="/login"
                    className="px-5 py-2 bg-brand-dark text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md hover:bg-brand-medium"
                  >
                    Login to Review
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-3.5">
                  {reviewSuccess && (
                    <p className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold p-3 rounded-xl">
                      {reviewSuccess}
                    </p>
                  )}
                  {reviewError && (
                    <p className="text-xs bg-red-50 border border-red-100 text-red-600 font-bold p-3 rounded-xl">
                      ⚠️ {reviewError}
                    </p>
                  )}

                  {/* Rating selection stars */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">
                      Overall Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-amber-400 hover:scale-110 transition cursor-pointer"
                        >
                          <Star
                            size={20}
                            className={
                              star <= reviewRating
                                ? 'fill-amber-400 stroke-amber-400'
                                : 'text-gray-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">
                      Share your experience
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your feedback here..."
                      className="bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-brand-dark hover:bg-brand-medium text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>

                  <p className="text-[9px] text-gray-400 font-bold leading-normal leading-relaxed mt-1">
                    * Note: To maintain community reliability, feedback forms are only enabled for users who have ordered this item. Reviews are final and cannot be edited, but you may delete your review at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Recommendations Grid */}
        <section className="w-full">
          <div className="text-left mb-6">
            <h2 className="text-lg font-black text-gray-900 tracking-wider uppercase flex items-center gap-1.5">
              <span className="text-base">✨</span>
              You May Also Like
            </h2>
            <p className="text-xs text-gray-400 font-bold tracking-wide mt-1">
              Recommended based on categories and popular local selections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {recommendations.map((recProduct) => (
              <ProductCard key={recProduct._id} product={recProduct} layout="vertical" />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

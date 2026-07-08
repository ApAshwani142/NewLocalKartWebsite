'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { X, ShoppingBag, Plus, Minus, Trash2, MapPin, CreditCard, ChevronRight } from 'lucide-react';

export default function CartModal({ isOpen, onClose }) {
  const router = useRouter();
  const { user, token } = useAuth();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    totalPrice
  } = useCart();

  const [address, setAddress] = useState('Bihar, India - 801101');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Razorpay'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Load Razorpay script dynamically
  useEffect(() => {
    if (paymentMethod === 'Razorpay' && isOpen) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [paymentMethod, isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login
      onClose();
      router.push('/login');
      return;
    }

    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order in backend
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems: cartItems,
          deliveryAddress: address,
          paymentMethod,
          subtotal,
          deliveryFee,
          tax,
          totalPrice
        })
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.message || 'Failed to place order');
      }

      if (paymentMethod === 'COD') {
        // COD order placed successfully
        clearCart();
        onClose();
        router.push('/orders');
      } else {
        // Razorpay order flow
        const { order, razorpayOrder } = orderData;

        if (razorpayOrder.isDemo) {
          // Demo Mode - Mock Payment pop-up
          const confirmPayment = window.confirm(
            `DEMO MODE ACTIVE\n\nMock Payment details:\nOrder ID: ${order._id}\nRazorpay ID: ${razorpayOrder.id}\nAmount: ₹${totalPrice}\n\nClick OK to simulate successful payment.`
          );

          if (confirmPayment) {
            // Send verification
            const verifyRes = await fetch(`${API_URL}/orders/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                orderId: order._id,
                razorpay_order_id: razorpayOrder.id,
                razorpay_payment_id: `pay_mock_${Math.random().toString(36).substr(2, 9)}`,
                razorpay_signature: 'mock_signature'
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              clearCart();
              onClose();
              router.push('/orders');
            } else {
              throw new Error(verifyData.message || 'Mock payment verification failed');
            }
          } else {
            setLoading(false);
          }
        } else {
          // Real Razorpay SDK Execution
          if (!window.Razorpay) {
            throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
          }

          const options = {
            key: razorpayOrder.keyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'e-LocalKart',
            description: 'Grocery Order Checkout',
            order_id: razorpayOrder.id,
            handler: async function (response) {
              try {
                // Verify signature on backend
                const verifyRes = await fetch(`${API_URL}/orders/verify`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    orderId: order._id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });

                const verifyData = await verifyRes.json();
                if (verifyRes.ok && verifyData.success) {
                  clearCart();
                  onClose();
                  router.push('/orders');
                } else {
                  alert(`Payment Verification Failed: ${verifyData.message}`);
                }
              } catch (err) {
                alert(`Error verifying signature: ${err.message}`);
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.phone
            },
            notes: {
              address: address
            },
            theme: {
              color: '#0e3e26'
            }
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.on('payment.failed', function (response) {
            alert(`Payment Failed: ${response.error.description}`);
          });
          rzp1.open();
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Pane */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={20} className="text-[#0e3e26]" />
              <h2 className="text-base font-black text-gray-900 tracking-wide">
                Your Shopping Cart
              </h2>
              {cartItems.length > 0 && (
                <span className="bg-brand-dark/10 text-brand-dark text-xs font-black px-2.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-900 transition hover:bg-gray-100 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3.5 rounded-2xl text-left">
                ⚠️ {error}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-300">
                  <ShoppingBag size={36} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-800">Your Cart is Empty</h3>
                  <p className="text-xs text-gray-400 font-bold mt-1 max-w-[200px] leading-relaxed">
                    Explore categories and add fresh items to get started!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-brand-dark hover:bg-brand-medium text-white text-xs font-black rounded-full uppercase tracking-wider transition cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* List Items */}
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex gap-4 border-b border-gray-50 pb-4 items-center justify-between"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                      />
                      
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="text-xs font-black text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                          {item.unit}
                        </p>
                        <p className="text-xs font-black text-brand-dark mt-1">
                          ₹{item.price}
                        </p>
                      </div>

                      {/* Quantity adjusts */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.product, item.qty - 1)}
                            className="p-1 px-2 text-gray-500 hover:bg-gray-100 transition text-[11px] font-black cursor-pointer"
                          >
                            <Minus size={10} className="stroke-[3]" />
                          </button>
                          <span className="text-xs font-black text-gray-800 min-w-[12px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product, item.qty + 1)}
                            className="p-1 px-2 text-gray-500 hover:bg-gray-100 transition text-[11px] font-black cursor-pointer"
                          >
                            <Plus size={10} className="stroke-[3]" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-gray-300 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery details panel */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left">
                  <h4 className="text-[10px] font-extrabold tracking-widest text-[#0e3e26] uppercase mb-3 flex items-center gap-1.5">
                    <MapPin size={13} className="text-emerald-500" />
                    Delivery Information
                  </h4>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-400 font-bold tracking-wide">
                      SHIPPING ADDRESS
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0e3e26] text-xs font-bold text-gray-700"
                    />
                  </div>
                </div>

                {/* Payment select pane */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left">
                  <h4 className="text-[10px] font-extrabold tracking-widest text-[#0e3e26] uppercase mb-3 flex items-center gap-1.5">
                    <CreditCard size={13} className="text-emerald-500" />
                    Payment Method
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 cursor-pointer text-xs font-black text-gray-700">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-brand-dark"
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>

                    <label className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 cursor-pointer text-xs font-black text-gray-700">
                      <input
                        type="radio"
                        name="payment"
                        value="Razorpay"
                        checked={paymentMethod === 'Razorpay'}
                        onChange={() => setPaymentMethod('Razorpay')}
                        className="accent-brand-dark"
                      />
                      <span className="flex items-center gap-1.5">
                        Razorpay <span className="text-[9px] bg-blue-50 text-blue-500 border border-blue-100 rounded px-1.5 py-0.5">CARDS/UPI/NET</span>
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Checkout Totals & Button */}
          {cartItems.length > 0 && (
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-2 text-xs font-bold text-gray-500">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-black text-gray-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-black text-gray-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-500">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-black text-gray-800">₹{tax}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-100 pt-2.5 mt-1">
                  <span>Total Amount</span>
                  <span className="text-[#0e3e26] text-base">₹{totalPrice}</span>
                </div>
              </div>

              {/* Action Trigger */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-brand-dark hover:bg-brand-medium text-white py-4 rounded-full text-xs font-black tracking-widest uppercase flex items-center justify-center gap-1 shadow-lg shadow-brand-dark/15 cursor-pointer disabled:opacity-50 transition"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : !user ? (
                  <>Login to Checkout <ChevronRight size={14} /></>
                ) : paymentMethod === 'Razorpay' ? (
                  <>Pay via Razorpay <ChevronRight size={14} /></>
                ) : (
                  <>Confirm Order (COD) <ChevronRight size={14} /></>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

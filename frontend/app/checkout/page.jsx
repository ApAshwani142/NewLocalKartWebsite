'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useLocation } from '@/hooks/useLocation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Lock, Loader2, AlertCircle, MapPin, 
  CheckCircle2, Edit3, User, Phone, Building2 
} from 'lucide-react';

// Modular Checkout Components
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import MobileStickyFooter from '@/components/checkout/MobileStickyFooter';
import OrderSuccessModal from '@/components/checkout/OrderSuccessModal';
import LocationModal from '@/components/LocationModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const { cartItems, subtotal, deliveryFee, tax, totalPrice, clearCart } = useCart();
  const { location, selectLocation } = useLocation();

  // Step 3 = Payment & Review (Step 2 Address is already selected at site start!)
  const [step, setStep] = useState(3);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Payment Selection States
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'COD' | 'WALLET' | 'NETBANKING'
  const [expandedPayment, setExpandedPayment] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('PhonePe Wallet');
  const [selectedBank, setSelectedBank] = useState('SBI');

  // Checkout API states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(null);

  const API_URL = '/api';

  // Guard: Authenticate user & check empty cart
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user && cartItems.length === 0 && !orderCreated) {
      router.push('/');
    }
  }, [cartItems, authLoading, user, orderCreated, router]);

  // If user has saved database addresses and none selected yet, auto-select default from DB
  useEffect(() => {
    if (token && !location.fullAddress) {
      fetch(`${API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const def = data.find((a) => a.isDefault) || data[0];
            const full = `${def.houseNo ? def.houseNo + ', ' : ''}${def.street}${
              def.landmark ? ', Near ' + def.landmark : ''
            }, ${def.city} - ${def.pincode}`;

            selectLocation({
              city: def.city,
              area: def.area || def.street,
              street: def.street,
              houseNo: def.houseNo,
              landmark: def.landmark,
              pincode: def.pincode,
              lat: def.lat,
              lng: def.lng,
              fullAddress: full,
              name: def.name || user?.name || '',
              phone: def.phone || user?.phone || '',
              label: def.label
            });
          }
        })
        .catch(() => {});
    }
  }, [token, location.fullAddress, selectLocation, user]);

  // Formatted active delivery address
  const activeDeliveryAddress =
    location.fullAddress ||
    `${location.street || location.area || 'Grand Trunk Road'}, ${location.city || 'Ara'} - ${
      location.pincode || '802301'
    }`;

  const recipientName = location.name || user?.name || 'Customer';
  const recipientPhone = location.phone || user?.phone || 'Mobile not provided';

  // Submit Order API Handler
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    const fullDeliveryAddress = `${activeDeliveryAddress}. Contact: ${recipientName} (${recipientPhone})`;
    const backendPaymentMethod = paymentMethod === 'COD' ? 'COD' : 'Razorpay';

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems: cartItems,
          deliveryAddress: fullDeliveryAddress,
          paymentMethod: backendPaymentMethod,
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

      clearCart();
      setOrderCreated(orderData.order || orderData);
      setStep(4); // Success review step
    } catch (err) {
      setError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  // Discount calculation for FIRST50 coupon
  const discountAmount = Math.round(subtotal * 0.1);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col font-sans antialiased text-gray-900 pb-24 md:pb-12">
      {/* Header: Clean logo & back navigation */}
      <CheckoutHeader onBackToCart={() => router.push('/')} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Stepper (Step 1 Cart & Step 2 Address marked completed) */}
        <CheckoutStepper step={step} setStep={setStep} />

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-xs font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 text-xs font-black cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* STEP 3: PAYMENT & CONFIRMED DELIVERY DETAILS */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Left Column: Delivery Address Summary + Payment Options (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              {/* Confirmed Delivery Destination Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-5 md:p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-100 text-[#0e3e26]">
                      <MapPin size={18} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                          Delivery Destination
                        </h3>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={10} className="stroke-[3]" /> Selected at Start
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Your order will be delivered to this verified address
                      </p>
                    </div>
                  </div>

                  {/* Change Address Button */}
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#0e3e26] hover:text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/60 px-3 py-1.5 rounded-xl border border-emerald-200 transition cursor-pointer"
                  >
                    <Edit3 size={12} /> Change
                  </button>
                </div>

                {/* Address Details */}
                <div className="bg-gray-50/80 rounded-2xl p-3.5 border border-gray-150 flex flex-col gap-1.5">
                  <p className="text-xs font-extrabold text-slate-900 leading-relaxed">
                    {activeDeliveryAddress}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 mt-1 pt-1.5 border-t border-gray-200/60">
                    <span className="flex items-center gap-1.5">
                      <User size={13} className="text-[#0e3e26]" /> {recipientName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} className="text-[#0e3e26]" /> {recipientPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-5 md:p-8 flex flex-col gap-6">
                <PaymentOptions
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  expandedPayment={expandedPayment}
                  setExpandedPayment={setExpandedPayment}
                  upiId={upiId}
                  setUpiId={setUpiId}
                  cardNumber={cardNumber}
                  setCardNumber={setCardNumber}
                  cardExpiry={cardExpiry}
                  setCardExpiry={setCardExpiry}
                  cardCvv={cardCvv}
                  setCardCvv={setCardCvv}
                  cardName={cardName}
                  setCardName={setCardName}
                  selectedWallet={selectedWallet}
                  setSelectedWallet={setSelectedWallet}
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                />

                {/* Back & Place Order CTA */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ArrowLeft size={15} /> Back to Shopping
                  </button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full sm:flex-1 py-4 bg-[#0e3e26] hover:bg-[#105634] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer shadow-md shadow-emerald-900/10 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={15} />
                        <span>Confirm & Pay ₹{totalPrice}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 Cols) */}
            <div className="lg:col-span-5 w-full">
              <OrderSummaryCard
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                tax={tax}
                totalPrice={totalPrice}
                discountAmount={discountAmount}
              />
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS MODAL */}
        {step === 4 && orderCreated && (
          <OrderSuccessModal
            order={orderCreated}
            onContinueShopping={() => {
              router.push('/');
            }}
          />
        )}
      </main>

      {/* Mobile Sticky Footer */}
      <MobileStickyFooter
        step={step}
        totalPrice={totalPrice}
        onContinue={handlePlaceOrder}
        onBack={() => router.push('/')}
        loading={loading}
      />

      {/* Location Modal for changing address directly in checkout */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

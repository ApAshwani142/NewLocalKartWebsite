'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Loader2, AlertCircle } from 'lucide-react';

// Modular Checkout Components
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import SavedAddressSelector from '@/components/checkout/SavedAddressSelector';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import MobileStickyFooter from '@/components/checkout/MobileStickyFooter';
import OrderSuccessModal from '@/components/checkout/OrderSuccessModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const { cartItems, subtotal, deliveryFee, tax, totalPrice, clearCart } = useCart();

  // Steps: 1 = Cart, 2 = Address, 3 = Payment, 4 = Review/Success
  const [step, setStep] = useState(2);

  // Default demo saved addresses for logged-in users + localStorage addresses
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'addr_1',
      name: 'Priyanshu Pathak',
      phone: '9876543210',
      type: 'Home',
      houseNo: 'Flat 402, Royal Residency',
      locality: 'Boring Road',
      landmark: 'Near AN College',
      city: 'Patna',
      state: 'Bihar',
      postalCode: '800001',
      isDefault: true
    },
    {
      id: 'addr_2',
      name: 'Priyanshu Pathak',
      phone: '9876543210',
      type: 'Work',
      houseNo: 'Plot 12, Tech Park, Floor 3',
      locality: 'Kankarbagh Main Road',
      landmark: 'Opposite Dominoes',
      city: 'Patna',
      state: 'Bihar',
      postalCode: '800020',
      isDefault: false
    }
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState('addr_1');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    houseNo: '',
    locality: '',
    landmark: '',
    city: 'Patna',
    state: 'Bihar',
    addressType: 'Home',
    isDefault: false
  });

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

  // Sync user details to form & load saved custom addresses from localStorage
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || ''
      }));

      try {
        const stored = localStorage.getItem('localkart_saved_addresses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedAddresses(parsed);
            const def = parsed.find((a) => a.isDefault) || parsed[0];
            if (def) setSelectedAddressId(def.id);
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved addresses:', e);
      }
    }
  }, [user]);

  // Selected address object helper
  const activeAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  // Geolocation auto-fill handler
  const handleCurrentLocationDetected = (locData) => {
    setFormData((prev) => ({
      ...prev,
      city: locData.city || prev.city,
      state: locData.state || prev.state,
      locality: locData.locality || prev.locality,
      houseNo: locData.houseNo || prev.houseNo,
      pincode: locData.pincode || prev.pincode
    }));
    setIsFormOpen(true); // Open form so user can review detected details
  };

  // Add / Save Address handler
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.pincode ||
      !formData.houseNo ||
      !formData.locality ||
      !formData.city ||
      !formData.state
    ) {
      setError('Please fill in all required address fields');
      return;
    }

    const newAddr = {
      id: `addr_${Date.now()}`,
      name: formData.fullName,
      phone: formData.phone,
      type: formData.addressType || 'Home',
      houseNo: formData.houseNo,
      streetAddress: formData.houseNo,
      locality: formData.locality,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      postalCode: formData.pincode,
      pincode: formData.pincode,
      isDefault: formData.isDefault
    };

    const updated = [newAddr, ...savedAddresses.map((a) => (formData.isDefault ? { ...a, isDefault: false } : a))];
    setSavedAddresses(updated);
    setSelectedAddressId(newAddr.id);
    setIsFormOpen(false);
    setError(null);

    try {
      localStorage.setItem('localkart_saved_addresses', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  // Proceed from Address Step 2 to Payment Step 3
  const handleProceedToPayment = () => {
    if (isFormOpen) {
      // Validate active form if open
      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.pincode ||
        !formData.houseNo ||
        !formData.locality ||
        !formData.city ||
        !formData.state
      ) {
        setError('Please complete the address form or select a saved address');
        return;
      }
    }
    setError(null);
    setStep(3);
  };

  // Submit Order API Handler
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    const targetAddr = isFormOpen
      ? {
          name: formData.fullName,
          phone: formData.phone,
          houseNo: formData.houseNo,
          locality: formData.locality,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      : activeAddress;

    const fullDeliveryAddress = `${targetAddr.houseNo || targetAddr.streetAddress}, ${targetAddr.locality}${
      targetAddr.landmark ? ', Near ' + targetAddr.landmark : ''
    }, ${targetAddr.city}, ${targetAddr.state} - ${targetAddr.postalCode || targetAddr.pincode}. Contact: ${targetAddr.name} (${targetAddr.phone})`;

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
      setError(err.message || 'Something went wrong while placing order');
    } finally {
      setLoading(false);
    }
  };

  // Discount calculation for FIRST50 coupon
  const discountAmount = Math.round(subtotal * 0.1);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col font-sans antialiased text-gray-900 pb-24 md:pb-12">
      {/* Requirement 1: Distraction-free Header (Only logo + Secure Checkout badge) */}
      <CheckoutHeader onBackToCart={() => router.push('/')} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Requirement 2: 4-Step Animated Progress Stepper */}
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

        {/* Animated Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 2: ADDRESS STEP */}
          {step === 2 && (
            <motion.div
              key="step-address"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto"
            >
              {/* Left Column: Saved Addresses & Form (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-premium p-5 md:p-8 flex flex-col gap-6 text-left">
                {/* Saved Address Selector (Supports instant selection & skip UX) */}
                <SavedAddressSelector
                  savedAddresses={savedAddresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={(addr) => setSelectedAddressId(addr.id)}
                  onAddNewAddress={() => {
                    setFormData({
                      fullName: user?.name || '',
                      phone: user?.phone || '',
                      pincode: '',
                      houseNo: '',
                      locality: '',
                      landmark: '',
                      city: 'Patna',
                      state: 'Bihar',
                      addressType: 'Home',
                      isDefault: false
                    });
                    setIsFormOpen(true);
                  }}
                  isFormOpen={isFormOpen}
                  onToggleForm={() => setIsFormOpen(!isFormOpen)}
                  onCurrentLocationDetected={handleCurrentLocationDetected}
                />

                {/* Manual Address Form (Opened via + Add New Address or Change) */}
                <AnimatePresence>
                  {isFormOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-100 pt-6 mt-2 overflow-hidden"
                    >
                      <AddressForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSaveAddress}
                        onCancel={() => setIsFormOpen(false)}
                        error={error}
                        setError={setError}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-6 mt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto px-6 py-3.5 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ArrowLeft size={15} /> Back to Cart
                  </button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToPayment}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#105634] hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer shadow-lg shadow-emerald-500/15"
                  >
                    <span>Continue to Payment • ₹{totalPrice}</span>
                    <ArrowRight size={15} />
                  </motion.button>
                </div>
              </div>

              {/* Right Column: Sticky Order Summary (5 Cols) */}
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
            </motion.div>
          )}

          {/* STEP 3: PAYMENT STEP */}
          {step === 3 && (
            <motion.div
              key="step-payment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto"
            >
              {/* Left Column: Payment Options (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-premium p-5 md:p-8 flex flex-col gap-6 text-left">
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
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto px-6 py-3.5 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ArrowLeft size={15} /> Back to Address
                  </button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full sm:flex-1 py-4 bg-[#105634] hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={15} />
                        <span>Pay ₹{totalPrice} Securely</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Right Column: Sticky Order Summary (5 Cols) */}
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
            </motion.div>
          )}

          {/* STEP 4: ORDER SUCCESS */}
          {step === 4 && (
            <OrderSuccessModal
              key="step-success"
              orderCreated={orderCreated}
              totalPrice={totalPrice}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Requirement 10: Mobile Sticky Bottom CTA Footer */}
      <MobileStickyFooter
        step={step}
        totalPrice={totalPrice}
        onContinue={step === 2 ? handleProceedToPayment : handlePlaceOrder}
        onBack={() => (step === 3 ? setStep(2) : router.push('/'))}
        loading={loading}
      />
    </div>
  );
}

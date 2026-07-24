'use client';

import React, { useState } from 'react';
import { QrCode, CreditCard, Truck, Wallet, Landmark, ChevronDown, ChevronRight, Check, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentOptions({
  paymentMethod,
  setPaymentMethod,
  expandedPayment,
  setExpandedPayment,
  upiId,
  setUpiId,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  cardName,
  setCardName,
  selectedWallet,
  setSelectedWallet,
  selectedBank,
  setSelectedBank
}) {
  const options = [
    {
      id: 'UPI',
      title: 'UPI / Instant QR Code',
      subtitle: 'Google Pay, PhonePe, Paytm, BHIM & all UPI apps',
      icon: QrCode,
      badge: '⚡ Fastest & Recommended',
      color: 'emerald'
    },
    {
      id: 'CARD',
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay & Maestro accepted',
      icon: CreditCard,
      badge: 'Zero Convenience Fee',
      color: 'blue'
    },
    {
      id: 'COD',
      title: 'Cash on Delivery',
      subtitle: 'Pay cash or scan QR code when your order arrives',
      icon: Truck,
      badge: '💵 Pay at Doorstep',
      color: 'green'
    },
    {
      id: 'WALLET',
      title: 'Wallets & Pay Later',
      subtitle: 'Amazon Pay, Paytm Wallet, PhonePe Wallet & Lazypay',
      icon: Wallet,
      badge: 'Instant Cashback',
      color: 'purple'
    },
    {
      id: 'NETBANKING',
      title: 'Net Banking',
      subtitle: 'SBI, HDFC, ICICI, Axis, PNB & 50+ Indian banks',
      icon: Landmark,
      badge: 'Secure Bank Transfer',
      color: 'amber'
    }
  ];

  const handleSelect = (id) => {
    setPaymentMethod(id);
    setExpandedPayment(expandedPayment === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            Select Payment Method
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            256-bit SSL Encrypted & 100% Safe Transactions
          </p>
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 text-[#105634] text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={14} />
          <span>Safe Checkout</span>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 mt-1">
        {options.map((opt) => {
          const isSelected = paymentMethod === opt.id;
          const isExpanded = expandedPayment === opt.id;
          const Icon = opt.icon;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.005 }}
              className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-xs ${
                isSelected
                  ? 'border-[#105634] bg-emerald-50/20 ring-4 ring-emerald-500/10'
                  : 'border-gray-200 bg-white hover:border-emerald-300'
              }`}
            >
              {/* Card Header Row */}
              <button
                type="button"
                onClick={() => handleSelect(opt.id)}
                className="w-full flex items-center justify-between p-4 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Selection Radio Circle */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-[#105634] bg-[#105634]'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>

                  {/* Icon Container */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#105634] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Text Container */}
                  <div className="leading-tight min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-gray-900">{opt.title}</p>
                      {opt.badge && (
                        <span className="bg-emerald-100 text-[#105634] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 font-semibold truncate mt-0.5">
                      {opt.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-gray-400 shrink-0 ml-2">
                  {isExpanded ? (
                    <ChevronDown size={18} className="text-[#105634]" />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </div>
              </button>

              {/* Accordion Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 pb-5 pt-1 border-t border-gray-100/80"
                  >
                    {/* UPI Details */}
                    {opt.id === 'UPI' && (
                      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white border border-emerald-100 rounded-2xl p-4 mt-2">
                        {/* Stylized QR Box */}
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <div className="w-24 h-24 bg-white border-2 border-[#105634] rounded-xl p-1.5 shadow-inner">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              <rect x="10" y="10" width="60" height="60" rx="6" fill="none" stroke="#105634" strokeWidth="10"/>
                              <rect x="25" y="25" width="30" height="30" rx="2" fill="#105634"/>
                              <rect x="130" y="10" width="60" height="60" rx="6" fill="none" stroke="#105634" strokeWidth="10"/>
                              <rect x="145" y="25" width="30" height="30" rx="2" fill="#105634"/>
                              <rect x="10" y="130" width="60" height="60" rx="6" fill="none" stroke="#105634" strokeWidth="10"/>
                              <rect x="25" y="145" width="30" height="30" rx="2" fill="#105634"/>
                              <rect x="90" y="10" width="12" height="12" rx="2" fill="#105634"/>
                              <rect x="108" y="28" width="12" height="12" rx="2" fill="#105634"/>
                              <rect x="90" y="90" width="12" height="12" rx="2" fill="#105634"/>
                              <rect x="126" y="90" width="12" height="12" rx="2" fill="#105634"/>
                              <rect x="144" y="126" width="12" height="12" rx="2" fill="#105634"/>
                              <circle cx="100" cy="100" r="14" fill="white" stroke="#105634" strokeWidth="2"/>
                              <text x="100" y="104" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#105634">LK</text>
                            </svg>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 text-center">
                            Scan with GPay/PhonePe
                          </span>
                        </div>

                        {/* UPI ID Input & Apps */}
                        <div className="flex flex-col gap-3 flex-1 w-full">
                          <label className="text-xs font-black text-gray-700">
                            Or enter your UPI VPA ID
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. mobile@upi or username@okicici"
                              className="w-full border-2 border-gray-200 focus:border-[#105634] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none transition pr-20 bg-white"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#105634] text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-700 transition"
                            >
                              VERIFY
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold">Quick Pay:</span>
                            <div className="flex gap-2">
                              {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                                <span
                                  key={app}
                                  className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-[10px] font-black text-gray-700 cursor-pointer hover:bg-emerald-50 hover:text-[#105634] transition"
                                >
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CARD Details */}
                    {opt.id === 'CARD' && (
                      <div className="grid grid-cols-2 gap-3 mt-2 bg-white border border-blue-100 p-4 rounded-2xl">
                        <div className="col-span-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wide">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234  5678  9012  3456"
                            maxLength={19}
                            className="mt-1 w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold outline-none transition bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wide">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            maxLength={5}
                            className="mt-1 w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold outline-none transition bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wide">
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            maxLength={4}
                            className="mt-1 w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold outline-none transition bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-wide">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Name as printed on card"
                            className="mt-1 w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold outline-none transition bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* COD Details */}
                    {opt.id === 'COD' && (
                      <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
                        <span className="text-xl">💵</span>
                        <p className="text-xs font-bold text-[#0e3e26] leading-relaxed">
                          No advance payment needed! Keep exact cash ready or scan the delivery partner's QR code upon arrival.
                        </p>
                      </div>
                    )}

                    {/* WALLET Details */}
                    {opt.id === 'WALLET' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
                        {['PhonePe Wallet', 'Paytm Wallet', 'Amazon Pay', 'Mobikwik'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setSelectedWallet(w)}
                            className={`py-3 px-2 rounded-xl border-2 text-[11px] font-black transition cursor-pointer flex flex-col items-center gap-1 ${
                              selectedWallet === w
                                ? 'border-[#105634] bg-emerald-50 text-[#105634]'
                                : 'border-gray-200 hover:border-emerald-300 text-gray-700 bg-white'
                            }`}
                          >
                            <span>👛</span>
                            <span>{w}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* NETBANKING Details */}
                    {opt.id === 'NETBANKING' && (
                      <div className="flex flex-col gap-3 mt-2">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak'].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`py-2 rounded-xl border-2 text-[10px] font-black transition cursor-pointer ${
                                selectedBank === bank
                                  ? 'border-[#105634] bg-emerald-50 text-[#105634]'
                                  : 'border-gray-200 hover:border-emerald-300 text-gray-700 bg-white'
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="border-2 border-gray-200 focus:border-[#105634] rounded-xl px-3 py-2.5 text-xs font-bold outline-none transition w-full bg-white text-gray-800"
                        >
                          <option value="">Choose another bank...</option>
                          <option value="Yes Bank">Yes Bank</option>
                          <option value="IndusInd Bank">IndusInd Bank</option>
                          <option value="Federal Bank">Federal Bank</option>
                          <option value="Bank of Baroda">Bank of Baroda</option>
                          <option value="Union Bank">Union Bank of India</option>
                        </select>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

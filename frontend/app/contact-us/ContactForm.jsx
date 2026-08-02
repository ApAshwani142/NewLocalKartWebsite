'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Order Query',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm text-left">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
        Send Us a Message
      </h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6">
        Fill out the form below and our customer experience team will get back to you within 2 hours.
      </p>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-6 text-center flex flex-col items-center gap-3">
          <CheckCircle2 size={40} className="text-emerald-500" />
          <h4 className="text-base font-black text-emerald-900 dark:text-emerald-300">Message Received!</h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            Thank you for contacting e-LocalKart. Ticket reference ID: <strong>#ELK-{Math.floor(100000 + Math.random() * 900000)}</strong>. Our representative will contact you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 text-xs font-black text-emerald-700 underline uppercase tracking-wider cursor-pointer"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Inquiry Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Order Query">Order Status & Delivery</option>
                <option value="Refund & Return">Refund & Returns</option>
                <option value="Shopkeeper Onboarding">Become a Shopkeeper Partner</option>
                <option value="Delivery Partner">Join as Delivery Rider</option>
                <option value="Feedback">Feedback & Suggestions</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Your Message *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your query in detail..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0e3e26] hover:bg-emerald-800 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md cursor-pointer transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Submitting...' : 'Send Message Now'}
            <Send size={15} />
          </button>
        </form>
      )}
    </div>
  );
}

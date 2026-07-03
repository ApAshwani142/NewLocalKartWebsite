'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { Mail, Phone, MapPin, CheckCircle, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Support',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setStatusMessage('Please make sure to fill in all the required fields (Name, Email, Message).');
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage('');

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit contact request');
      }

      setSubmitStatus('success');
      setStatusMessage(data.message || 'Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Support',
        message: ''
      });
    } catch (err) {
      console.warn('Contact inquiry failed:', err.message);
      setSubmitStatus('error');
      setStatusMessage(err.message || 'An error occurred while sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 220, damping: 24 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb]">
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Decorative top background elements */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-50/40 via-transparent to-transparent">
        <main className="w-full max-w-[95%] mx-auto px-4 md:px-6 py-8 flex flex-col gap-8 text-left relative z-10">
          
          {/* Breadcrumbs & Dynamic Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
              <Link href="/" className="hover:text-brand-dark transition">Home</Link>
              <span>/</span>
              <span className="text-gray-600">Contact Us</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-950 mt-1 tracking-tight">
              Get In Touch
            </h1>
            <p className="text-xs text-gray-450 font-bold uppercase tracking-wider mt-0.5 max-w-xl leading-relaxed">
              Have a query? Sourcing partner Store questions? Fill out the inquiry form below, and we will email the details directly to our helpdesk.
            </p>
          </motion.div>

          {/* Contact Main Layout */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          >
            {/* Left Block: Contact Details (2 columns) */}
            <div className="lg:col-span-2 flex flex-col gap-6 w-full">
              
              {/* Ara Store Location Card */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-[#e8f5e9]/40 to-[#e8f5e9]/10 rounded-3xl border border-green-200/20 p-6 md:p-8 flex flex-col gap-6 shadow-premium transition duration-300"
              >
                <div>
                  <span className="text-[9px] bg-[#0e3e26]/10 text-[#0e3e26] border border-green-200/20 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest w-fit">
                    HYPERLOCAL BRANCH
                  </span>
                  <h3 className="text-xl font-black text-[#0e3e26] tracking-tight mt-2.5">
                    Ara Partner Store
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wide uppercase mt-0.5">
                    Central Fulfillment & Support Center
                  </p>
                </div>

                <div className="flex flex-col gap-5 text-xs font-bold text-gray-600">
                  <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-emerald-600 border border-green-100 shadow-xs shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-black mb-0.5">Physical Address</p>
                      <p className="leading-relaxed">Shop No 12, Market Square, Block Road, Ara, Bihar - 801101</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-emerald-600 border border-green-100 shadow-xs shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-black mb-0.5">Helpline Support</p>
                      <p className="leading-relaxed">+91 98765 43210</p>
                      <p className="text-[9px] text-gray-450 mt-0.5 font-semibold uppercase tracking-wider">(Daily: 8:00 AM - 9:00 PM)</p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-emerald-600 border border-green-100 shadow-xs shrink-0">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-black mb-0.5">Email Queries</p>
                      <p className="leading-relaxed">support@localkart.com</p>
                      <p className="leading-relaxed text-[10px] text-gray-450 font-semibold uppercase tracking-wider mt-0.5">partners@localkart.com</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Privacy-Preserving OpenStreetMap API Integration */}
              <motion.div 
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden h-64 relative flex flex-col justify-end p-0 transition duration-300"
              >
                <iframe
                  title="Ara Office Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=84.6550%2C25.5460%2C84.6750%2C25.5660&amp;layer=mapnik&amp;marker=25.5560%2C84.6650"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[30%] opacity-90"
                />
                
                {/* Floating Map Navigation Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-gray-100/70 flex items-center justify-between shadow-premium z-10">
                  <div className="text-left leading-tight">
                    <p className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest">Ara Headquarters</p>
                    <p className="text-[11px] text-gray-800 font-black mt-0.5">e-LocalKart Office</p>
                  </div>
                  <a
                    href="https://www.openstreetmap.org/?mlat=25.5560&amp;mlon=84.6650#map=16/25.5560/84.6650"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-dark hover:bg-brand-medium text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition cursor-pointer shadow-xs shadow-brand-dark/10"
                  >
                    Get Directions
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right Block: Message Contact Form (3 columns) */}
            <motion.div 
              variants={cardVariants}
              className="lg:col-span-3 bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 md:p-10 w-full flex flex-col gap-6"
            >
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Send Us a Message
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                  Fill the form below to transmit customer queries to our support staff
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold"
                    >
                      <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black">Submission Successful!</p>
                        <p className="text-emerald-600/90 mt-0.5 leading-relaxed">{statusMessage}</p>
                      </div>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold"
                    >
                      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black">Submission Error</p>
                        <p className="text-red-600/90 mt-0.5 leading-relaxed">{statusMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-black text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0e3e26] cursor-pointer"
                    >
                      <option value="Support">Support & Feedback</option>
                      <option value="Orders">Order Tracking Query</option>
                      <option value="Merchant">Partnering Shop inquiry</option>
                      <option value="Carrier">Delivery agent inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">Message Content *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us what we can help you with..."
                    className="bg-gray-50/50 border border-gray-200 rounded-xl p-3.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#0e3e26] focus:bg-white transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0e3e26] hover:bg-[#105634] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-55 flex items-center justify-center gap-2 shadow-md shadow-brand-dark/10"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={12} className="stroke-[3]" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>

        </main>
      </div>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store, Send, Heart, ShieldCheck, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="footer" className="w-full bg-[#070c14] dark:bg-slate-950 text-slate-400 py-14 px-4 md:px-8 border-t border-slate-800/80 mt-auto font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Top Newsletter & Brand Banner Row */}
        <div className="bg-gradient-to-r from-[#0e3e26] via-[#124d30] to-[#0a2f1c] rounded-3xl p-8 md:p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden text-left">
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-2 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-300">
              <Store size={13} />
              Empowering Indian Kiranas
            </div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight">
              Get Exclusive Hyperlocal Deals & Updates ⚡
            </h3>
            <p className="text-xs md:text-sm text-emerald-100/80 font-medium">
              Subscribe to e-LocalKart weekly newsletter for promo codes, local shop alerts & fresh arrivals.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 relative z-10">
            {subscribed ? (
              <div className="bg-white text-[#0e3e26] px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Subscribed successfully! Thank you.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-72 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  Subscribe
                  <Send size={13} />
                </button>
              </>
            )}
          </form>
        </div>

        {/* Step 4 Footer Link Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-left">
          
          {/* Column 1: Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">
              Company
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-bold">
              <li><Link href="/about-us" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/press-and-news" className="hover:text-white transition">Press & News</Link></li>
              <li><Link href="/press-and-news#blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">
              Customer
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-bold">
              <li><Link href="/orders" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><Link href="/addresses" className="hover:text-white transition">Saved Addresses</Link></li>
              <li><Link href="/notifications" className="hover:text-white transition">Notifications</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">
              Support
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-bold">
              <li><Link href="/help-center" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/help-center#faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/contact-us?category=Report+Issue" className="hover:text-white transition">Report an Issue</Link></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">
              Legal
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-bold">
              <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-white transition">Cancellation Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 6: Trust */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">
              Trust
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-bold">
              <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              <li><Link href="/community-guidelines" className="hover:text-white transition">Community Guidelines</Link></li>
              <li><Link href="/seller-verification" className="hover:text-white transition">Seller Verification</Link></li>
              <li><Link href="/buyer-protection" className="hover:text-white transition">Buyer Protection</Link></li>
            </ul>
          </div>

        </div>

        {/* Social Links & Contact Details Divider */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mr-2">Follow Us:</span>
            
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-white transition flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-white transition flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-white transition flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>

            {/* Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-white transition flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:text-white transition flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>

          {/* Contact Details */}
          <div className="flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-500" /> Bihar, India</span>
            <span className="flex items-center gap-1.5"><Phone size={14} className="text-emerald-500" /> +91 98765 43210</span>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500">
          <p>© 2026 e-LocalKart. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> in India to empower local businesses.
          </p>
        </div>

      </div>
    </footer>
  );
}

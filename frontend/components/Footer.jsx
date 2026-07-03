'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#070b13] text-gray-400 py-16 px-4 md:px-6 border-t border-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Branding */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-brand-dark rounded-xl border border-green-800">
              <Store size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center">
              Local<span className="text-emerald-500">Kart</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500 max-w-sm">
            Hyperlocal grocery & essentials same-hour delivery from verified local shops in Ara, Bihar. Empowering local stores.
          </p>
          <div className="flex items-center gap-3.5 mt-2">
            {['FB', 'IG', 'TW'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-9 h-9 border border-gray-800 hover:border-emerald-500 hover:text-white transition duration-200 rounded-full flex items-center justify-center text-xs font-black tracking-wider text-gray-500"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-xs font-extrabold tracking-widest text-emerald-500 uppercase mb-6">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm font-semibold">
            {['Shop Directory', 'About Us', 'Blog & News', 'Offers & Promos'].map((link) => (
              <li key={link}>
                <Link href="/" className="hover:text-white transition duration-150">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: For Partners */}
        <div>
          <h4 className="text-xs font-extrabold tracking-widest text-emerald-500 uppercase mb-6">
            For Partners
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm font-semibold">
            {['Register as Shopkeeper', 'Join as Delivery Agent', 'Partner Dashboard Login'].map((link) => (
              <li key={link}>
                <Link href="/" className="hover:text-white transition duration-150">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h4 className="text-xs font-extrabold tracking-widest text-emerald-500 uppercase mb-6">
            Contact Info
          </h4>
          <ul className="flex flex-col gap-4 text-sm font-semibold">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Ara, Bihar, India - 801101</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-emerald-500 shrink-0" />
              <a href="tel:+919876543210" className="hover:text-white transition">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-emerald-500 shrink-0" />
              <a href="mailto:support@localkart.com" className="hover:text-white transition">
                support@localkart.com
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

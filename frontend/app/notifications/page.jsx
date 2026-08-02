'use client';

import React, { useState } from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Bell, Truck, Tag, ShieldCheck, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'delivery',
      icon: Truck,
      title: 'Order Dispatched!',
      desc: 'Your order #ELK-98122 has been picked up by partner rider and is on its way.',
      time: '10 mins ago',
      unread: true
    },
    {
      id: 2,
      type: 'offer',
      icon: Tag,
      title: '30% Off Daily Juices Active',
      desc: 'Special discount active at Kirana stores in Grand Trunk Road area.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'system',
      icon: ShieldCheck,
      title: 'Account Verification Complete',
      desc: 'Your phone number and delivery location coordinates are verified.',
      time: '1 day ago',
      unread: false
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 flex items-center justify-between text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase mb-3">
              <Bell size={14} />
              Updates & Alerts
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Notifications
            </h1>
          </div>
          <button
            onClick={markAllRead}
            className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check size={14} /> Mark all read
          </button>
        </div>

        <div className="flex flex-col gap-4 text-left">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition flex items-start gap-4 shadow-xs ${
                  n.unread
                    ? 'border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/20'
                    : 'border-gray-100 dark:border-slate-800'
                }`}
              >
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{n.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

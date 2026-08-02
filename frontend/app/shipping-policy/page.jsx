import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Truck, Navigation, Clock, ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Hyperlocal Shipping & Delivery Policy | e-LocalKart',
  description: 'Understand e-LocalKart express 15-45 minute hyperlocal delivery radius, delivery fees, live GPS tracking, and delivery guidelines across Bihar.',
  openGraph: {
    title: 'Hyperlocal Shipping & Delivery Policy - e-LocalKart',
    description: 'Express 15-45 minute delivery rules, service radius, and charges on e-LocalKart.',
    url: 'https://elocalkart.com/shipping-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Shipping Policy - e-LocalKart',
    description: 'Hyperlocal delivery times and radius rules for e-LocalKart.',
  },
};

export default function ShippingPolicyPage() {
  const lastUpdated = 'August 1, 2026';

  const policySections = [
    {
      icon: MapPin,
      title: '1. Hyperlocal Delivery Radius',
      content: `e-LocalKart operates on a strict hyperlocal store-proximity model. Orders are dispatched from verified neighborhood shopkeepers located within a 5 km to 10 km radius of your pinned location. This guarantees maximum freshness and express speed.`
    },
    {
      icon: Clock,
      title: '2. Estimated Delivery SLA',
      content: `• Standard Express: Delivered within 15 to 45 minutes from order confirmation.\n• Scheduled Slots: Select preferred delivery time slots for heavy bulk items or weekly groceries.`
    },
    {
      icon: Truck,
      title: '3. Delivery Fee Structure',
      content: `• Orders above ₹299: FREE Delivery from nearest store.\n• Orders under ₹299: Nominal distance-based delivery fee starting at ₹15 to ₹25.\n• Rain / Peak Surge: Minimal temporary surcharge added during heavy rainfall or peak hours to compensate delivery partners.`
    },
    {
      icon: Navigation,
      title: '4. Live Order & Partner Tracking',
      content: `Once an order is packed by the storekeeper, you can track your assigned Delivery Partner in real time via interactive GPS map updates on your dashboard.`
    },
    {
      icon: AlertTriangle,
      title: '5. Handling Delayed Deliveries',
      content: `In cases of extreme weather, severe traffic congestion, or local road blockages, delivery times may be extended. If your order exceeds 60 minutes, our support desk automatically credits a delay coupon to your account.`
    },
    {
      icon: ShieldCheck,
      title: '6. Failed Delivery & Contactless Delivery Rules',
      content: `• Unreachable Customer: Delivery partners will attempt calling up to 3 times. If customer is unavailable at address, order will be held for 30 minutes before returning to store.\n• Contactless Delivery: Request delivery partners to leave packages at doorstep/gate with OTP verification.`
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Truck size={15} />
            Express Fulfillment Rules
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Hyperlocal Delivery & Shipping Policy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Last Updated: {lastUpdated} • Fast, Reliable Doorstep Delivery
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {policySections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {sec.title}
                  </h2>
                </div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line mt-1">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

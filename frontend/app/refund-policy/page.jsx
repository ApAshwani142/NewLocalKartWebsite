import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { RefreshCw, CheckCircle2, AlertCircle, Clock, Ban, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Refund & Return Policy | e-LocalKart Hyperlocal Platform',
  description: 'Understand e-LocalKart refund eligibility, replacement request procedures, damaged product returns, order cancellations, and processing SLAs.',
  openGraph: {
    title: 'Refund & Return Policy - e-LocalKart',
    description: 'Instant refunds, hassle-free returns, and customer protection guidelines on e-LocalKart.',
    url: 'https://elocalkart.com/refund-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Refund & Return Policy - e-LocalKart',
    description: 'Hassle-free refund and cancellation policy for e-LocalKart customers.',
  },
};

export default function RefundPolicyPage() {
  const lastUpdated = 'August 1, 2026';

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-10">
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <RefreshCw size={15} />
            Customer Protection Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Last Updated: {lastUpdated} • Transparent & Fair Resolutions
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Rule 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800">
                <CheckCircle2 size={22} className="text-emerald-500" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                1. Refund Eligibility
              </h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line mt-1">
              Refunds are eligible if:
              {'\n'}• The delivered product is expired, spoiled, or damaged upon delivery.
              {'\n'}• The delivered item is incorrect or drastically different from what was ordered.
              {'\n'}• Key missing items were paid for but not included in the sealed delivery bag.
              {'\n'}• An order is cancelled prior to shopkeeper packing or due to unserviceability.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800">
                <AlertCircle size={22} className="text-amber-500" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                2. Wrong or Missing Products
              </h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line mt-1">
              If you receive wrong or missing items, report the issue within 2 hours of delivery via the Help Center or My Orders page. Please upload a photo of the received items and bill snippet for instant verification.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                3. Damaged or Perished Items
              </h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line mt-1">
              For fresh produce (vegetables, fruits, dairy, meats), report quality defects within 1 hour of delivery. Approved claims receive 100% refund or free express replacement from the nearest partner store.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800">
                <Clock size={22} className="text-blue-500" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                4. Processing Time & Payment Methods
              </h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line mt-1">
              • UPI & e-LocalKart Wallet: Refunded within 2 to 24 hours.
              {'\n'}• Credit / Debit Cards & Netbanking: Credited back to source account within 5 to 7 working days as per bank processing cycles.
              {'\n'}• Cash on Delivery (COD): Credited immediately as e-LocalKart Store Wallet credits or via direct UPI payout link.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800">
                <Ban size={22} className="text-rose-600" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                5. Non-refundable Items
              </h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line mt-1">
              To uphold health and safety standards in Bihar, the following items are non-refundable once delivered unless damaged/expired prior to handover:
              {'\n'}• Personal hygiene products, innerwear, and unsealed cosmetics.
              {'\n'}• Perishable hot food, baby formula, or opened dairy packs.
            </p>
          </div>

          {/* Rule 6 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800">
                <HelpCircle size={22} className="text-indigo-500" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                6. How to Raise a Refund Request
              </h2>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line mt-1">
              1. Open e-LocalKart App/Website ➔ Go to "My Orders".
              {'\n'}2. Select the specific order ➔ Click "Report Issue / Need Help".
              {'\n'}3. Choose issue category (Damaged / Missing / Quality) and upload a photo.
              {'\n'}4. Our AI resolution system & support team processes claims within 15 minutes!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

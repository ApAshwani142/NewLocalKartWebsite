import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { ShieldCheck, FileText, Scale, Lock, Clock, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | e-LocalKart Hyperlocal Platform',
  description: 'Read the official Terms and Conditions governing your use of e-LocalKart hyperlocal commerce platform in India.',
  openGraph: {
    title: 'Terms & Conditions - e-LocalKart',
    description: 'Terms of service, user guidelines, and shopkeeper policies for e-LocalKart hyperlocal ordering.',
    url: 'https://elocalkart.com/terms-and-conditions',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms & Conditions - e-LocalKart',
    description: 'Terms of service and user agreements for e-LocalKart customer platform.',
  },
};

export default function TermsAndConditionsPage() {
  const lastUpdated = 'August 1, 2026';

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `Welcome to e-LocalKart ("Platform", "We", "Our", "Us"). e-LocalKart is a hyperlocal commerce platform operating in India that connects end-consumers with verified neighborhood shopkeepers and independent delivery partners for express doorstep delivery of daily essentials, groceries, fruits, vegetables, and consumer goods. By accessing or using our website, mobile application, or services, you agree to be bound by these Terms & Conditions.`
    },
    {
      id: 'definitions',
      title: '2. Definitions',
      content: `• "Customer" / "User": Any individual who accesses the Platform to browse or purchase products.\n• "Merchant" / "Shopkeeper": Independent third-party local store owners registered on e-LocalKart.\n• "Delivery Partner": Independent logistics personnel responsible for doorstep fulfillment.\n• "Order": An electronic purchase request submitted by a Customer on the Platform.`
    },
    {
      id: 'eligibility',
      title: '3. Eligibility',
      content: `You must be at least 18 years of age and competent to enter into a legally binding contract under the Indian Contract Act, 1872. If you are under 18 years of age, you may use the Platform only under the supervision and approval of a parent or legal guardian.`
    },
    {
      id: 'accounts',
      title: '4. Accounts & Registration',
      content: `Users must create an account by providing accurate credentials including phone number, email address, and delivery location. You are responsible for maintaining the confidentiality of your account credentials and OTP codes. You accept full responsibility for all activities occurring under your account.`
    },
    {
      id: 'orders',
      title: '5. Orders & Acceptance',
      content: `Placing an Order constitutes an offer to purchase products from participating Merchant stores. Order acceptance occurs when the Merchant confirms product availability and assigns a Delivery Partner. e-LocalKart reserves the right to reject or cancel Orders due to inventory shortages, unserviceable locations, or suspicious transactions.`
    },
    {
      id: 'pricing',
      title: '6. Pricing & Taxes',
      content: `All prices displayed on the Platform are set by participating Merchants and include applicable Goods and Services Tax (GST) unless explicitly specified. Delivery charges, handling fees, and surge fees (during peak hours or inclement weather) will be clearly displayed at checkout before payment.`
    },
    {
      id: 'payments',
      title: '7. Payments & Billing',
      content: `We accept payments via Unified Payments Interface (UPI), Debit/Credit Cards, Net Banking, Wallet payment gateways (Razorpay), and Cash on Delivery (COD). All online payments are securely processed through PCI-DSS compliant third-party gateways. COD orders may be subject to maximum order value limits.`
    },
    {
      id: 'delivery',
      title: '8. Delivery Terms',
      content: `e-LocalKart facilitates express hyperlocal delivery within designated operational radii (typically 5 to 10 kilometers). Estimated delivery times (e.g. 15-45 minutes) are estimates provided in good faith and may vary due to traffic, weather, or high order volumes.`
    },
    {
      id: 'cancellation',
      title: '9. Cancellation Policy',
      content: `Customers may cancel an Order free of charge before the Merchant begins preparing or packing the order. Once an order is marked as "In Preparation" or "Dispatched", cancellation fees up to 100% of the order value may apply.`
    },
    {
      id: 'refunds',
      title: '10. Refunds & Replacements',
      content: `Refunds for missing, damaged, defective, or expired products are processed according to our Refund Policy. Approved refunds will be credited back to the original payment method or e-LocalKart wallet within 5 to 7 business days.`
    },
    {
      id: 'user-responsibilities',
      title: '11. User Responsibilities',
      content: `Users agree to provide accurate delivery coordinates, ensure availability to receive deliveries, treat delivery personnel with respect, and refrain from fraudulent order placements or false refund claims.`
    },
    {
      id: 'shopkeeper-responsibilities',
      title: '12. Shopkeeper Responsibilities',
      content: `Merchants are solely responsible for product quality, expiry dates, weights, packaging hygiene, and compliance with FSSAI regulations and applicable Indian laws.`
    },
    {
      id: 'prohibited-activities',
      title: '13. Prohibited Activities',
      content: `Users shall not reverse engineer the Platform, scrape automated data, upload malicious code, impersonate others, or order prohibited or illegal substances.`
    },
    {
      id: 'intellectual-property',
      title: '14. Intellectual Property',
      content: `All trademarks, logos, UI designs, graphics, and proprietary software code on e-LocalKart belong to e-LocalKart Technologies Pvt. Ltd. Unauthorized copying or redistribution is strictly prohibited.`
    },
    {
      id: 'limitation-of-liability',
      title: '15. Limitation of Liability',
      content: `To the maximum extent permitted by Indian law, e-LocalKart shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime, merchant product defects, or third-party delivery delays.`
    },
    {
      id: 'termination',
      title: '16. Termination',
      content: `We reserve the right to suspend or terminate accounts that violate these Terms, engage in abusive behavior, or attempt fraudulent transactions without prior notice.`
    },
    {
      id: 'changes',
      title: '17. Modification of Terms',
      content: `e-LocalKart reserves the right to update these Terms at any time. Material changes will be updated on this page with a revised "Last Updated" timestamp.`
    },
    {
      id: 'contact',
      title: '18. Governing Law & Contact Information',
      content: `These Terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the courts in Patna/Ara, Bihar.\n\nFor queries regarding these Terms, contact our Legal Team at:\nEmail: legal@elocalkart.com | Support: +91 98765 43210`
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-10">
        {/* Page Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Scale size={15} />
            Legal Documentation
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Terms & Conditions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Last Updated: {lastUpdated} • e-LocalKart Hyperlocal Platform
          </p>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Table of Contents */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 sticky top-24 shadow-sm text-left">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <FileText size={14} /> Quick Navigation
              </h3>
              <ul className="flex flex-col gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 transition line-clamp-1"
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Legal Sections */}
          <div className="lg:col-span-3 flex flex-col gap-6 text-left">
            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm scroll-mt-28"
              >
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  {sec.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium whitespace-pre-line">
                  {sec.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

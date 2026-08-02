import React from 'react';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, Database, MapPin, Key, Trash2, Mail, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | e-LocalKart Hyperlocal Platform',
  description: 'Learn how e-LocalKart collects, protects, processes, and manages user personal data and location information in compliance with Indian IT regulations.',
  openGraph: {
    title: 'Privacy Policy - e-LocalKart',
    description: 'Data security, privacy rights, location permissions, and account deletion policies for e-LocalKart.',
    url: 'https://elocalkart.com/privacy-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy - e-LocalKart',
    description: 'Privacy standards and security protocols for e-LocalKart customer platform.',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 1, 2026';

  const sections = [
    {
      id: 'information-collected',
      title: '1. Information We Collect',
      content: `We collect information directly provided by you, automatically gathered through your device, and received from third-party services. This includes:\n• Personal Identification: Full name, phone number, email address.\n• Delivery Details: House/flat number, landmark, street address, PIN code.\n• Payment Metadata: Payment mode preference (UPI ID hash, card type, billing address processed via Razorpay). We NEVER store CVVs or full credit card numbers.`
    },
    {
      id: 'location-permission',
      title: '2. Location Permission & Geolocation',
      content: `e-LocalKart relies on precise real-time GPS geolocation data to calculate proximity to local partner Kirana stores, estimate express delivery time (15-45 mins), and route delivery partners accurately. You may grant or revoke location access in your browser or device settings at any time.`
    },
    {
      id: 'cookies',
      title: '3. Cookies & Local Storage',
      content: `We use essential cookies and browser local storage to persist user authentication tokens, active cart items, dark/light theme preferences, and saved delivery addresses. You can manage cookie preferences via your web browser.`
    },
    {
      id: 'analytics',
      title: '4. Analytics & Operational Logging',
      content: `We collect anonymized performance telemetry, app crash reports, page view statistics, and search term frequencies to optimize store search speed and inventory availability.`
    },
    {
      id: 'personal-information',
      title: '5. How We Use Personal Information',
      content: `Your data is used strictly to process orders, dispatch delivery partners, send order status SMS/WhatsApp alerts, handle customer support inquiries, and comply with tax regulations under Indian law.`
    },
    {
      id: 'payment-information',
      title: '6. Payment Gateway Integration (Razorpay)',
      content: `Online payment transactions are powered by Razorpay Software Private Limited. All monetary transactions adhere to PCI-DSS standards, RBI guidelines, and bank-grade encryption protocols.`
    },
    {
      id: 'google-maps',
      title: '7. Google Maps Infrastructure',
      content: `We utilize Google Maps APIs for reverse geocoding and live delivery partner route tracking. Usage of Google Maps components is subject to Google's Privacy Policy.`
    },
    {
      id: 'cloudflare',
      title: '8. Content Delivery & Cloudflare CDN Security',
      content: `Our web assets and API endpoints are protected by Cloudflare Web Application Firewall (WAF) to prevent DDoS attacks, mitigate bot traffic, and enforce TLS 1.3 encryption.`
    },
    {
      id: 'data-security',
      title: '9. Data Security & Storage',
      content: `We enforce AES-256 encryption for data at rest in enterprise-grade MongoDB cloud database clusters and TLS 1.3 encryption for data in transit. Access controls are strictly restricted.`
    },
    {
      id: 'user-rights',
      title: '10. User Rights & Data Protection Rights',
      content: `In accordance with the Digital Personal Data Protection Act (DPDP Act, 2023) of India, you have the right to access, update, correct, or request erasure of your personal data.`
    },
    {
      id: 'delete-account',
      title: '11. How to Request Account & Data Deletion',
      content: `You may permanently delete your account and associated data directly from your Account Settings page or by sending an email request to privacy@elocalkart.com with the subject "Account Deletion Request". Deletion will be completed within 14 business days.`
    },
    {
      id: 'contact',
      title: '12. Grievance Officer & Privacy Contact',
      content: `For any grievances or questions regarding privacy practices, please contact our Data Protection Officer:\n\nGrievance Officer: Legal & Privacy Team\ne-LocalKart Technologies Pvt. Ltd.\nEmail: privacy@elocalkart.com | Phone: +91 98765 43210\nAddress: Main Road, Ara, Bihar - 801101, India`
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col font-sans">
      <HeaderWrapper />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-10">
        {/* Page Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-slate-800 shadow-sm mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4">
            <Shield size={15} />
            Data Protection & Trust
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-bold">
            Last Updated: {lastUpdated} • DPDP Act 2023 Compliant (India)
          </p>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 sticky top-24 shadow-sm text-left">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <Lock size={14} /> Sections
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

          {/* Sections List */}
          <div className="lg:col-span-3 flex flex-col gap-6 text-left">
            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-gray-100 dark:border-slate-800 shadow-sm scroll-mt-28"
              >
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Database size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
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

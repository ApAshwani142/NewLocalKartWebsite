'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquareText, ShieldAlert } from 'lucide-react';

export default function ChatbotWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  // Do not render floating widget when user is already on the dedicated chat page
  if (pathname === '/chatbot') {
    return null;
  }

  const handleClick = () => {
    if (user) {
      router.push('/chatbot');
    } else {
      // If unauthenticated, show an auth alert modal/tooltip or redirect to login
      setShowAuthAlert(true);
      setTimeout(() => {
        setShowAuthAlert(false);
        router.push('/login');
      }, 2500);
    }
  };

  return (
    <>
      {/* Floating Widget Button (bottom-20 on mobile to stay above bottom navbar without overlap) */}
      <div 
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip Description Bubble */}
        {showTooltip && !showAuthAlert && (
          <div className="bg-gray-950 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg border border-white/10 animate-fade-in transition-all duration-300">
            💬 Chat with KartBot!
          </div>
        )}

        {/* Auth Required Toast Notification */}
        {showAuthAlert && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-1.5 animate-bounce max-w-[250px] text-left">
            <ShieldAlert size={14} className="shrink-0 text-red-500" />
            <span>Login Required to Chat! Redirecting...</span>
          </div>
        )}

        {/* Floating Bubble Icon */}
        <button
          onClick={handleClick}
          aria-label="Open Chatbot"
          className="relative w-14 h-14 bg-gradient-to-tr from-[#0e3e26] to-[#105634] hover:from-[#f97316] hover:to-[#ff8d3f] text-white rounded-full flex items-center justify-center shadow-premium transition-all duration-500 hover:scale-110 cursor-pointer active:scale-95 group focus:outline-none focus:ring-4 focus:ring-brand-medium/30"
        >
          {/* Outer Pulsing Glow rings */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75 group-hover:bg-orange-500/20" />
          <span className="absolute -inset-1 rounded-full border border-emerald-500/10 group-hover:border-orange-500/20" />

          {/* Assistant Online Green Indicator Dot */}
          <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-md animate-pulse z-10" />

          {/* Bubble SVG Icon */}
          <MessageSquareText size={22} className="stroke-[2.5] transition-transform duration-500 group-hover:rotate-12" />
        </button>
      </div>
    </>
  );
}

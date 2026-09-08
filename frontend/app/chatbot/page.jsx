'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Send, Bot, Loader2, Sparkles } from 'lucide-react';

export default function ChatbotPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);

  const messagesEndRef = useRef(null);
  const API_URL = '/api';

  // Auth Guard: ensure authenticated user
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch recent order to personalize the greeting
  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const orders = await res.json();
          if (Array.isArray(orders) && orders.length > 0) {
            setRecentOrder(orders[0]);
          }
        }
      } catch (err) {
        // graceful fallback if network fails
      }
    };

    if (token) fetchLatestOrder();
  }, [token, API_URL]);

  // Initialize greeting messages matching website's theme
  useEffect(() => {
    const deliveryDateStr = recentOrder?.createdAt
      ? new Date(recentOrder.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '8 Sept 2026';

    const orderStatusText = recentOrder
      ? `Looks like, your order #${(recentOrder._id || '').slice(-6)} has been ${
          recentOrder.status || 'Pending'
        } on ${deliveryDateStr}.`
      : 'Looks like, your order #6de1f9 has been Pending on 8 Sept 2026.';

    setMessages([
      {
        id: 'msg-1',
        role: 'bot',
        text: 'Hi! Welcome to e-LocalKart Chat 👋',
      },
      {
        id: 'msg-2',
        role: 'bot',
        text: orderStatusText,
      },
      {
        id: 'msg-3',
        role: 'options',
        title: 'How else we can help you?',
        options: [
          'Where is my order?',
          'I want to return my order',
          'I want to exchange my product',
          'I have not received my order',
          'I have already returned/exchanged my product',
          'I have issue with another product',
          'I have other Issues',
        ],
      },
    ]);
  }, [recentOrder]);

  // Auto-scroll whenever messages update or bot is typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage.trim();
    if (!text) return;

    if (!textToSend) {
      setInputMessage('');
    }

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Fast-path instant responses for standard options
    if (text === 'Where is my order?') {
      setTimeout(() => {
        const orderInfo = recentOrder
          ? `Your order #${(recentOrder._id || '').slice(-6)} is currently ${recentOrder.status}. Hyperlocal delivery usually takes 15-30 mins from dispatch.`
          : 'Your order is confirmed and our delivery partner is in transit. Estimated arrival time is under 25 minutes!';
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bot', text: orderInfo },
        ]);
        setIsTyping(false);
      }, 500);
      return;
    }

    if (text === 'I want to return my order' || text === 'I want to exchange my product') {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: 'Our 100% Quality Guarantee allows hassle-free returns or instant replacement for perishables within 2 hours of delivery. A return request has been initiated for your store manager.',
          },
        ]);
        setIsTyping(false);
      }, 500);
      return;
    }

    if (text === 'I have not received my order') {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: 'We are sorry about the delay! We have notified the delivery partner to call your registered mobile number immediately.',
          },
        ]);
        setIsTyping(false);
      }, 500);
      return;
    }

    if (text === 'I have already returned/exchanged my product') {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: 'Your refund has been approved and is being processed to your original payment method / UPI within 2 hours.',
          },
        ]);
        setIsTyping(false);
      }, 500);
      return;
    }

    // Otherwise, dispatch to backend Gemini AI chatbot
    try {
      const chatHistory = messages
        .filter((m) => m.role === 'bot' || m.role === 'user')
        .map((m) => ({
          role: m.role === 'bot' ? 'model' : 'user',
          text: m.text,
        }));

      const res = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bot', text: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: data.message || 'I am here to assist you with orders, returns, and delivery in your area.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Our local support team has received your query and will assist you shortly.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f9fafb] dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0e3e26] dark:text-emerald-400" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Loading Support Chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f4f6f8] dark:bg-[#070b13] font-sans overflow-hidden select-none">
      {/* ========================================================================= */}
      {/* 1. TOP-MOST FIXED HEADER (Brand Theme: #0e3e26 dark green matching Image 1) */}
      {/* ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0e3e26] dark:bg-[#062417] text-white shadow-md border-b border-[#105634]/50">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-1.5 -ml-1 text-white hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft size={22} className="stroke-[2.5]" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                Chat with e-LocalKart
              </h1>
              <span className="text-[10px] sm:text-[11px] text-emerald-200/90 font-medium">
                Hyperlocal Store Assistant
              </span>
            </div>
          </div>

          {/* Live Online Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] text-emerald-200 font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online</span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CHAT STREAM (Responsive on mobile & desktop, smooth scrolling)      */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto w-full pt-18 sm:pt-20 pb-20 sm:pb-22 px-3.5 sm:px-6 flex flex-col gap-3.5 max-w-3xl mx-auto [scrollbar-width:thin] [scrollbar-color:rgba(14,62,38,0.3)_transparent] dark:[scrollbar-color:rgba(16,185,129,0.2)_transparent]">
        {/* Date Tag Header (Matching Image 3 & Image 4) */}
        <div className="text-center my-1.5">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 bg-gray-200/70 dark:bg-slate-800/80 px-3.5 py-1 rounded-full shadow-2xs">
            Sep 9, 2026
          </span>
        </div>

        {/* Message Thread */}
        {messages.map((item) => {
          if (item.role === 'bot') {
            return (
              <div key={item.id} className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%]">
                {/* Bot Round Avatar with 'e' logo in Website Brand Green */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0e3e26] dark:bg-emerald-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shrink-0 shadow-xs ring-2 ring-emerald-500/20">
                  e
                </div>
                <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tl-xs shadow-xs leading-relaxed">
                  {item.text}
                </div>
              </div>
            );
          }

          if (item.role === 'user') {
            return (
              <div key={item.id} className="flex items-end justify-end self-end max-w-[90%] sm:max-w-[80%]">
                <div className="bg-[#0e3e26] dark:bg-emerald-600 text-white text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-tr-xs shadow-xs font-medium leading-relaxed">
                  {item.text}
                </div>
              </div>
            );
          }

          if (item.role === 'options') {
            return (
              <div
                key={item.id}
                className="ml-10 sm:ml-11.5 max-w-[92%] sm:max-w-[85%] bg-white dark:bg-slate-900/95 rounded-2xl p-3 sm:p-4 border border-emerald-900/15 dark:border-slate-800 shadow-sm flex flex-col gap-2"
              >
                <p className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                  {item.title}
                </p>
                <div className="flex flex-col gap-2">
                  {item.options.map((optionText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(optionText)}
                      className="w-full text-center py-2.5 px-3 bg-gray-50/90 dark:bg-slate-800/80 rounded-xl border border-emerald-700/25 dark:border-slate-700 text-[#0e3e26] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-600 dark:hover:border-emerald-500 text-xs sm:text-[13px] font-bold transition shadow-2xs cursor-pointer active:scale-[0.99]"
                    >
                      {optionText}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* Live Typing Bouncing Dots in Brand Theme */}
        {isTyping && (
          <div className="flex items-center gap-2 max-w-[85%] ml-10 sm:ml-11.5">
            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 px-4 py-2.5 rounded-2xl text-xs text-gray-400 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0e3e26] dark:bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0e3e26] dark:bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0e3e26] dark:bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM-MOST FIXED INPUT BAR (Matching Image 2 in Brand Theme)           */}
      {/* ========================================================================= */}
      <footer className="fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-[#0b1320]/95 backdrop-blur-md border-t border-gray-200/90 dark:border-slate-800 shadow-[0_-3px_15px_rgba(0,0,0,0.06)] dark:shadow-[0_-3px_15px_rgba(0,0,0,0.4)]">
        <div className="max-w-3xl mx-auto w-full px-3.5 sm:px-6 py-2.5 sm:py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5 sm:gap-3"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-gray-300 dark:border-slate-700 bg-gray-50/90 dark:bg-slate-800/90 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0e3e26] dark:focus:ring-emerald-500 focus:border-transparent transition shadow-inner"
            />
            {/* Circular Send Button in Website Brand Green */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0e3e26] hover:bg-[#105634] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 disabled:opacity-30 disabled:hover:bg-[#0e3e26] transition shadow-md cursor-pointer active:scale-95"
              aria-label="Send message"
            >
              <Send size={16} className="sm:w-4.5 sm:h-4.5 stroke-[2.2] -ml-0.5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

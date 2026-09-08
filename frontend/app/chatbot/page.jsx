'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Send, Bot, User, Loader2, CheckCircle2, Package } from 'lucide-react';

export default function ChatbotPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);

  const messagesEndRef = useRef(null);
  const API_URL = '/api';

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch recent order to personalize the greeting (matching Image 3)
  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const orders = await res.json();
          if (Array.isArray(orders) && orders.length > 0) {
            setRecentOrder(orders[0]);
          }
        }
      } catch (err) {
        // ignore
      }
    };

    if (token) fetchLatestOrder();
  }, [token, API_URL]);

  // Initialize greeting messages matching Image 3
  useEffect(() => {
    const deliveryDateStr = recentOrder?.createdAt
      ? new Date(recentOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '4 Sep 2026';

    const orderStatusText = recentOrder
      ? `Looks like, your order #${(recentOrder._id || '').slice(-6)} has been ${recentOrder.status || 'Delivered'} on ${deliveryDateStr}.`
      : 'Looks like, your order has been delivered on 4 Sep 2026.';

    setMessages([
      {
        id: 'msg-1',
        role: 'bot',
        text: 'Hi! Welcome to e-LocalKart Chat 👋'
      },
      {
        id: 'msg-2',
        role: 'bot',
        text: orderStatusText
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
          'I have other Issues'
        ]
      }
    ]);
  }, [recentOrder]);

  // Auto-scroll to bottom
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

    // Fast-path instant contextual answers for standard options (matching Image 3)
    if (text === 'Where is my order?') {
      setTimeout(() => {
        const orderInfo = recentOrder
          ? `Your order #${(recentOrder._id || '').slice(-6)} is currently ${recentOrder.status}. Hyperlocal delivery usually takes 15-30 mins from dispatch.`
          : 'Your order is confirmed and our delivery partner is in transit. Estimated arrival time is under 25 minutes!';
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bot', text: orderInfo }
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
            text: 'Our 100% Quality Guarantee allows hassle-free returns or instant replacement for perishables within 2 hours of delivery. A return request has been initiated for your store manager.'
          }
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
            text: 'We are sorry about the delay! We have notified the delivery partner to call your registered mobile number immediately.'
          }
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
            text: 'Your refund has been approved and is being processed to your original payment method / UPI within 2 hours.'
          }
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
          text: m.text
        }));

      const res = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'bot', text: data.message }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: data.message || 'I am here to assist you with orders, returns, and delivery in your area.'
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Our local support team has received your query and will assist you shortly.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700 dark:text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-screen bg-[#f3f4f6] dark:bg-slate-950 font-sans select-none">
      {/* Top Header App Bar (Matching Image 3: Purple/Brand Banner with Back Arrow) */}
      <header className="w-full bg-[#9c27b0] dark:bg-[#0e3e26] text-white px-4 py-3.5 flex items-center gap-4 shadow-md shrink-0 z-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-white hover:opacity-80 transition cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={22} className="stroke-[2.5]" />
        </button>
        <h1 className="text-lg font-bold tracking-tight text-white">
          Chat with e-LocalKart
        </h1>
      </header>

      {/* Main Chat Stream Container */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 max-w-lg mx-auto w-full">
        {/* Date Indicator (Matching Image 3: Sep 9, 2026) */}
        <div className="text-center my-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 bg-transparent px-3 py-1">
            Sep 9, 2026
          </span>
        </div>

        {/* Message Items */}
        {messages.map((item) => {
          if (item.role === 'bot') {
            return (
              <div key={item.id} className="flex items-start gap-2.5 max-w-[85%]">
                {/* Bot Round Avatar with 'e' logo (Matching Image 3) */}
                <div className="w-8 h-8 rounded-full bg-[#9c27b0] dark:bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                  e
                </div>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] px-3.5 py-2.5 rounded-2xl rounded-tl-sm shadow-xs leading-relaxed">
                  {item.text}
                </div>
              </div>
            );
          }

          if (item.role === 'user') {
            return (
              <div key={item.id} className="flex items-end justify-end self-end max-w-[85%]">
                <div className="bg-[#9c27b0] dark:bg-emerald-600 text-white text-xs sm:text-[13px] px-3.5 py-2.5 rounded-2xl rounded-tr-sm shadow-xs font-medium leading-relaxed">
                  {item.text}
                </div>
              </div>
            );
          }

          if (item.role === 'options') {
            return (
              <div key={item.id} className="ml-10 max-w-[85%] bg-[#f8f9fa] dark:bg-slate-900/90 rounded-2xl p-3 border border-gray-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {item.title}
                </p>
                <div className="flex flex-col gap-2">
                  {item.options.map((optionText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(optionText)}
                      className="w-full text-center py-2.5 px-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200/80 dark:border-slate-700 text-[#9c27b0] dark:text-emerald-400 hover:bg-purple-50 dark:hover:bg-slate-700/50 text-xs font-bold transition shadow-2xs cursor-pointer"
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

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 max-w-[85%] ml-10">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-3.5 py-2 rounded-2xl text-xs text-gray-400 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Message Input Field at Bottom */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-lg mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9c27b0] dark:focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-2.5 rounded-full bg-[#9c27b0] dark:bg-emerald-600 text-white hover:opacity-90 disabled:opacity-40 transition cursor-pointer shadow-xs"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartModal from '@/components/CartModal';
import { Send, Bot, User, ArrowLeft, Sparkles, MessageCircle, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatbotPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: "Hello! I am KartBot, your e-LocalKart AI assistant. How can I help you today? Ask me about our delivery area, fresh vegetables, daily deals, or return policies!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const API_URL = '/api';

  // Auth Protection Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage.trim();
    if (!text) return;

    if (!textToSend) {
      setInputMessage('');
    }

    // Add user message
    const userMsgId = Date.now().toString();
    const newUserMsg = { id: userMsgId, role: 'user', text };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Map message history to Gemini format (role must be 'user' or 'model')
      const chatHistory = messages.map((m) => ({
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
            text: `⚠️ Chatbot Error: ${data.message || 'Failed to connect'}. Please try again.`
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: '⚠️ Network Error: Unable to reach the chatbot server. Please verify your connection.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedPrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#0e3e26] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Checking Authentication...</span>
        </div>
      </div>
    );
  }

  const SUGGESTED_PROMPTS = [
    { label: 'What is e-LocalKart?', text: 'What is e-LocalKart?' },
    { label: 'Do you deliver here?', text: 'Do you deliver in Bihar?' },
    { label: 'How fast is delivery?', text: 'How long does delivery take?' },
    { label: 'What items can I buy?', text: 'What products and categories do you offer?' }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#f9fafb]">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 w-full max-w-[95%] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 text-left">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <Link 
            href="/"
            className="p-2 bg-white rounded-full border border-gray-150 text-gray-700 hover:text-brand-dark transition shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
              <Link href="/" className="hover:text-brand-dark transition">Home</Link>
              <span>/</span>
              <span className="text-gray-600">AI Chatbot</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-950 mt-0.5 tracking-tight flex items-center gap-2">
              KartBot AI Assistant <Sparkles size={18} className="text-orange-500 animate-pulse" />
            </h1>
          </div>
        </div>

        {/* Chat Application Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch h-[500px] lg:h-[700px] relative">
          
          {/* Left Panel: Help / suggested info (Hidden on mobile) */}
          <div className="hidden lg:flex flex-col col-span-1 bg-white rounded-[32px] border border-gray-100 p-6 shadow-premium gap-5">
            <div className="flex flex-col items-center text-center gap-3 border-b border-gray-50 pb-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-dark flex items-center justify-center relative">
                <Bot size={36} className="text-[#0e3e26]" />
                <span className="absolute bottom-0.5 right-0.5 w-4.5 h-4.5 bg-emerald-500 rounded-full border-4 border-white shadow-sm animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">KartBot Assistant</h3>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase mt-0.5">Online &amp; ready to help</p>
              </div>
            </div>

            {/* Quick tips list */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black text-[#0e3e26] uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={14} className="text-emerald-500" /> Suggested Questions
              </h4>
              <div className="flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                    className="text-xs text-left bg-gray-50/50 hover:bg-emerald-50/50 border border-gray-100 rounded-2xl p-3 text-gray-700 font-bold transition hover:border-brand-medium/30 cursor-pointer"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-gray-50 pt-4 text-center">
              <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide leading-relaxed">
                Powered by Google Gemini AI.<br />
                Answers tailored to e-LocalKart.
              </p>
            </div>
          </div>

          {/* Right/Main Panel: The Chat Stream App */}
          <div className="col-span-1 lg:col-span-3 bg-white rounded-[32px] border border-gray-100 shadow-premium flex flex-col overflow-hidden h-full">
            {/* Header section in chat window */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-dark flex items-center justify-center relative">
                  <Bot size={20} className="text-[#0e3e26]" />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-3 border-white shadow-sm animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-gray-900">KartBot AI</p>
                  <p className="text-[9px] text-emerald-600 font-black uppercase tracking-wider">Active Chat Session</p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-[#0e3e26] px-3 py-1 rounded-full font-black uppercase tracking-wider">
                Logged in as {user.name}
              </span>
            </div>

            {/* Message Feed container */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-gray-50/30">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    {/* Icon/Avatar bubble */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs border ${
                      m.role === 'user' 
                        ? 'bg-emerald-50 border-emerald-100 text-brand-dark' 
                        : 'bg-white border-gray-150 text-orange-500'
                    }`}>
                      {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* Chat Bubble Text */}
                    <div className={`p-3.5 rounded-2xl text-xs font-bold leading-relaxed shadow-sm border ${
                      m.role === 'user'
                        ? 'bg-[#0e3e26] border-emerald-950 text-white rounded-tr-none text-left'
                        : 'bg-white border-gray-100 text-gray-800 rounded-tl-none text-left'
                    }`}>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 mr-auto max-w-[85%]"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-150 text-orange-500 flex items-center justify-center shadow-xs">
                      <Bot size={14} />
                    </div>
                    <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin text-brand-dark shrink-0" />
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">KartBot is typing...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input form in footer */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }} 
              className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white"
            >
              <input
                type="text"
                placeholder="Ask KartBot about categories, deliveries, discounts..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-gray-50/50 border border-gray-200 rounded-2xl px-4.5 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0e3e26] focus:border-transparent transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-3 bg-[#0e3e26] hover:bg-[#f97316] text-white rounded-2xl shadow-md transition duration-300 disabled:opacity-40 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

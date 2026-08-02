'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageSquare, LifeBuoy } from 'lucide-react';
import Link from 'next/link';

export default function HelpCenterAccordion({ faqCategories }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filterQuestions = () => {
    let list = [];
    faqCategories.forEach((cat) => {
      if (activeCategory === 'All' || activeCategory === cat.category) {
        cat.questions.forEach((q) => {
          if (
            !searchTerm ||
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            list.push({ ...q, category: cat.category });
          }
        });
      }
    });
    return list;
  };

  const filtered = filterQuestions();

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Search Input */}
      <div className="relative w-full max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search questions (e.g. refund status, delivery fee, tracking)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
            activeCategory === 'All'
              ? 'bg-[#0e3e26] text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-50'
          }`}
        >
          All FAQs
        </button>
        {faqCategories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeCategory === cat.category
                ? 'bg-[#0e3e26] text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-50'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Accordion Questions List */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center text-slate-400 border border-gray-100 dark:border-slate-800">
            <p className="text-sm font-bold">No questions found matching your search term.</p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openQuestionIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenQuestionIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition"
                >
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">
                      {item.category}
                    </span>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-t border-gray-50 dark:border-slate-800/60 bg-emerald-50/20 dark:bg-slate-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Direct Support Card */}
      <div className="bg-gradient-to-r from-[#0e3e26] to-emerald-900 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 mt-6">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-white/10 rounded-2xl shrink-0">
            <LifeBuoy size={28} className="text-emerald-300" />
          </div>
          <div>
            <h3 className="text-base font-black">Still need help with an existing order?</h3>
            <p className="text-xs text-emerald-100/80 font-medium mt-0.5">
              Our 24/7 customer support agents are ready to assist you.
            </p>
          </div>
        </div>
        <Link
          href="/contact-us"
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition shadow-md"
        >
          Submit Support Ticket ➔
        </Link>
      </div>
    </div>
  );
}

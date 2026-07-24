'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function CartItemList({ cartItems, updateQuantity, removeFromCart }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <AnimatePresence initial={false}>
        {cartItems.map((item) => {
          const itemTotal = item.price * item.qty;
          const itemId = item.product || item._id;

          return (
            <motion.div
              key={itemId}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.25 }}
              className="group flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-xs hover:border-emerald-200 transition-all text-left"
            >
              {/* Product Thumbnail */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Quantity Badge */}
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#105634] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {item.qty}
                </span>
              </div>

              {/* Name, Unit, Price, Stepper */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                <div>
                  <h4 className="text-xs font-black text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                    {item.unit || '1 unit'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2.5">
                  {/* Price */}
                  <motion.span 
                    key={itemTotal}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    className="text-sm font-black text-[#0e3e26]"
                  >
                    ₹{itemTotal.toLocaleString()}
                  </motion.span>

                  {/* Quantity Stepper & Trash */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-full border border-gray-200 bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemId, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#105634] hover:bg-emerald-50 rounded-l-full transition cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus size={11} strokeWidth={3} />
                      </button>
                      
                      <span className="text-xs font-black min-w-[22px] text-center text-gray-900">
                        {item.qty}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemId, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#105634] hover:bg-emerald-50 rounded-r-full transition cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus size={11} strokeWidth={3} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(itemId)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

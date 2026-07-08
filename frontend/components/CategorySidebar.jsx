// 'use client';

// import React from 'react';
// import { CATEGORIES } from '@/data/mockData';
// import { Sparkles } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function CategorySidebar({ selectedCategory, onSelectCategory }) {
//   return (
//     <div className="w-full bg-[#e8f5e9]/30 rounded-3xl border border-green-200/20 shadow-premium p-6">
//       <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-200/10">
//         <Sparkles size={16} className="text-[#10b981]" />
//         <h3 className="text-sm font-black text-[#0e3e26] tracking-wider uppercase">
//           Top Categories
//         </h3>
//       </div>
      
//       <div className="flex flex-col gap-1.5">
//         {/* 'All Products' category option */}
//         <motion.button
//           onClick={() => onSelectCategory(null)}
//           whileHover={{ x: 4 }}
//           whileTap={{ scale: 0.98 }}
//           className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-bold transition-all duration-200 cursor-pointer border ${
//             selectedCategory === null
//               ? 'bg-[#0e3e26] text-white border-transparent shadow-md shadow-emerald-950/10'
//               : 'text-gray-600 hover:text-[#0e3e26] bg-transparent hover:bg-white/65 border-transparent'
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-base">🛍️</span>
//             <span>All Products</span>
//           </div>
//           <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black transition-colors ${
//             selectedCategory === null ? 'bg-white/20 text-white' : 'bg-gray-200/50 text-gray-400'
//           }`}>
//             All
//           </span>
//         </motion.button>

//         {CATEGORIES.map((cat, idx) => {
//           const isSelected = selectedCategory === cat.id;
//           return (
//             <motion.button
//               key={cat.id}
//               onClick={() => onSelectCategory(cat.id)}
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: idx * 0.03 }}
//               whileHover={{ x: 4 }}
//               whileTap={{ scale: 0.98 }}
//               className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-xs font-bold transition-all duration-200 cursor-pointer border ${
//                 isSelected
//                   ? 'bg-[#0e3e26] text-white border-transparent shadow-md shadow-emerald-950/10'
//                   : 'text-gray-600 hover:text-[#0e3e26] bg-transparent hover:bg-white/65 border-transparent'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <span className="text-base">{cat.icon}</span>
//                 <span>{cat.name}</span>
//               </div>
//               {/* <span className={`text-[10px] px-2 py-0.5 rounded-full font-black transition-colors ${
//                 isSelected ? 'bg-white/20 text-white' : 'bg-gray-200/50 text-gray-400'
//               }`}>
//                 {cat.count} Items
//               </span> */}
//             </motion.button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

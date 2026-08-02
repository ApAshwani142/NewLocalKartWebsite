'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import CartModal from '@/components/CartModal';

export default function HeaderWrapper() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

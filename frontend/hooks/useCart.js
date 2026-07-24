'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('localkart_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart items:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart items to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('localkart_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((item) => item.product === product._id);

      if (existItem) {
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            unit: product.unit,
            qty: 1
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // No shipping fee above Rs. 100, else Rs. 40
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 100 ? 0 : 40;
  
  // Tax (approx. 5% for GST)
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  
  const totalPrice = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        tax,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

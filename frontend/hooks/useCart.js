'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, getAuthToken } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Synchronize cart with backend if token exists, or load from localStorage
  const syncBackendCart = useCallback(async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await cartApi.get();
        if (res && Array.isArray(res.items)) {
          const formatted = res.items.map(i => ({
            product: (typeof i.productId === 'object' && i.productId !== null) ? i.productId._id : i.productId,
            name: i.name || (i.productId && i.productId.name) || 'Product',
            image: i.image || (i.productId && i.productId.image) || '/placeholder.jpg',
            price: i.price || (i.productId && i.productId.price) || 0,
            originalPrice: i.originalPrice || i.price || (i.productId && i.productId.price) || 0,
            unit: i.unit || (i.productId && i.productId.unit) || 'item',
            qty: i.quantity || 1
          }));
          setCartItems(formatted);
          setIsInitialized(true);
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch backend cart, falling back to local state:', err.message);
      }
    }

    // Unauthenticated or backend fetch failed: load local storage cache
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

  useEffect(() => {
    syncBackendCart();
  }, [syncBackendCart]);

  // Save cart items to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('localkart_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = async (product) => {
    const targetId = product._id || product.id;
    setCartItems((prevItems) => {
      const existItem = prevItems.find((item) => item.product === targetId);

      if (existItem) {
        return prevItems.map((item) =>
          item.product === targetId ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: targetId,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            unit: product.unit || 'item',
            qty: 1
          }
        ];
      }
    });

    const token = getAuthToken();
    if (token) {
      try {
        await cartApi.addItem(targetId, 1);
      } catch (err) {
        console.warn('Backend cart addItem error:', err.message);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));

    const token = getAuthToken();
    if (token) {
      try {
        await cartApi.removeItem(productId);
      } catch (err) {
        console.warn('Backend cart removeItem error:', err.message);
      }
    }
  };

  const updateQuantity = async (productId, qty) => {
    if (qty <= 0) {
      await removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId ? { ...item, qty: Number(qty) } : item
      )
    );

    const token = getAuthToken();
    if (token) {
      try {
        await cartApi.updateQuantity(productId, Number(qty));
      } catch (err) {
        console.warn('Backend cart updateQuantity error:', err.message);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    const token = getAuthToken();
    if (token) {
      try {
        await cartApi.clear();
      } catch (err) {
        console.warn('Backend cart clear error:', err.message);
      }
    }
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
        syncBackendCart,
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

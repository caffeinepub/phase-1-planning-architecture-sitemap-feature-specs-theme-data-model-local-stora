import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../lib/localStorage';

const CART_STORAGE_KEY = 'app_localCart_v1';
const CART_VERSION = 1;

export interface CartItem {
  productId: string; // Store as string to avoid bigint serialization issues
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

export function useLocalCart() {
  const [cart, setCart] = useState<CartState>(() => {
    const stored = getStorageItem<CartState>(CART_STORAGE_KEY, CART_VERSION);
    return stored || { items: [] };
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    setStorageItem(CART_STORAGE_KEY, cart, { version: CART_VERSION });
  }, [cart]);

  const addToCart = useCallback((productId: bigint, quantity: number = 1) => {
    const productIdStr = productId.toString();
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.productId === productIdStr);
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prev.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return { items: newItems };
      } else {
        // Add new item
        return {
          items: [...prev.items, { productId: productIdStr, quantity }],
        };
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: bigint) => {
    const productIdStr = productId.toString();
    setCart((prev) => ({
      items: prev.items.filter((item) => item.productId !== productIdStr),
    }));
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
    const productIdStr = productId.toString();
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.productId === productIdStr);
      
      if (existingIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingIndex] = { ...newItems[existingIndex], quantity };
        return { items: newItems };
      }
      
      return prev;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({ items: [] });
  }, []);

  const getItemQuantity = useCallback((productId: bigint): number => {
    const productIdStr = productId.toString();
    const item = cart.items.find((item) => item.productId === productIdStr);
    return item?.quantity || 0;
  }, [cart.items]);

  const getTotalItems = useCallback((): number => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart.items]);

  return {
    items: cart.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    getTotalItems,
  };
}

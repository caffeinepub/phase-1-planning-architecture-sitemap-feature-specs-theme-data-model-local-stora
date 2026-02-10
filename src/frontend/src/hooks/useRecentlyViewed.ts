import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../lib/localStorage';

interface RecentlyViewedItem {
  productId: number;
  viewedAt: number;
  productName: string;
  productPrice: number;
}

interface RecentlyViewedData {
  items: RecentlyViewedItem[];
  maxItems: number;
}

const STORAGE_KEY = 'app_recentlyViewed_v1';
const MAX_ITEMS = 20;
const EXPIRY_DAYS = 30;

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  // Load items on mount
  useEffect(() => {
    const data = getStorageItem<RecentlyViewedData>(STORAGE_KEY);
    if (data) {
      setItems(data.items);
    }
  }, []);

  // Add item to recently viewed
  const addItem = useCallback((item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    setItems(prevItems => {
      // Remove existing entry for this product
      const filtered = prevItems.filter(i => i.productId !== item.productId);
      
      // Add new entry at the beginning
      const newItems = [
        { ...item, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      // Save to localStorage
      setStorageItem<RecentlyViewedData>(
        STORAGE_KEY,
        { items: newItems, maxItems: MAX_ITEMS },
        { expiresIn: EXPIRY_DAYS * 24 * 60 * 60 * 1000 }
      );

      return newItems;
    });
  }, []);

  // Clear all items
  const clearItems = useCallback(() => {
    setItems([]);
    setStorageItem<RecentlyViewedData>(
      STORAGE_KEY,
      { items: [], maxItems: MAX_ITEMS }
    );
  }, []);

  return {
    items,
    addItem,
    clearItems,
  };
}

import { useCallback, useEffect, useState } from 'react';
import type { ProductResponse } from '@/types';

// No backend wishlist feature exists yet — this persists per-device in
// localStorage. Swap for real api/wishlist.ts calls once a Wishlist entity
// and endpoints ship on the backend.
const WISHLIST_KEY = 'p5store_wishlist';

function readWishlist(): ProductResponse[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as ProductResponse[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: ProductResponse[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('wishlist-changed'));
}

export function useWishlist() {
  const [items, setItems] = useState<ProductResponse[]>(readWishlist);

  useEffect(() => {
    const sync = () => setItems(readWishlist());
    window.addEventListener('wishlist-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('wishlist-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((product: ProductResponse) => {
    const current = readWishlist();
    if (current.some((p) => p.id === product.id)) return;
    writeWishlist([...current, product]);
  }, []);

  const remove = useCallback((productId: number) => {
    writeWishlist(readWishlist().filter((p) => p.id !== productId));
  }, []);

  const has = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  );

  return { items, add, remove, has };
}

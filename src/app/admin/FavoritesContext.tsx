"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { accountStorageKey } from "../lib/accountStorage";

export interface Favorite {
  id: string;       // unique key (e.g. order code)
  label: string;    // display name
  sub?: string;     // secondary line (customer name, date, etc.)
  href: string;     // navigation link
}

interface FavCtx {
  favs: Favorite[];
  toggle: (item: Favorite) => void;
  isFav: (id: string) => boolean;
}

const Ctx = createContext<FavCtx>({ favs: [], toggle: () => {}, isFav: () => false });

const STORAGE_KEY = "admin_favorites_v2";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favs, setFavs] = useState<Favorite[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(accountStorageKey(STORAGE_KEY));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- aktif hesaba ait kayıt hydration sonrasında okunur
      if (stored) setFavs(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = useCallback((item: Favorite) => {
    setFavs(prev => {
      const exists = prev.some(f => f.id === item.id);
      const next   = exists ? prev.filter(f => f.id !== item.id) : [...prev, item];
      try { localStorage.setItem(accountStorageKey(STORAGE_KEY), JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isFav = useCallback((id: string) => favs.some(f => f.id === id), [favs]);

  return <Ctx.Provider value={{ favs, toggle, isFav }}>{children}</Ctx.Provider>;
}

export function useFavorites() { return useContext(Ctx); }

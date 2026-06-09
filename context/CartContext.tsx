"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  stock: number | null; // null = без ограничения
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // загрузка корзины из localStorage при старте
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // битые данные — игнорируем
    }
    setLoaded(true);
  }, []);

  // сохраняем при изменениях
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  // ограничиваем количество остатком (если он задан)
  const cap = (qty: number, stock: number | null) =>
    stock == null ? Math.max(1, qty) : Math.max(1, Math.min(qty, stock));

  const add: CartContextType["add"] = (item, qty = 1) => {
    if (item.stock === 0) return; // нет в наличии
    setItems((prev) => {
      const found = prev.find((i) => i.productId === item.productId);
      if (found) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, stock: item.stock, qty: cap(i.qty + qty, item.stock) }
            : i
        );
      }
      return [...prev, { ...item, qty: cap(qty, item.stock) }];
    });
  };

  const remove = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const setQty = (productId: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, qty: cap(qty, i.stock) } : i
      )
    );

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart должен использоваться внутри CartProvider");
  return ctx;
}

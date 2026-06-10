"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, setQty, remove, total } = useCart();

  // закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* затемнение */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[65] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* панель */}
      <aside
        aria-label="Корзина"
        className={`fixed right-0 top-0 z-[66] flex h-full w-full max-w-sm flex-col bg-surface text-foreground shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold">Корзина</h2>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="text-2xl leading-none text-muted transition hover:text-foreground"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-muted">
            <p>Корзина пуста</p>
            <Link
              href="/products"
              onClick={onClose}
              className="text-accent underline underline-offset-2"
            >
              Перейти к товарам →
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {items.map((it) => (
                <div
                  key={it.productId}
                  className="flex gap-3 rounded-lg border border-border p-2"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-img-bg">
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{it.title}</p>
                    <p className="text-sm text-accent">{it.price} грн</p>

                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => setQty(it.productId, it.qty - 1)}
                        aria-label="Меньше"
                        className="flex h-6 w-6 items-center justify-center rounded border border-border"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button
                        onClick={() => setQty(it.productId, it.qty + 1)}
                        aria-label="Больше"
                        className="flex h-6 w-6 items-center justify-center rounded border border-border"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(it.productId)}
                    aria-label="Удалить"
                    className="self-start text-xl leading-none text-red-400 transition hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4">
              <div className="mb-3 flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-accent">{total} грн</span>
              </div>
              <Link
                href="/cart"
                onClick={onClose}
                className="block rounded-lg bg-accent py-3 text-center font-bold text-neutral-900 transition hover:opacity-90"
              >
                Перейти в корзину →
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

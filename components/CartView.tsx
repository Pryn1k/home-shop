"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartView() {
  const { items, setQty, remove, total, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{
    orderNo: number | null;
    total: number;
    count: number;
  } | null>(null);

  if (confirmed) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-2xl">✅</p>
        <h2 className="mt-2 text-xl font-bold">
          {confirmed.orderNo != null
            ? `Заказ №${confirmed.orderNo} принят`
            : "Заказ принят"}
        </h2>
        <p className="mt-2 text-muted">
          {confirmed.count} тов. на сумму{" "}
          <span className="font-semibold text-accent">{confirmed.total} грн</span>
        </p>
        <p className="mt-1 text-muted">
          Мы свяжемся с вами по телефону для подтверждения.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 font-bold text-neutral-900 transition hover:opacity-90"
        >
          Продолжить покупки
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-muted">
        Корзина пуста.{" "}
        <Link href="/products" className="text-accent underline">
          Перейти к товарам →
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Укажите имя и телефон");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          comment,
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            qty: i.qty,
          })),
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // фиксируем итог до очистки корзины
        const orderTotal = total;
        const itemCount = items.reduce((n, i) => n + i.qty, 0);
        clear();
        setConfirmed({ orderNo: data.orderNo ?? null, total: orderTotal, count: itemCount });
      } else {
        setError(data.error || "Не удалось оформить заказ");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {/* СПИСОК ТОВАРОВ */}
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <div
            key={it.productId}
            className="flex items-center gap-4 rounded-xl border bg-surface p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-img-bg">
              <Image
                src={it.image}
                alt={it.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{it.title}</p>
              <p className="text-sm text-accent">{it.price} грн</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty(it.productId, it.qty - 1)}
                aria-label="Меньше"
                className="h-7 w-7 rounded border"
              >
                −
              </button>
              <span className="w-6 text-center">{it.qty}</span>
              <button
                type="button"
                onClick={() => setQty(it.productId, it.qty + 1)}
                aria-label="Больше"
                className="h-7 w-7 rounded border"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => remove(it.productId)}
              aria-label="Удалить"
              className="text-xl leading-none text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* ИТОГО */}
      <div className="flex justify-between text-lg font-bold">
        <span>Итого:</span>
        <span className="text-accent">{total} грн</span>
      </div>

      {/* ОФОРМЛЕНИЕ */}
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          className="rounded border p-2"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />
        <input
          className="rounded border p-2"
          type="tel"
          inputMode="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={30}
          required
        />
        <textarea
          className="rounded border p-2"
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-accent py-3 font-bold text-neutral-900 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Отправка..." : "Оформить заказ"}
        </button>
      </form>
    </div>
  );
}

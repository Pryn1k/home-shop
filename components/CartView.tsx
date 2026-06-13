"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { shop } from "@/lib/shop";
import { deliveryLabel, paymentLabel } from "@/lib/orderLabels";

export default function CartView() {
  const { items, setQty, remove, total, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [delivery, setDelivery] = useState<"pickup" | "nova_poshta">("pickup");
  const [payment, setPayment] = useState<"on_receipt" | "prepaid">("on_receipt");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{
    orderNo: number | null;
    items: { title: string; price: number; qty: number }[];
    total: number;
    name: string;
    phone: string;
    date: string;
    delivery: "pickup" | "nova_poshta";
    payment: "on_receipt" | "prepaid";
    address: string;
  } | null>(null);

  if (confirmed) {
    return (
      <div className="flex flex-col gap-4">
        {/* ЧЕК (печатается отдельно) */}
        <div className="receipt-printable rounded-xl border border-border bg-surface p-6">
          <div className="text-center">
            <p className="text-2xl">✅</p>
            <h2 className="mt-1 text-xl font-bold">
              {confirmed.orderNo != null
                ? `Заказ №${confirmed.orderNo} принят`
                : "Заказ принят"}
            </h2>
            <p className="mt-1 text-sm text-muted">{confirmed.date}</p>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 font-semibold">{shop.name}</p>
            <ul className="flex flex-col gap-1 text-sm">
              {confirmed.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {it.title} × {it.qty}
                  </span>
                  <span className="whitespace-nowrap">
                    {it.price * it.qty} грн
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-bold">
              <span>Итого:</span>
              <span className="text-accent">{confirmed.total} грн</span>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4 text-sm text-muted">
            <p>
              Покупатель:{" "}
              <span className="text-foreground">{confirmed.name}</span>
            </p>
            <p>
              Телефон: <span className="text-foreground">{confirmed.phone}</span>
            </p>
            <p>
              Получение:{" "}
              <span className="text-foreground">
                {deliveryLabel(confirmed.delivery)}
                {confirmed.delivery === "nova_poshta" && confirmed.address
                  ? ` — ${confirmed.address}`
                  : ""}
              </span>
            </p>
            <p>
              Оплата:{" "}
              <span className="text-foreground">
                {paymentLabel(confirmed.payment)}
              </span>
            </p>
          </div>

          <div className="mt-4 border-t border-border pt-4 text-center text-sm text-muted">
            {confirmed.delivery === "pickup" ? (
              <p className="mb-2 font-medium text-foreground">
                Сохраните чек и предъявите его при получении в магазине.
              </p>
            ) : (
              <p className="mb-2 font-medium text-foreground">
                Отправим Новой почтой после подтверждения.
              </p>
            )}
            <p>{shop.address}</p>
            <p>{shop.phone}</p>
            <p className="mt-2">
              Спасибо за заказ! Мы свяжемся с вами для подтверждения.
            </p>
          </div>
        </div>

        {/* КНОПКИ (не печатаются) */}
        <div className="flex flex-wrap justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-accent px-5 py-2.5 font-bold text-neutral-900 transition hover:opacity-90"
          >
            🧾 Скачать чек
          </button>
          <Link
            href="/products"
            className="rounded-lg border border-accent px-5 py-2.5 font-medium text-accent transition hover:bg-accent hover:text-neutral-900"
          >
            Продолжить покупки
          </Link>
        </div>

        {confirmed.orderNo != null && (
          <p className="text-center text-sm text-muted print:hidden">
            Статус заказа можно проверить на странице{" "}
            <Link href="/order" className="text-accent hover:underline">
              «Проверить заказ»
            </Link>{" "}
            по номеру и телефону.
          </p>
        )}
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
    if (delivery === "nova_poshta" && !address.trim()) {
      setError("Укажите город и отделение Новой почты");
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
          delivery,
          payment,
          address,
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
        // снимок заказа до очистки корзины — для чека
        const snapshot = {
          orderNo: data.orderNo ?? null,
          items: items.map((i) => ({
            title: i.title,
            price: i.price,
            qty: i.qty,
          })),
          total,
          name: name.trim(),
          phone: phone.trim(),
          date: new Date().toLocaleString("ru-RU"),
          delivery,
          payment,
          address: address.trim(),
        };
        clear();
        setConfirmed(snapshot);
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
          onChange={(e) =>
            setPhone(e.target.value.replace(/[^\d+\s()-]/g, ""))
          }
          maxLength={30}
          required
        />
        {/* СПОСОБ ПОЛУЧЕНИЯ */}
        <fieldset className="rounded border border-border p-3">
          <legend className="px-1 text-sm font-medium text-muted">
            Способ получения
          </legend>
          <label className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="radio"
              name="delivery"
              className="accent-accent"
              checked={delivery === "pickup"}
              onChange={() => setDelivery("pickup")}
            />
            <span>Самовывоз из магазина</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="radio"
              name="delivery"
              className="accent-accent"
              checked={delivery === "nova_poshta"}
              onChange={() => setDelivery("nova_poshta")}
            />
            <span>Доставка Новой почтой</span>
          </label>
          {delivery === "nova_poshta" && (
            <input
              className="mt-2 w-full rounded border border-border p-2"
              placeholder="Город и № отделения Новой почты"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={300}
              required
            />
          )}
        </fieldset>

        {/* ОПЛАТА */}
        <fieldset className="rounded border border-border p-3">
          <legend className="px-1 text-sm font-medium text-muted">Оплата</legend>
          <label className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="radio"
              name="payment"
              className="accent-accent"
              checked={payment === "on_receipt"}
              onChange={() => setPayment("on_receipt")}
            />
            <span>При получении</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="radio"
              name="payment"
              className="accent-accent"
              checked={payment === "prepaid"}
              onChange={() => setPayment("prepaid")}
            />
            <span>Предоплата</span>
          </label>
        </fieldset>

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

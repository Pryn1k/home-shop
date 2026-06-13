"use client";

import { useState } from "react";
import { statusLabel, deliveryLabel, paymentLabel } from "@/lib/orderLabels";

type FoundOrder = {
  orderNo: number;
  status: string;
  createdAt: string;
  items: { title: string; qty: number; price: number }[] | null;
  total: number | null;
  delivery: string;
  payment: string;
  deliveryAddress: string | null;
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-badge-new/15 text-badge-new",
  processing: "bg-accent/15 text-accent",
  done: "bg-badge-new/15 text-badge-new",
};

const STATUS_STEP: Record<string, number> = {
  new: 1,
  processing: 2,
  done: 3,
};

export default function OrderLookup() {
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoundOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const res = await fetch("/api/order/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, phone }),
      });
      const data = await res.json();
      if (data.found) {
        setResult(data.order);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const step = result ? STATUS_STEP[result.status] ?? 1 : 0;

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="rounded-lg border border-border bg-surface p-2.5"
          type="tel"
          inputMode="numeric"
          placeholder="Номер заказа (например, 5)"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value.replace(/\D/g, ""))}
          required
        />
        <input
          className="rounded-lg border border-border bg-surface p-2.5"
          type="tel"
          placeholder="Телефон (как при заказе)"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/[^\d+\s()-]/g, ""))
          }
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent py-2.5 font-bold text-neutral-900 transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Проверяем..." : "Проверить заказ"}
        </button>
      </form>

      {notFound && (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          Заказ не найден. Проверьте номер заказа и телефон — телефон должен
          совпадать с тем, что вы указали при оформлении.
        </div>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Заказ №{result.orderNo}</h2>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                STATUS_STYLE[result.status] ?? "bg-accent/15 text-accent"
              }`}
            >
              {statusLabel(result.status)}
            </span>
          </div>

          {/* прогресс */}
          <div className="mt-4 flex items-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full ${
                  n <= step ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>Принят</span>
            <span>В работе</span>
            <span>Готов</span>
          </div>

          {result.items && result.items.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-1 text-sm font-semibold text-muted">Товары</p>
              <ul className="space-y-1 text-sm">
                {result.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span>
                      {it.title} × {it.qty}
                    </span>
                    <span className="text-muted">{it.price * it.qty} грн</span>
                  </li>
                ))}
              </ul>
              {result.total != null && (
                <p className="mt-2 text-right font-bold">
                  Итого: {result.total} грн
                </p>
              )}
            </div>
          )}

          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <p>
              <span className="text-muted">Получение: </span>
              {deliveryLabel(result.delivery)}
              {result.delivery === "nova_poshta" && result.deliveryAddress
                ? ` — ${result.deliveryAddress}`
                : ""}
            </p>
            <p>
              <span className="text-muted">Оплата: </span>
              {paymentLabel(result.payment)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
